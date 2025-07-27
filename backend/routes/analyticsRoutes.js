const express = require('express');
     const router = express.Router();
     const { getTaskAnalytics } = require('../controllers/analyticsController');
     const authMiddleware = require('../middleware/authMiddleware');

     router.use(authMiddleware);

     router.get('/', getTaskAnalytics);

     module.exports = router;