const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userSchema = require('../models/userSchema');

const loginController = async (req, res) => {
  try {
    // Validate email and password presence in the request
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ message: "Email and password are required", success: false });
    }

    // Find user by email
    const user = await userSchema.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({ message: "User not found", success: false });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Invalid email or password", success: false });
    }

    // Check if the secret key is available
    if (!process.env.JWT_KEY) {
      console.error('JWT_KEY is not defined in environment variables.');
      return res.status(500).send({ message: "Internal server error", success: false });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: "1d" });
    user.password = undefined; // Remove password from the response

    // Send the response with the token and user data
    return res.status(200).send({ message: "Login successful", success: true, token, userData: user });
  } catch (error) {
    console.error('Login error:', error); // Log the specific error for debugging
    return res.status(500).send({ success: false, message: "An unexpected error occurred. Please try again later." });
  }
};

module.exports = loginController;
