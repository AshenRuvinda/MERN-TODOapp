const express = require('express');
     const router = express.Router();
     const { register, login, forgotPassword, resetPassword } = require('../controllers/authController');
     const passport = require('passport');
     const { body } = require('express-validator');

     router.post(
       '/register',
       [
         body('email').isEmail().withMessage('Invalid email'),
         body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
         body('displayName').optional().trim(),
       ],
       register
     );

     router.post(
       '/login',
       [
         body('email').isEmail().withMessage('Invalid email'),
         body('password').notEmpty().withMessage('Password is required'),
       ],
       passport.authenticate('local', { session: true }),
       login
     );

     router.post(
       '/forgot-password',
       [body('email').isEmail().withMessage('Invalid email')],
       forgotPassword
     );

     router.post(
       '/reset-password',
       [
         body('token').notEmpty().withMessage('Token is required'),
         body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
       ],
       resetPassword
     );

     router.get('/me', (req, res) => {
       if (!req.isAuthenticated()) return res.status(401).json({ message: 'Unauthorized' });
       res.json({ id: req.user._id, email: req.user.email, displayName: req.user.displayName });
     });

     router.post('/logout', (req, res) => {
       req.logout((err) => {
         if (err) return res.status(500).json({ message: 'Logout failed' });
         res.json({ message: 'Logged out successfully' });
       });
     });

     module.exports = router;