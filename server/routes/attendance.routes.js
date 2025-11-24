const express = require('express');
const auth = require('../middleware/auth.middleware');
const Attendance = require('../models/attendance.model');
const Enrollment = require('../models/enrollment.model');

const router = express.Router();

// --- POST /:courseId (The existing teacher route) ---
router.post('/:courseId', auth, async (req, res) => {
    // ... all the code for submitting attendance
});


// --- NEW - GET /me (The new student route) ---
router.get('/me', auth, async (req, res) => {
  try {
    const records = await Attendance.find({ studentId: req.user.id })
      .sort({ date: -1 })
      .populate('courseId', 'courseName courseCode');

    res.json(records);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;