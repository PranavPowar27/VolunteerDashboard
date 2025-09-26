const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['UPI', 'Card', 'Cash'], required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  message: String
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);