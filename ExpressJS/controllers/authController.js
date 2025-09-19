const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendResetEmail, sendSMS } = require('../Utils/sendemail');

exports.signup = async (req, res) => {
  const { username, email, password, phone } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      let conflict;
      if (existingUser.email === email) conflict = 'Email';
      else if (existingUser.phone === phone) conflict = 'Phone';
      else conflict = 'Username';
      return res.status(400).json({ message: `${conflict} already exists` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword, phone });

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
  const { email, password, phone } = req.body;
  try {
    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min
    await user.save();

    const message = `Your OTP is ${otp}. It expires in 5 minutes.`;
    await sendSMS(user.phone, message);
    return res.status(200).json({ message: 'OTP sent to your phone', phone: user.phone, });

    //const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    //res.json({ token, user: { id: user._id, username: user.username, email: user.email, phone: user.phone } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verify = async (req, res) => {
  const { phone, otp } = req.body;
  try {
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (otp !== user.otp || Date.now() > user.otpExpires)
      return res.status(400).json({ message: 'Invalid or expired OTP' });

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    // ✅ Set token as HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,   // cannot be accessed via JS
      secure: process.env.NODE_ENV === 'production', // only HTTPS in prod
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    return res.json({ user: { id: user._id, username: user.username, email: user.email, phone: user.phone }, message: 'OTP verified, login successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Logout failed' });
  }
};

// === Request Reset Link ===
exports.reqresetpassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });

    res.cookie('resetToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 10 * 60 * 1000, // 10 minutes
    });
    const link = `http://localhost:5173/reset-password/${token}`;

    await sendResetEmail(user.email, `Hi ${user.username}`, `<h1>Password Reset Link</h1><br><p>You requested to reset your password. Please click the button below to reset it:</p><br><a href="${link}">Reset Password</a>`); // Replace with actual email service in prod

    res.json({ message: 'Password reset link sent to email' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending reset email' });
    console.error(err);
  }
};

// === Reset Password ===
exports.resetpassword = async (req, res) => {
  const { password } = req.body;

  try {
    const token = req.cookies?.resetToken || req.params.resetToken;
    if (!token) return res.status(400).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(decoded._id, { password: hashedPassword });
    res.clearCookie('resetToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};