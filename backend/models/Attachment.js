const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  url: { type: String, required: true },
  publicId: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Attachment', attachmentSchema);