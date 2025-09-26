const express = require('express');
const Donation = require('../models/Donation');
const Event = require('../models/Event');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create a donation
router.post('/', auth, async (req, res) => {
  try {
    const { amount, method, event, message, transactionId } = req.body;

    const targetEvent = await Event.findById(event);
    if (!targetEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (targetEvent.currentAmount >= targetEvent.goalAmount) {
      return res.status(400).json({ message: 'This event is already fully funded' });
    }

    if (targetEvent.currentAmount + amount > targetEvent.goalAmount) {
      return res.status(400).json({ message: 'Donation exceeds goal amount' });
    }

    const donation = new Donation({
      donor: req.user._id,
      amount,
      method,
      event,
      message,
      transactionId, // ✅ Stored here
    });

    await donation.save();

    await Event.findByIdAndUpdate(event, {
      $inc: { currentAmount: amount },
    });

    res.status(201).json(donation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get donations for logged-in user
router.get('/my', auth, async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user._id }).populate('event', 'title date');
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch donations' });
  }
});
router.get('/all', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const donations = await Donation.find()
    .populate('donor', 'name email')
    .populate('event', 'title date');

  res.json(donations);
});



module.exports = router;