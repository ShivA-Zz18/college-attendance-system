const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }, // Fixed typo here
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Fixed typo here
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late'],
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema)

