const bcrypt = require('bcryptjs');
     const crypto = require('crypto');
     const User = require('../models/User');
     const { sendEmail } = require('../utils/sendEmail');

     exports.register = async (req, res, next) => {
       const { email, password, displayName } = req.body;
       try {
         let user = await User.findOne({ email });
         if (user) return res.status(400).json({ message: 'User already exists' });

         user = new User({ email, password, displayName });
         await user.save();

         req.login(user, (err) => {
           if (err) return next(err);
           res.json({ message: 'Registered successfully', user: { id: user._id, email, displayName } });
         });
       } catch (error) {
         next(error);
       }
     };

     exports.login = async (req, res, next) => {
       try {
         res.json({ message: 'Logged in successfully', user: { id: req.user._id, email: req.user.email, displayName: req.user.displayName } });
       } catch (error) {
         next(error);
       }
     };

     exports.forgotPassword = async (req, res, next) => {
       const { email } = req.body;
       try {
         const user = await User.findOne({ email });
         if (!user) return res.status(404).json({ message: 'User not found' });

         const resetToken = crypto.randomBytes(32).toString('hex');
         user.resetPasswordToken = resetToken;
         user.resetPasswordExpires = Date.now() + 3600000;
         await user.save();

         const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
         await sendEmail(email, 'Password Reset', `Reset your password: ${resetUrl}`);
         res.json({ message: 'Password reset email sent' });
       } catch (error) {
         next(error);
       }
     };

     exports.resetPassword = async (req, res, next) => {
       const { token, password } = req.body;
       try {
         const user = await User.findOne({
           resetPasswordToken: token,
           resetPasswordExpires: { $gt: Date.now() },
         });
         if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

         user.password = password;
         user.resetPasswordToken = undefined;
         user.resetPasswordExpires = undefined;
         await user.save();

         res.json({ message: 'Password reset successful' });
       } catch (error) {
         next(error);
       }
     };