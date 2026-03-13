import mongoose from 'mongoose';

const roomTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Studio', 'Suite', 'Deluxe', 'Penthouse', 'Villa'],
  },
  description: {
    type: String,
    required: true,
    maxlength: 300,
  },
  pricePerNight: {
    type: Number,
    required: [true, 'Price per night is required'],
    min: [1, 'Price must be positive'],
  },
  maxGuests: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
    default: 2,
  },
  sizeSqFt: {
    type: Number,
    required: true,
  },
  bedConfiguration: {
    type: String,
    enum: ['1 King', '2 Queens', '1 Queen', '2 Doubles', '1 King + Sofa Bed'],
    default: '1 King',
  },
  images: [String],
  availability: {
    type: Boolean,
    default: true,
  },
  totalRooms: {
    type: Number,
    default: 10,
  },
  bookedRooms: {
    type: Number,
    default: 0,
  },
});

// Virtual for available rooms count
roomTypeSchema.virtual('availableRooms').get(function () {
  return this.totalRooms - this.bookedRooms;
});

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hotel name is required'],
      trim: true,
      index: true,
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: [true, 'Destination reference is required'],
      index: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    coordinates: {
      lat: Number,
      lng: Number,
    },
    starRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    userRating: {
      average: { type: Number, min: 0, max: 5, default: 0 },
      count: { type: Number, default: 0 },
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    heroImage: {
      type: String,
      required: true,
    },
    gallery: [
      {
        url: String,
        caption: String,
      },
    ],
    amenities: {
      breakfast: { type: Boolean, default: false },
      pool: { type: Boolean, default: false },
      privateBalcony: { type: Boolean, default: false },
      spa: { type: Boolean, default: false },
      gym: { type: Boolean, default: false },
      wifi: { type: Boolean, default: true },
      parking: { type: Boolean, default: false },
      roomService: { type: Boolean, default: false },
      bar: { type: Boolean, default: false },
      restaurant: { type: Boolean, default: false },
      concierge: { type: Boolean, default: false },
      airportShuttle: { type: Boolean, default: false },
      petFriendly: { type: Boolean, default: false },
      businessCenter: { type: Boolean, default: false },
    },
    roomTypes: [roomTypeSchema],
    vibeTag: {
      type: String,
      enum: [
        'Boutique Charm',
        'Ultra Luxury',
        'Modern Minimalist',
        'Historic Grandeur',
        'Eco Retreat',
        'Urban Chic',
        'Beachfront Paradise',
        'Mountain Lodge',
      ],
    },
    policies: {
      checkIn: { type: String, default: '3:00 PM' },
      checkOut: { type: String, default: '11:00 AM' },
      cancellation: {
        type: String,
        enum: ['Free cancellation', '24-hour cancellation', 'Non-refundable'],
        default: 'Free cancellation',
      },
      minimumStay: { type: Number, default: 1 },
    },
    contactInfo: {
      phone: String,
      email: String,
      website: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: lowest price across all room types
hotelSchema.virtual('startingPrice').get(function () {
  if (!this.roomTypes || this.roomTypes.length === 0) return 0;
  return Math.min(...this.roomTypes.map((r) => r.pricePerNight));
});

// Virtual: list of amenity names that are true
hotelSchema.virtual('amenityList').get(function () {
  if (!this.amenities) return [];
  const amenityLabels = {
    breakfast: 'Breakfast Included',
    pool: 'Swimming Pool',
    privateBalcony: 'Private Balcony',
    spa: 'Spa & Wellness',
    gym: 'Fitness Center',
    wifi: 'Free Wi-Fi',
    parking: 'Free Parking',
    roomService: '24/7 Room Service',
    bar: 'Bar & Lounge',
    restaurant: 'On-site Restaurant',
    concierge: 'Concierge Service',
    airportShuttle: 'Airport Shuttle',
    petFriendly: 'Pet Friendly',
    businessCenter: 'Business Center',
  };

  return Object.entries(this.amenities.toObject?.() || this.amenities)
    .filter(([_, value]) => value === true)
    .map(([key]) => amenityLabels[key] || key);
});

// Indexes
hotelSchema.index({ destination: 1, isActive: 1 });
hotelSchema.index({ starRating: -1 });
hotelSchema.index({ 'roomTypes.pricePerNight': 1 });
hotelSchema.index({ isFeatured: 1 });

// Static: find hotels by destination
hotelSchema.statics.findByDestination = async function (destinationId, filters = {}) {
  const query = {
    destination: destinationId,
    isActive: true,
  };

  if (filters.minStars) {
    query.starRating = { $gte: filters.minStars };
  }

  if (filters.maxPrice) {
    query['roomTypes.pricePerNight'] = { $lte: filters.maxPrice };
  }

  if (filters.amenities && filters.amenities.length > 0) {
    filters.amenities.forEach((amenity) => {
      query[`amenities.${amenity}`] = true;
    });
  }

  const sortOptions = {};
  switch (filters.sortBy) {
    case 'price_low':
      sortOptions['roomTypes.0.pricePerNight'] = 1;
      break;
    case 'price_high':
      sortOptions['roomTypes.0.pricePerNight'] = -1;
      break;
    case 'rating':
      sortOptions['userRating.average'] = -1;
      break;
    default:
      sortOptions.isFeatured = -1;
      sortOptions['userRating.average'] = -1;
  }

  return this.find(query)
    .populate('destination', 'city country')
    .sort(sortOptions)
    .lean({ virtuals: true });
};

const Hotel = mongoose.model('Hotel', hotelSchema);
export default Hotel;