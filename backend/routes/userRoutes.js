const express = require('express');
const router = express.Router();
const { updateProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(authMiddleware);

router.put('/:id/profile', upload.single('avatar'), updateProfile);

module.exports = router;