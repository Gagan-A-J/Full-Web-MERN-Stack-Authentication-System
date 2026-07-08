const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  otp: { type: String },
  otpExpires: { type: Date },
}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);
/*
const googleOAth = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  avatar: { type: String, default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" },
}, { timestamps: true });
module.exports = mongoose.model('GoogleOAuth', googleOAth);
*/