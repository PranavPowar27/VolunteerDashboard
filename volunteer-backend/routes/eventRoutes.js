const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// Create Event (Admin only)
router.post('/', auth, admin, async (req, res) => {
  try {
    const event = new Event({ ...req.body, createdBy: req.user._id });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get All Events (Public)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('volunteers', 'name email');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/stats/donations', auth, admin, async (req, res) => {
  const total = await Donation.aggregate([
    { $group: { _id: null, totalAmount: { $sum: '$amount' } } },
  ]);
  res.json({ totalDonations: total[0]?.totalAmount || 0 });
});
router.get('/stats/volunteers', auth, admin, async (req, res) => {
  const events = await Event.find().select('title volunteers');
  const stats = events.map((e) => ({
    title: e.title,
    volunteerCount: e.volunteers.length,
  }));
  res.json(stats);
});
router.get('/stats/funding', auth, admin, async (req, res) => {
  const events = await Event.find().select('title goalAmount currentAmount');
  const stats = events.map((e) => ({
    title: e.title,
    goal: e.goalAmount,
    raised: e.currentAmount,
    percent: Math.floor((e.currentAmount / e.goalAmount) * 100),
  }));
  res.json(stats);
});
router.get('/:id/volunteers', auth, admin, async (req, res) => {
  const event = await Event.findById(req.params.id).populate('volunteers.user', 'name email');
  if (!event) return res.status(404).json({ message: 'Event not found' });

  res.json(event.volunteers);
});
router.get('/my-volunteer-events', auth, async (req, res) => {
  const events = await Event.find({
    'volunteers.user': req.user._id,
  }).select('title date location goalAmount currentAmount volunteers');

  const filtered = events.map((event) => {
    const v = event.volunteers.find(
      (vol) => vol.user.toString() === req.user._id.toString()
    );
    return {
      _id: event._id,
      title: event.title,
      date: event.date,
      location: event.location,
      goalAmount: event.goalAmount,
      currentAmount: event.currentAmount,
      status: v?.status || 'pending',
    };
  });

  res.json(filtered);
});
// Update Event (Admin only)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Event (Admin only)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Volunteer signup for an event
router.post('/:id/signup', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.volunteers.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already signed up for this event' });
    }

    event.volunteers.push(req.user._id);
    await event.save();
    res.json({ message: 'Successfully signed up', event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/:id/volunteer', auth, async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user._id;

  const event = await Event.findById(eventId);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  if (event.volunteers.includes(userId)) {
    return res.status(400).json({ message: 'Already volunteered' });
  }

  event.volunteers.push(userId);
  await event.save();

  res.status(200).json({ message: 'Volunteer added' });
});


router.put('/:eventId/approve/:userId', auth, admin, async (req, res) => {
  const event = await Event.findById(req.params.eventId);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  const volunteer = event.volunteers.find(
    (v) => v.user.toString() === req.params.userId
  );
  if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });

  volunteer.status = 'approved';
  await event.save();
  res.json({ message: 'Volunteer approved' });
});
router.delete('/:eventId/volunteer', auth, async (req, res) => {
  const event = await Event.findById(req.params.eventId);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  const index = event.volunteers.findIndex(
    (v) => v.user.toString() === req.user._id.toString()
  );
  if (index === -1) return res.status(400).json({ message: 'You are not a volunteer for this event' });

  event.volunteers.splice(index, 1);
  await event.save();
  res.json({ message: 'Volunteer request cancelled' });
});
router.get('/my-volunteer-badge', auth, async (req, res) => {
  const count = await Event.countDocuments({
    'volunteers.user': req.user._id,
    'volunteers.status': 'approved',
  });

  let badge = 'New Volunteer';
  if (count >= 5) badge = 'Community Champion';
  else if (count >= 2) badge = 'Active Helper';

  res.json({ badge, count });
});

module.exports = router;