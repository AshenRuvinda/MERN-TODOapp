const express = require('express');
     const mongoose = require('mongoose');
     const cors = require('cors');
     const helmet = require('helmet');
     const dotenv = require('dotenv');
     const session = require('express-session');
     const authRoutes = require('./routes/authRoutes');
     const taskRoutes = require('./routes/taskRoutes');
     const analyticsRoutes = require('./routes/analyticsRoutes');
     const passport = require('passport');
     require('./config/passport');

     dotenv.config();

     const app = express();

     app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
     app.use(helmet());
     app.use(express.json());
     app.use(session({
       secret: 'your_session_secret',
       resave: false,
       saveUninitialized: false,
       cookie: { secure: process.env.NODE_ENV === 'production', sameSite: 'strict' },
     }));
     app.use(passport.initialize());
     app.use(passport.session());

     app.use('/api/auth', authRoutes);
     app.use('/api/tasks', taskRoutes);
     app.use('/api/analytics', analyticsRoutes);

     app.use((err, req, res, next) => {
       console.error(err.stack);
       res.status(500).json({ message: 'Something went wrong!' });
     });

     mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
       .then(() => console.log('MongoDB connected'))
       .catch(err => console.error('MongoDB connection error:', err));

     const PORT = process.env.PORT || 5000;
     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));