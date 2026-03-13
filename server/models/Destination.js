import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: [true, 'City name is required'],
      trim: true,
      index: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    continent: {
      type: String,
      required: true,
      enum: ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania', 'Antarctica'],
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
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
    vibeKeywords: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    vibeCategories: [
      {
        type: String,
        enum: [
          'dark academia',
          'tropical luxury',
          'urban explorer',
          'zen retreat',
          'adventure seeker',
          'romantic escape',
          'cultural immersion',
          'party central',
          'digital nomad',
          'eco wanderer',
          'winter wonderland',
          'coastal chill',
          'foodie paradise',
          'historical journey',
          'artistic soul',
        ],
      },
    ],
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    averageCostPerDay: {
      budget: { type: Number, required: true },     // $ per day for budget travel
      moderate: { type: Number, required: true },    // $ per day moderate
      luxury: { type: Number, required: true },      // $ per day luxury
    },
    bestSeasons: [
      {
        type: String,
        enum: ['spring', 'summer', 'fall', 'winter'],
      },
    ],
    highlights: [
      {
        name: String,
        type: {
          type: String,
          enum: ['landmark', 'restaurant', 'experience', 'nature', 'nightlife'],
        },
        description: String,
      },
    ],
    safetyRating: {
      type: Number,
      min: 1,
      max: 10,
      default: 7,
    },
    popularityScore: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: get all hotels in this destination
destinationSchema.virtual('hotels', {
  ref: 'Hotel',
  localField: '_id',
  foreignField: 'destination',
});

// Index for vibe-based searching
destinationSchema.index({ vibeKeywords: 1 });
destinationSchema.index({ vibeCategories: 1 });
destinationSchema.index({ 'averageCostPerDay.budget': 1 });
destinationSchema.index({ isActive: 1, popularityScore: -1 });

// Text index for full-text search
destinationSchema.index({
  city: 'text',
  country: 'text',
  description: 'text',
  vibeKeywords: 'text',
});

// Static method: find destinations matching vibe criteria
destinationSchema.statics.findByVibe = async function (vibeCategories, budgetTier) {
  const query = {
    isActive: true,
    vibeCategories: { $in: vibeCategories },
  };

  return this.find(query)
    .sort({ popularityScore: -1 })
    .limit(10)
    .lean();
};

// Increment popularity on selection
destinationSchema.methods.incrementPopularity = async function () {
  this.popularityScore += 1;
  return this.save();
};

const Destination = mongoose.model('Destination', destinationSchema);
export default Destination;