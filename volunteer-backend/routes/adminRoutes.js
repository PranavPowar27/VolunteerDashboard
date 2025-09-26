const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Donation = require('../models/Donation');
const Event = require('../models/Event');
const User = require('../models/User');

// GET all users (admin only)
router.get('/users', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

  const users = await User.find().select('name email role createdAt');
  res.json(users);
});
router.get('/stats/donations', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

  const totalAmount = await Donation.aggregate([
    { $group: { _id: null, totalDonations: { $sum: '$amount' } } }
  ]);

  res.json({ totalDonations: totalAmount[0]?.totalDonations || 0 });
});

router.get('/stats/volunteers', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

  const events = await Event.find().populate('volunteers', '_id');
  const stats = events.map((e) => ({
    title: e.title,
    volunteerCount: e.volunteers.length,
  }));

  res.json(stats);
});

router.get('/stats/funding', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

  const events = await Event.find();
  const stats = await Promise.all(events.map(async (e) => {
    const donations = await Donation.find({ event: e._id });
    const total = donations.reduce((sum, d) => sum + d.amount, 0);
    const percent = e.goalAmount ? Math.round((total / e.goalAmount) * 100) : 0;
    return { title: e.title, percent };
  }));

  res.json(stats);
});

router.get('/stats/summary', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

  const totalDonations = await Donation.aggregate([
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  const totalUsers = await User.countDocuments();
  const totalEvents = await Event.countDocuments();
  const totalVolunteers = await User.countDocuments({ role: 'volunteer' });

  res.json({
    totalDonations: totalDonations[0]?.total || 0,
    totalUsers,
    totalEvents,
    totalVolunteers,
  });
});

module.exports = router;