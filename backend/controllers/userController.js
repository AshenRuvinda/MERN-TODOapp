const User = require('../models/User');
const cloudinary = require('../utils/cloudinaryConfig');

exports.updateProfile = async (req, res, next) => {
  const { displayName } = req.body;
  const file = req.file;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (displayName) user.displayName = displayName;
    if (file) {
      const result = await cloudinary.uploader.upload(file.path);
      user.avatar = result.secure_url;
    }
    await user.save();
    res.json({ id: user._id, email: user.email, displayName: user.displayName, avatar: user.avatar });
  } catch (error) {
    next(error);
  }
};