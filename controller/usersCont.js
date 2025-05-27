const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/userModel");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate that required fields are present
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields!!" });
    }

    // Check if the user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Directly save the plain password (without hashing)
    // const hashedPassword = await argon2.hash(password);
    const plainPassword = password;

    // Create the user
    const user = await User.create({
      name,
      email,
      password: plainPassword, // Store plain password (temporary)
      role,
      approvalstatus: role === "restaurant_owner" ? "pending" : "approved",
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        approvalstatus: user.approvalstatus,
      },
    });
  } catch (err) {
    console.error("Error in registration:", err); // Log detailed error
    return res.status(500).json({ error: err.message });
  }
};


exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found!!!" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Only check approval status for restaurant_owner
    if (user.role === 'restaurant_owner') {
      if (user.approvalstatus === 'pending') {
        return res.status(403).json({ message: "Your account is pending approval by admin" });
      } else if (user.approvalstatus === 'rejected') {
        return res.status(403).json({ message: "Your account has been rejected by admin" });
      } else if (user.approvalstatus === 'banned') {
        return res.status(403).json({ message: "Your account has been banned by admin" });
      }
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, approvalstatus: user.approvalstatus },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        approvalstatus: user.approvalstatus,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Error logging in", error });
  }
};



exports.logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};
