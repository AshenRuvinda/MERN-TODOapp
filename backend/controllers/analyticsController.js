const Task = require('../models/Task');
     const moment = require('moment');

     exports.getTaskAnalytics = async (req, res, next) => {
       try {
         const { startDate, endDate } = req.query;
         const userId = req.user.id;

         const start = startDate ? moment(startDate).startOf('day').toDate() : moment().subtract(30, 'days').startOf('day').toDate();
         const end = endDate ? moment(endDate).endOf('day').toDate() : moment().endOf('day').toDate();

         const tasks = await Task.find({
           user: userId,
           createdAt: { $gte: start, $lte: end },
         });

         const analytics = {
           totalTasks: tasks.length,
           completedTasks: tasks.filter(task => task.status === 'done').length,
           byPriority: {
             low: tasks.filter(task => task.priority === 'low').length,
             medium: tasks.filter(task => task.priority === 'medium').length,
             high: tasks.filter(task => task.priority === 'high').length,
           },
           byStatus: {
             todo: tasks.filter(task => task.status === 'todo').length,
             inProgress: tasks.filter(task => task.status === 'in-progress').length,
             done: tasks.filter(task => task.status === 'done').length,
           },
         };

         res.json(analytics);
       } catch (error) {
         next(error);
       }
     };