import express from 'express';
import Destination from '../models/Destination.js';
import { matchVibeToDestinations } from '../services/openaiService.js';

const router = express.Router();

/**
 * POST /api/vibe/search
 * Main vibe search endpoint - matches user preferences to destinations using AI
 */
router.post('/search', async (req, res, next) => {
  try {
    const { budget, duration, vibe } = req.body;

    // Validate inputs
    if (!budget || !duration || !vibe) {
      return res.status(400).json({
        success: false,
        error: 'Please provide budget, duration, and vibe',
      });
    }

    if (vibe.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Vibe description is too short. Tell us more about your mood!',
      });
    }

    // Determine budget tier for pre-filtering
    const budgetMap = {
      budget: { max: 100 },
      moderate: { max: 250 },
      luxury: { max: 500 },
      'ultra-luxury': { max: 99999 },
    };

    const budgetTier = budget.toLowerCase();
    const budgetRange = budgetMap[budgetTier] || budgetMap['moderate'];

    // Fetch all active destinations from database
    const destinations = await Destination.find({ isActive: true })
      .select('-gallery -highlights')
      .lean();

    if (destinations.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No destinations available at this time. Please try again later.',
      });
    }

    // Use OpenAI to find the best vibe matches
    const aiMatches = await matchVibeToDestinations(budget, duration, vibe, destinations);

    if (!aiMatches || aiMatches.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Couldn't find a vibe match. Try describing your mood differently!",
      });
    }

    // Enrich AI matches with full destination data
    const enrichedMatches = await Promise.all(
      aiMatches.map(async (match) => {
        const fullDestination = destinations.find(
          (d) => d._id.toString() === match.id
        );

        if (!fullDestination) return null;

        return {
          ...fullDestination,
          vibeMatchPercent: match.vibeMatchPercent,
          vibeExplanation: match.explanation,
          vibeEmoji: match.vibeEmoji,
        };
      })
    );

    const validMatches = enrichedMatches.filter(Boolean);

    res.status(200).json({
      success: true,
      count: validMatches.length,
      searchParams: { budget, duration, vibe },
      data: validMatches,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/vibe/trending
 * Get trending/popular destinations
 */
router.get('/trending', async (req, res, next) => {
  try {
    const trending = await Destination.find({ isActive: true })
      .sort({ popularityScore: -1 })
      .limit(6)
      .select('city country heroImage vibeCategories averageCostPerDay description')
      .lean();

    res.status(200).json({
      success: true,
      data: trending,
    });
  } catch (error) {
    next(error);
  }
});

export default router;