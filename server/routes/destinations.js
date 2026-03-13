import express from 'express';
import Destination from '../models/Destination.js';

const router = express.Router();


router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ success: false, error: 'Destination not found' });
    }
    res.json({ success: true, data: destination });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;