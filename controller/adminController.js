const User = require('../models/userModel');

exports.approveRestaurant = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUser = await User.updateApprovalStatus(id, 'approved'); // Set status to 'approved'
    res.status(200).json({ message: 'Restaurant owner approved successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve restaurant owner' });
  }
};

exports.rejectRestaurant = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedUser = await User.updateApprovalStatus(id, 'rejected'); // Set status to 'rejected'
    res.status(200).json({ message: 'Restaurant owner rejected', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject restaurant owner' });
  }
};