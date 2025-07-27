import { useState, useEffect } from 'react';
     import axios from 'axios';
     import { toast } from 'react-toastify';

     const useTasks = () => {
       const [tasks, setTasks] = useState([]);

       useEffect(() => {
         const fetchTasks = async () => {
           try {
             const response = await axios.get('/api/tasks', { withCredentials: true });
             setTasks(response.data);
           } catch (error) {
             toast.error('Failed to fetch tasks');
           }
         };
         fetchTasks();
       }, []);

       const updateTaskStatus = async (taskId, status) => {
         try {
           await axios.put(`/api/tasks/${taskId}`, { status }, { withCredentials: true });
           setTasks(tasks.map(task => task._id === taskId ? { ...task, status } : task));
           toast.success('Task status updated');
         } catch (error) {
           toast.error('Failed to update task status');
         }
       };

       return { tasks, setTasks, updateTaskStatus };
     };

     export default useTasks;