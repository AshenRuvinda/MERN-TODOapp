const passport = require('passport');
     const LocalStrategy = require('passport-local').Strategy;
     const User = require('../models/User');

     passport.serializeUser((user, done) => {
       done(null, user.id);
     });

     passport.deserializeUser(async (id, done) => {
       try {
         const user = await User.findById(id);
         done(null, user);
       } catch (error) {
         done(error, null);
       }
     });

     passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
       try {
         const user = await User.findOne({ email });
         if (!user || !(await user.comparePassword(password))) {
           return done(null, false, { message: 'Invalid credentials' });
         }
         return done(null, user);
       } catch (error) {
         return done(error);
       }
     }));

     module.exports = passport;