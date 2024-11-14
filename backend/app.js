import mongoose from 'mongoose';
dotenv.config()

const url ='mongodb+srv://gokulsingh:12345@cluster0.bhqo5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Replace 'your-database-name' with the name of your database

mongoose.connect('mongodb+srv://gokulsingh:12345@cluster0.bhqo5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
  const punycode = require('punycode/');
  const punycode = require('punycode/');
