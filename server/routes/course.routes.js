    const express = require('express');
    const router = express.Router();
    const auth = require('../middleware/auth.middleware');
    const Course = require('../models/course.model');
    const Enrollment = require('../models/enrollment.model');

    // @route   GET /api/courses/teacher
    // @desc    Get all courses for the logged-in teacher
    // @access  Private
    router.get('/teacher', auth, async (req, res) => {
      // ... Logic to find courses where teacherId matches req.user.id
    });

    // @route   GET /api/courses/:courseId/students
    // @desc    Get all students enrolled in a specific course
    // @access  Private
    router.get('/:courseId/students', auth, async (req, res) => {
      // ... Logic to find enrollments for the courseId and populate student data
    });

    module.exports = router;
    
