    const mongoose = require('mongoose');

    const courseSchema = new mongoose.Schema({
      courseName: { type: String, required: true },
      courseCode: { type: String, required: true, unique: true },
      teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This creates a reference to a document in the 'User' collection
        required: true
      }
    }, { timestamps: true });

    const Course = mongoose.model('Course', courseSchema);

    module.exports = Course;
    
