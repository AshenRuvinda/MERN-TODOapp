const mongoose = require('mongoose');

     const taskSchema = new mongoose.Schema({
       title: { type: String, required: true },
       description: { type: String },
       dueDate: { type: Date },
       priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
       status: { type: String, enum: ['Todo', 'In Progress', 'Done'], default: 'Todo' },
       user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
       attachments: { type: String },
       subtasks: [{ title: String, completed: { type: Boolean, default: false } }],
     });

     module.exports = mongoose.model('Task', taskSchema);