const pool = require('../db/db');
const User = require('../models/userModel');

exports.approveRestaurantOwner = async (req, res) => {
  const { id } = req.params; // Restaurant owner's user ID from request parameters

  try {
    const updatedUser = await User.updateApprovalStatus(id, 'approved');
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "Restaurant owner has been approved", user: updatedUser });
  } catch (error) {
    console.error("Error approving restaurant owner:", error);
    return res.status(500).json({ message: "Error approving restaurant owner", error });
  }
};

exports.rejectRestaurantOwner = async (req, res) => {
  const { id } = req.params; // Restaurant owner's user ID from request parameters

  try {
    const updatedUser = await User.rejectRestaurantOwner(id);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "Restaurant owner has been rejected", user: updatedUser });
  } catch (error) {
    console.error("Error rejecting restaurant owner:", error);
    return res.status(500).json({ message: "Error rejecting restaurant owner", error });
  }
};

exports.banRestaurant_Owner = async (req, res) => {
  const { id } = req.params; 
  try {
    const updatedUser = await User.banRestaurantOwner(id);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "Restaurant owner has been banned", user: updatedUser });
  } catch (error) {
    console.error("Error banning restaurant owner:", error);
    return res.status(500).json({ message: "Error banning restaurant owner", error });
  }
};

exports.unbanRestaurant_Owner = async (req, res) => {
  const { id } = req.params;
  try {
    const unbannedOwner = await User.unbanRestaurantOwner(id);

    if (!unbannedOwner) {
      return res.status(404).json({ message: 'Restaurant owner not found or already unbanned' });
    }

    return res.status(200).json({ message: 'Restaurant owner has been unbanned', unbannedOwner });
  } catch (error) {
    console.error('Error unbanning restaurant owner:', error);
    return res.status(500).json({ message: 'Error unbanning restaurant owner', error });
  }
};

exports.getPendingRestaurantOwners = async (req, res) => {
  try {
    const query = 'SELECT * FROM users WHERE role = $1 AND approvalstatus = $2';
    const values = ['restaurant_owner', 'pending'];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No pending restaurant owners found" });
    }

    return res.status(200).json({ message: "Pending restaurant owners fetched successfully", users: result.rows });
  } catch (error) {
    console.error("Error fetching pending restaurant owners:", error);
    return res.status(500).json({ message: "Error fetching pending restaurant owners", error });
  }
};

exports.getApprovedRestaurantOwners = async (req, res) => {
  try {
    const query = `SELECT * FROM users WHERE role = 'restaurant_owner' AND approvalstatus = 'approved'`;
    const result = await pool.query(query);
    const approvedOwners = result.rows;
    return res.status(200).json(approvedOwners);
  } catch (error) {
    console.error("Error fetching approved restaurant owners:", error);
    return res.status(500).json({ message: "Error fetching approved restaurant owners", error });
  }
};

exports.getRejectedRestaurantOwners = async (req, res) => {
  try {
    const query = 'SELECT * FROM users WHERE role = $1 AND approvalstatus = $2';
    const values = ['restaurant_owner', 'rejected'];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No rejected restaurant owners found" });
    }

    return res.status(200).json({ message: "Rejected restaurant owners fetched successfully", users: result.rows });
  } catch (error) {
    console.error("Error fetching rejected restaurant owners:", error);
    return res.status(500).json({ message: "Error fetching rejected restaurant owners", error });
  }
};
