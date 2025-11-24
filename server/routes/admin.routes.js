    const express = require('express');
    const router = express.Router();
    const auth = require('../middleware/auth.middleware');
    const admin = require('../middleware/admin.middleware');
    const User = require('../models/user.model');
    const Course = require('../models/course.model');

    // Protect all routes in this file with auth and admin middleware
    router.use(auth, admin);

    // --- User Management ---
    router.get('/users', async (req, res) => res.json(await User.find().select('-password')));
    router.delete('/users/:id', async (req, res) => {
        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: 'User deleted' });
    });

    // --- Course Management ---
    router.get('/courses', async (req, res) => res.json(await Course.find().populate('teacherId', 'name')));
    router.post('/courses', async (req, res) => {
        const { courseName, courseCode, teacherId } = req.body;
        const newCourse = new Course({ courseName, courseCode, teacherId });
        await newCourse.save();
        res.status(201).json(newCourse);
    });
    router.delete('/courses/:id', async (req, res) => {
        await Course.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Course deleted' });
    });

    // --- Helper to get teachers for dropdown ---
    router.get('/teachers', async (req, res) => res.json(await User.find({ role: 'teacher' }).select('name')));

    module.exports = router;
    
