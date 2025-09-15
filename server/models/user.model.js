    const mongoose = require('mongoose');

    const userSchema = new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: {
        type: String,
        required: true,
        enum: ['student', 'teacher', 'admin'] // Role must be one of these values
      }
    }, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

    const User = mongoose.model('User', userSchema);

    module.exports = User;
    
