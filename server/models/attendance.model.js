    const mongoose = require('mongoose');

    const attendanceSchema = new mongoose.Schema({
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      courseId: { type: mongoose.gSchema.Types.ObjectId, ref: 'Course', required: true },
      date: { type: Date, required: true },
      status: {
        type: String,
        required: true,
        enum: ['Present', 'Absent', 'Late']
      }
    }, { timestamps: true });

    const Attendance = mongoose.model('Attendance', attendanceSchema);

    module.exports = Attendance;
    
