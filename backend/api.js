axios.post('http://localhost:8000/api/user/register', data);


const cors = require('cors');
app.use(cors());


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  });
  

  app.post('/api/user/login', async (req, res) => {
    try {
      console.log('Login request received:', req.body); // Log incoming request data
      // Your authentication logic here (e.g., checking username and password)
    } catch (err) {
      console.error('Error during login:', err);
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  });
  

  // Example route setup in Express
app.post('/api/user/login', loginController);


if (!process.env.JWT_KEY) {
    return res.status(500).send({ success: false, message: "JWT_KEY is not set" });
  }
  
  const token = jwt.sign({ id: user._id }, 'your_secret_key', { expiresIn: '1d' });




  const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
    try {
        const user = {}; // Replace with actual user authentication logic
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_KEY, // Ensure this is not undefined
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error occurred' });
    }
};
