const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Make sure you have the correct model path

const loginController = async (req, res) => {
   const { email, password } = req.body;

   try {
      // Example: Check if the user exists (add your authentication logic here)
      const user = await User.findOne({ email });
      
      if (!user) {
         return res.status(401).json({ success: false, message: "User not found" });
      }

      // If passwords match (you should hash passwords in a real app!)
      if (user.password !== password) {
         return res.status(401).json({ success: false, message: "Invalid password" });
      }

      // Generate the JWT token using the secret from environment variables
      const token = jwt.sign(
         { userId: user._id, email: user.email },
         process.env.JWT_SECRET,  // Access the secret from environment
         { expiresIn: '1h' }      // Optional expiry time for the token
      );

      // Return the token and user data
      return res.json({
         success: true,
         message: 'Login successful',
         token,
         userData: user,
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
   }
};

module.exports = { loginController };


const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: "1d" });
