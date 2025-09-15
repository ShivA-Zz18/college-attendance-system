// 1. IMPORT LIBRARIES
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes'); // <-- MAKE SURE THIS LINE IS HERE
require('dotenv').config();

// 2. INITIALIZE APP AND PORT
const app = express();
const PORT = process.env.PORT || 5000;

// 3. APPLY MIDDLEWARE
app.use(cors());
app.use(express.json());

// 4. DEFINE API ROUTES
app.use('/api/auth', authRoutes); // <-- AND MAKE SURE THIS LINE IS HERE

// 5. CONNECT TO MONGODB DATABASE
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// 6. DEFINE A SIMPLE TEST ROUTE
app.get('/', (req, res) => {
  res.send('Welcome to the College Attendance System API');
});

// 7. START THE SERVER
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

