const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Admin username is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    email: {
      type: String,
      required: [true, 'Admin email is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    name: {
      type: String,
      default: 'Mess&Nest Admin'
    },
    role: {
      type: String,
      default: 'Super Admin'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Admin', adminSchema);
