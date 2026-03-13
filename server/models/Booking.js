import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      index: true,
    },
    guestInfo: {
      firstName: { type: String, required: true, trim: true },
      lastName:  { type: String, required: true, trim: true },
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
      },
      phone: { type: String, trim: true },
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
    },
    roomType: {
      name:         { type: String, required: true },
      pricePerNight:{ type: Number, required: true },
    },
    checkIn: {
      type: Date,
      required: [true, 'Check-in date is required'],
    },
    checkOut: {
      type: Date,
      required: [true, 'Check-out date is required'],
    },
    nights: {
      type: Number,
      required: true,
      min: 1,
    },
    guests: {
      adults:   { type: Number, required: true, min: 1, default: 1 },
      children: { type: Number, default: 0 },
    },
    pricing: {
      roomRate:      { type: Number, required: true },
      totalBeforeTax:{ type: Number, required: true },
      taxAmount:     { type: Number, required: true },
      totalAmount:   { type: Number, required: true },
      currency:      { type: String, default: 'USD' },
    },
    vibeSearch: {
      budget:          String,
      duration:        String,
      vibe:            String,
      vibeMatchPercent:Number,
    },
    payment: {
      stripePaymentIntentId: { type: String },
      stripeCustomerId:      { type: String },
      status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
        default: 'pending',
      },
      paidAt: Date,
      method: { type: String, default: 'card' },
    },
    itinerary: {
      type: String, // AI-generated 3-day itinerary
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
      default: 'pending',
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ 'guestInfo.email': 1, createdAt: -1 });
bookingSchema.index({ 'payment.stripePaymentIntentId': 1 });
bookingSchema.index({ status: 1 });

// ─── Pre-validate: generate booking reference ─────────────────────────────────
// Async hook — no `next` parameter needed; throw to signal errors.
bookingSchema.pre('validate', async function () {
  if (!this.bookingReference) {
    const prefix    = 'VV';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random    = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.bookingReference = `${prefix}-${timestamp}-${random}`;
  }
});

// ─── Pre-save: calculate nights + validate date order ─────────────────────────
// ONE async hook replaces the two separate next()-based hooks.
// Mongoose async pre hooks do not use `next` — just throw to abort.
bookingSchema.pre('save', async function () {
  if (this.checkIn && this.checkOut) {
    const checkInDate  = new Date(this.checkIn);
    const checkOutDate = new Date(this.checkOut);

    // Validate date order
    if (checkOutDate <= checkInDate) {
      throw new Error('Check-out date must be after check-in date');
    }

    // Recalculate nights
    const diffMs = checkOutDate - checkInDate;
    this.nights  = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;