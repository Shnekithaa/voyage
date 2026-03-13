import express from 'express';
import Stripe from 'stripe';
import Booking from '../models/Booking.js';
import Hotel from '../models/Hotel.js';
import Destination from '../models/Destination.js';
import { generateItinerary } from '../services/openaiService.js';
import { sendVibeTicketEmail } from '../services/emailService.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * POST /api/payments/create-intent
 * Create a Stripe Payment Intent and a pending booking
 */
router.post('/create-intent', optionalAuth, async (req, res, next) => {
  try {
    const {
      hotelId,
      roomTypeName,
      checkIn,
      checkOut,
      guestInfo,
      guests,
      vibeSearch,
    } = req.body;

    // Validate all required fields
    if (!hotelId || !roomTypeName || !checkIn || !checkOut || !guestInfo?.email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required booking information',
      });
    }

    // Fetch hotel & destination data
    const hotel = await Hotel.findById(hotelId).populate('destination');
    if (!hotel) {
      return res.status(404).json({ success: false, error: 'Hotel not found' });
    }

    const roomType = hotel.roomTypes.find((r) => r.name === roomTypeName);
    if (!roomType) {
      return res.status(404).json({ success: false, error: 'Room type not found' });
    }

    // Calculate pricing
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    if (nights < 1) {
      return res.status(400).json({ success: false, error: 'Invalid dates' });
    }

    const totalBeforeTax = roomType.pricePerNight * nights;
    const taxAmount = Math.round(totalBeforeTax * 0.12 * 100) / 100;
    const totalAmount = Math.round((totalBeforeTax + taxAmount) * 100) / 100;

    // Create Stripe Payment Intent (amount in cents)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: 'usd',
      metadata: {
        hotelId: hotel._id.toString(),
        roomType: roomTypeName,
        checkIn,
        checkOut,
        guestEmail: guestInfo.email,
      },
      receipt_email: guestInfo.email,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Create pending booking in database
    const booking = await Booking.create({
      userId: req.user?.uid || null,
      guestInfo,
      destination: hotel.destination._id,
      hotel: hotel._id,
      roomType: {
        name: roomType.name,
        pricePerNight: roomType.pricePerNight,
      },
      checkIn: checkInDate,
      checkOut: checkOutDate,
      nights,
      guests: guests || { adults: 1, children: 0 },
      pricing: {
        roomRate: roomType.pricePerNight,
        totalBeforeTax,
        taxAmount,
        totalAmount,
        currency: 'USD',
      },
      vibeSearch: vibeSearch || {},
      payment: {
        stripePaymentIntentId: paymentIntent.id,
        status: 'pending',
      },
    });

    res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        bookingReference: booking.bookingReference,
        totalAmount,
        bookingId: booking._id,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/payments/webhook
 * Stripe webhook to handle payment completion
 */
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      await handlePaymentSuccess(paymentIntent);
    }

    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      await Booking.findOneAndUpdate(
        { 'payment.stripePaymentIntentId': paymentIntent.id },
        {
          'payment.status': 'failed',
          status: 'cancelled',
        }
      );
    }

    res.json({ received: true });
  }
);

/**
 * POST /api/payments/confirm
 * Manual confirmation endpoint (for testing or when webhooks aren't set up)
 */
router.post('/confirm', async (req, res, next) => {
  try {
    const { paymentIntentId, bookingId } = req.body;

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        error: `Payment not completed. Status: ${paymentIntent.status}`,
      });
    }

    const result = await handlePaymentSuccess(paymentIntent);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Handle successful payment: update booking, generate itinerary, send email
 */
async function handlePaymentSuccess(paymentIntent) {
  try {
    // Find and update booking
    const booking = await Booking.findOneAndUpdate(
      { 'payment.stripePaymentIntentId': paymentIntent.id },
      {
        'payment.status': 'completed',
        'payment.paidAt': new Date(),
        status: 'confirmed',
      },
      { new: true }
    );

    if (!booking) {
      console.error(`No booking found for payment intent: ${paymentIntent.id}`);
      return;
    }

    // Fetch full destination & hotel data
    const destination = await Destination.findById(booking.destination);
    const hotel = await Hotel.findById(booking.hotel);

    // Generate AI itinerary
    const itinerary = await generateItinerary(
      destination,
      hotel,
      booking.vibeSearch?.vibe || 'cultural exploration',
      booking.nights.toString()
    );

    // Save itinerary to booking
    booking.itinerary = itinerary;
    await booking.save();

    // Send Vibe Ticket email
    const emailResult = await sendVibeTicketEmail(
      booking,
      destination,
      hotel,
      itinerary
    );

    if (emailResult.success) {
      booking.emailSent = true;
      await booking.save();
    }

    console.log(
      `✅ Booking ${booking.bookingReference} confirmed. Email sent: ${emailResult.success}`
    );

    return {
      bookingReference: booking.bookingReference,
      itinerary,
      emailSent: emailResult.success,
    };
  } catch (error) {
    console.error('Payment success handler error:', error);
  }
}

export default router;