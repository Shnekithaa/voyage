import express from 'express';
import Hotel from '../models/Hotel.js';
import Destination from '../models/Destination.js';

const router = express.Router();

/**
 * GET /api/hotels/destination/:destinationId
 * Get all hotels for a specific destination
 */
router.get('/destination/:destinationId', async (req, res, next) => {
  try {
    const { destinationId } = req.params;
    const { minStars, maxPrice, amenities, sortBy } = req.query;

    // Verify destination exists
    const destination = await Destination.findById(destinationId).lean();
    if (!destination) {
      return res.status(404).json({
        success: false,
        error: 'Destination not found',
      });
    }

    // Build filters
    const filters = {};
    if (minStars) filters.minStars = parseInt(minStars);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice);
    if (amenities) filters.amenities = amenities.split(',');
    if (sortBy) filters.sortBy = sortBy;

    const hotels = await Hotel.findByDestination(destinationId, filters);

    // Increment destination popularity
    await Destination.findByIdAndUpdate(destinationId, {
      $inc: { popularityScore: 1 },
    });

    res.status(200).json({
      success: true,
      destination: {
        city: destination.city,
        country: destination.country,
        description: destination.description,
      },
      count: hotels.length,
      data: hotels,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/hotels/:hotelId
 * Get detailed info for a single hotel
 */
router.get('/:hotelId', async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.hotelId)
      .populate('destination', 'city country heroImage coordinates')
      .lean({ virtuals: true });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        error: 'Hotel not found',
      });
    }

    res.status(200).json({
      success: true,
      data: hotel,
    });
  } catch (error) {
    next(error);
  }
});

export default router;