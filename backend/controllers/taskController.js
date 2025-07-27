const Task = require('../models/Task');
const mongoose = require('mongoose');

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, priority, status, subtasks } = req.body;
    
    // Validation
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = new Task({
      title: title.trim(),
      description: description?.trim() || '',
      dueDate,
      priority: priority || 'Medium',
      status: status || 'Todo',
      user: req.user._id,
      attachments: req.file ? req.file.path : null,
      subtasks: subtasks ? JSON.parse(subtasks) : [],
    });
    
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: Object.values(error.errors).map(e => e.message) 
      });
    }
    next(error);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const { status, priority, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    // Build filter object
    const filter = { user: req.user._id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    
    // Build sort object
    const sort = {};
    sort[sortBy] = order === 'asc' ? 1 : -1;
    
    const tasks = await Task.find(filter).sort(sort);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

exports.getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }
    
    const task = await Task.findOne({ _id: id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { subtasks, ...updates } = req.body;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }
    
    // Remove empty fields and trim strings
    const cleanUpdates = {};
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined && updates[key] !== null) {
        if (typeof updates[key] === 'string') {
          cleanUpdates[key] = updates[key].trim();
        } else {
          cleanUpdates[key] = updates[key];
        }
      }
    });
    
    // Handle subtasks if provided
    if (subtasks) {
      try {
        cleanUpdates.subtasks = typeof subtasks === 'string' ? JSON.parse(subtasks) : subtasks;
      } catch (parseError) {
        return res.status(400).json({ message: 'Invalid subtasks format' });
      }
    }
    
    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id },
      cleanUpdates,
      { new: true, runValidators: true }
    );
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Return updated task without success message
    res.json(task);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: Object.values(error.errors).map(e => e.message) 
      });
    }
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    console.log('Delete request for task ID:', id);
    console.log('User ID:', req.user?._id);
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid ObjectId:', id);
      return res.status(400).json({ message: 'Invalid task ID' });
    }
    
    const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });
    
    if (!task) {
      console.log('Task not found for deletion:', id);
      return res.status(404).json({ message: 'Task not found' });
    }
    
    console.log('Task deleted successfully:', task.title);
    
    // Return success response with deleted task info
    res.status(200).json({ 
      success: true,
      message: 'Task deleted successfully',
      deletedTask: {
        id: task._id,
        title: task.title
      }
    });
  } catch (error) {
    console.error('Delete task error:', error);
    next(error);
  }
};

// Additional utility functions
exports.updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }
    
    // Validate status
    const validStatuses = ['Todo', 'In Progress', 'Done'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status', 
        validStatuses 
      });
    }
    
    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { status },
      { new: true, runValidators: true }
    );
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    next(error);
  }
};

exports.getTaskStats = async (req, res, next) => {
  try {
    const stats = await Task.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const result = {
      total: 0,
      Todo: 0,
      'In Progress': 0,
      Done: 0
    };
    
    stats.forEach(stat => {
      result[stat._id] = stat.count;
      result.total += stat.count;
    });
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};