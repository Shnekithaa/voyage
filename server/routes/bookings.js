import express from 'express';
import Booking from '../models/Booking.js';
import Hotel from '../models/Hotel.js';
import Destination from '../models/Destination.js';
import { verifyToken, optionalAuth } from '../middleware/auth.js';
import { generateItinerary } from '../services/openaiService.js';
import { sendVibeTicketEmail } from '../services/emailService.js';

const router = express.Router();

/**
 * POST /api/bookings/calculate
 * Calculate pricing for a potential booking
 */
router.post('/calculate', async (req, res, next) => {
  try {
    const { hotelId, roomTypeName, checkIn, checkOut, guests } = req.body;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ success: false, error: 'Hotel not found' });
    }

    const roomType = hotel.roomTypes.find((r) => r.name === roomTypeName);
    if (!roomType) {
      return res.status(404).json({ success: false, error: 'Room type not found' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    if (nights < 1) {
      return res.status(400).json({ success: false, error: 'Invalid date range' });
    }

    const roomRate = roomType.pricePerNight;
    const totalBeforeTax = roomRate * nights;
    const taxRate = 0.12; // 12% tax
    const taxAmount = Math.round(totalBeforeTax * taxRate * 100) / 100;
    const totalAmount = Math.round((totalBeforeTax + taxAmount) * 100) / 100;

    res.status(200).json({
      success: true,
      data: {
        hotel: hotel.name,
        roomType: roomType.name,
        pricePerNight: roomRate,
        nights,
        totalBeforeTax,
        taxRate: `${taxRate * 100}%`,
        taxAmount,
        totalAmount,
        currency: 'USD',
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/bookings/user
 * Get all bookings for the authenticated user
 */
router.get('/user', verifyToken, async (req, res, next) => {
  try {
    const query = {
      $or: [
        { userId: req.user.uid },
        ...(req.user.email ? [{ 'guestInfo.email': req.user.email.toLowerCase() }] : []),
      ],
    };
    console.log('📋 GET /user — uid:', req.user.uid, '| email:', req.user.email, '| query:', JSON.stringify(query));

    const bookings = await Booking.find(query)
      .populate('destination', 'city country heroImage vibeCategories')
      .populate('hotel', 'name heroImage address starRating')
      .sort({ createdAt: -1 });

    console.log('📋 GET /user — found', bookings.length, 'booking(s)');

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/bookings/create
 * Create a booking without Stripe payment, generate itinerary, send email
 */
router.post('/create', optionalAuth, async (req, res, next) => {
  try {
    const { hotelId, roomTypeName, checkIn, checkOut, guestInfo, guests, vibeSearch } = req.body;

    if (!hotelId || !roomTypeName || !checkIn || !checkOut || !guestInfo?.email) {
      return res.status(400).json({ success: false, error: 'Missing required booking information' });
    }

    const hotel = await Hotel.findById(hotelId).populate('destination');
    if (!hotel) {
      return res.status(404).json({ success: false, error: 'Hotel not found' });
    }

    const roomType = hotel.roomTypes.find((r) => r.name === roomTypeName);
    if (!roomType) {
      return res.status(404).json({ success: false, error: 'Room type not found' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    if (nights < 1) {
      return res.status(400).json({ success: false, error: 'Invalid dates' });
    }

    const totalBeforeTax = roomType.pricePerNight * nights;
    const taxAmount = Math.round(totalBeforeTax * 0.12 * 100) / 100;
    const totalAmount = Math.round((totalBeforeTax + taxAmount) * 100) / 100;

    console.log('📋 Creating booking — userId:', req.user?.uid || 'NONE', '| email:', guestInfo.email);

    const booking = await Booking.create({
      userId: req.user?.uid || null,
      guestInfo,
      destination: hotel.destination._id,
      hotel: hotel._id,
      roomType: { name: roomType.name, pricePerNight: roomType.pricePerNight },
      checkIn: checkInDate,
      checkOut: checkOutDate,
      nights,
      guests: guests || { adults: 1, children: 0 },
      pricing: { roomRate: roomType.pricePerNight, totalBeforeTax, taxAmount, totalAmount, currency: 'USD' },
      vibeSearch: vibeSearch || {},
      payment: { status: 'completed', paidAt: new Date(), method: 'direct' },
      status: 'confirmed',
    });

    res.status(200).json({
      success: true,
      data: {
        bookingReference: booking.bookingReference,
        totalAmount,
        bookingId: booking._id,
      },
    });

    // Continue heavy work in background so checkout never times out for users.
    setImmediate(async () => {
      const destination = hotel.destination;
      let itinerary = '';

      try {
        itinerary = await generateItinerary(
          destination,
          hotel,
          vibeSearch?.vibe || 'cultural exploration',
          nights.toString()
        );

        await Booking.findByIdAndUpdate(booking._id, { itinerary });
      } catch (err) {
        console.warn('Itinerary generation failed:', err.message);
      }

      try {
        const emailResult = await sendVibeTicketEmail(
          { ...booking.toObject(), itinerary },
          destination,
          hotel,
          itinerary || 'Itinerary will be emailed shortly.'
        );

        if (emailResult.success) {
          await Booking.findByIdAndUpdate(booking._id, { emailSent: true });
        }

        console.log(`📧 Email sent for ${booking.bookingReference}: ${emailResult.success}`);
      } catch (err) {
        console.warn('Email sending failed:', err.message);
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/bookings/:reference
 * Look up booking by reference code
 */
router.get('/:reference', async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      bookingReference: req.params.reference.toUpperCase(),
    })
      .populate('destination', 'city country heroImage')
      .populate('hotel', 'name heroImage address');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
});

export default router;