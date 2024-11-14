const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const DBConnection = require('./config/connect')
const path = require("path");

const app = express()
dotenv.config()

//////connection of DB/////////
DBConnection()

const PORT = process.env.PORT 


//////middleware/////////
app.use(express.json())
app.use(cors())
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


///ROUTES///
app.use('/api/admin', require('./routers/adminRoutes'))
app.use('/api/user', require('./routers/userRoutes'))



app.listen(PORT, () => console.log(`running on ${PORT}`))

const jwt = require('jsonwebtoken');

// Example: Signing a token
const token = jwt.sign({ userId: '12345' }, 'yourSecretKey', { expiresIn: '1h' });

// Example: Verifying a token
jwt.verify(token, 'yourSecretKey', (err, decoded) => {
   if (err) {
      console.log('Token is invalid:', err.message);
   } else {
      console.log('Decoded token data:', decoded);
   }
});
