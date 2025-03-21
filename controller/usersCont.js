const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/userModel");

// Register a new user
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Hash password (ensure password handling is secure)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Check if the user is a restaurant
    if (role === "restaurant") {
      // If the role is 'restaurant', set the status to 'pending' (needs approval)
      await Restaurant.create({
        owner_id: newUser.id, // Assuming this references the user
        name: "Restaurant Name", // You may want to pass this in the request
        location: "Location here",
      });

      return res.status(201).json({
        message:
          "Restaurant registered successfully. Waiting for admin approval.",
        user: newUser,
      });
    } else {
      // For all other roles, no approval process is needed
      return res.status(201).json({
        message: "User registered successfully.",
        user: newUser,
      });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: "Server error" });
  }
};

// Login an existing user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // If the role is 'restaurant', check approval status
    if (user.role === "restaurant") {
      const restaurant = await Restaurant.findOne({
        where: { owner_id: user.id },
      });
      if (restaurant.status !== "approved") {
        return res
          .status(403)
          .json({
            message:
              "Restaurant approval pending. Please wait for admin approval.",
          });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: "Server error" });
  }
};
