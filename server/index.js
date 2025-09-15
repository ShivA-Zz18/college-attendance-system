    // 1. IMPORT LIBRARIES
    const express = require('express');
    const mongoose = require('mongoose');
    const cors = require('cors');
    require('dotenv').config(); // This loads the variables from .env

    // 2. INITIALIZE APP AND PORT
    const app = express();
    const PORT = process.env.PORT || 5000;

    // 3. APPLY MIDDLEWARE
    // These are functions that run for every request that comes into the server.
    app.use(cors()); // Allows cross-origin requests (from our frontend)
    app.use(express.json()); // Allows the server to understand incoming JSON data

    // 4. CONNECT TO MONGODB DATABASE
    const mongoURI = process.env.MONGO_URI;

    mongoose.connect(mongoURI)
      .then(() => console.log('MongoDB connected successfully.'))
      .catch(err => console.error('MongoDB connection error:', err));

    // 5. DEFINE A SIMPLE TEST ROUTE
    // This is to check if our server is working
    app.get('/', (req, res) => {
      res.send('Welcome to the College Attendance System API');
    });

    // 6. START THE SERVER
    // This makes our server "listen" for any incoming requests on the specified port.
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
    
