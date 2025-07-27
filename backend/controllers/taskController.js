const Task = require('../models/Task');

     exports.createTask = async (req, res, next) => {
       try {
         const { title, description, dueDate, priority, status, subtasks } = req.body;
         const task = new Task({
           title,
           description,
           dueDate,
           priority,
           status,
           user: req.user._id,
           attachments: req.file ? req.file.path : null,
           subtasks: subtasks ? JSON.parse(subtasks) : [],
         });
         await task.save();
         res.status(201).json(task);
       } catch (error) {
         next(error);
       }
     };

     exports.getTasks = async (req, res, next) => {
       try {
         const tasks = await Task.find({ user: req.user._id });
         res.json(tasks);
       } catch (error) {
         next(error);
       }
     };

     exports.getTaskById = async (req, res, next) => {
       try {
         const { id } = req.params;
         const task = await Task.findOne({ _id: id, user: req.user._id });
         if (!task) return res.status(404).json({ message: 'Task not found' });
         res.json(task);
       } catch (error) {
         next(error);
       }
     };

     exports.updateTask = async (req, res, next) => {
       try {
         const { id } = req.params;
         const { subtasks, ...updates } = req.body;
         const task = await Task.findOneAndUpdate(
           { _id: id, user: req.user._id },
           { ...updates, subtasks: subtasks ? JSON.parse(subtasks) : undefined },
           { new: true }
         );
         if (!task) return res.status(404).json({ message: 'Task not found' });
         res.json(task);
       } catch (error) {
         next(error);
       }
     };

     exports.deleteTask = async (req, res, next) => {
       try {
         const { id } = req.params;
         const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });
         if (!task) return res.status(404).json({ message: 'Task not found' });
         res.json({ message: 'Task deleted' });
       } catch (error) {
         next(error);
       }
     };