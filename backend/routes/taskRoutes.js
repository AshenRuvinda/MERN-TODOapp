const express = require('express');
     const router = express.Router();
     const { createTask, getTasks, getTaskById, updateTask, deleteTask } = require('../controllers/taskController');
     const authMiddleware = require('../middleware/authMiddleware');
     const upload = require('../middleware/uploadMiddleware');

     router.use(authMiddleware);

     router.post('/', upload.single('attachments'), createTask);
     router.get('/', getTasks);
     router.get('/:id', getTaskById);
     router.put('/:id', updateTask);
     router.delete('/:id', deleteTask);

     module.exports = router;