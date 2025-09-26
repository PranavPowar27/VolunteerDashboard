const donation = new Donation({
  user: req.user._id, // must be set correctly
  event: req.body.eventId,
  amount: req.body.amount,
  transactionId: req.body.transactionId,
});
await donation.save();