require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// --- 1. Connect to MongoDB ---
// The deprecated options have been removed
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch((err) => console.error('MongoDB connection error:', err));

// --- 2. Middlewares ---
app.use(cors());
app.use(express.json());

// --- 3. Route Definitions ---
app.get('/', (req, res) => {
  res.send('Welcome to the College Attendance System API');
});

app.use('/api/auth', require('./routes/auth.routes.js'));
app.use('/api/courses', require('./routes/course.routes.js'));
app.use('/api/attendance', require('./routes/attendance.routes.js'));

// --- 4. Start the Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));

