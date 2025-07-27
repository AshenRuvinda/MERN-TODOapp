import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskCard from './TaskCard';
import { toast } from 'react-toastify';

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks from API
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks', { withCredentials: true });
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
      setLoading(false);
    }
  };

  // Handle task status update
  const handleTaskUpdate = (taskId, newStatus) => {
    console.log('Updating task:', taskId, 'to status:', newStatus);
    
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task._id === taskId 
          ? { ...task, status: newStatus }
          : task
      )
    );
  };

  // Handle task removal
  const handleTaskRemove = (taskId) => {
    console.log('Removing task:', taskId);
    
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.filter(task => task._id !== taskId);
      console.log('Tasks after removal:', updatedTasks.length, 'remaining');
      return updatedTasks;
    });
  };

  // Handle task addition (for completeness)
  const handleTaskAdd = (newTask) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="task-board">
      <h1>Task Management</h1>
      
      {/* Task Statistics */}
      <div className="task-stats">
        <p>Total Tasks: {tasks.length}</p>
        <p>Todo: {tasks.filter(t => t.status === 'Todo').length}</p>
        <p>In Progress: {tasks.filter(t => t.status === 'In Progress').length}</p>
        <p>Done: {tasks.filter(t => t.status === 'Done').length}</p>
      </div>

      {/* Task Lists by Status */}
      <div className="task-columns">
        {['Todo', 'In Progress', 'Done'].map(status => (
          <div key={status} className="task-column">
            <h2>{status}</h2>
            <div className="task-list">
              {tasks
                .filter(task => task.status === status)
                .map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onUpdate={handleTaskUpdate}
                    onRemove={handleTaskRemove}
                  />
                ))
              }
              {tasks.filter(task => task.status === status).length === 0 && (
                <p className="no-tasks">No {status.toLowerCase()} tasks</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Debug Information (remove in production) */}
      <div className="debug-info" style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0' }}>
        <h3>Debug Info:</h3>
        <p>Total tasks in state: {tasks.length}</p>
        <details>
          <summary>Task IDs:</summary>
          <ul>
            {tasks.map(task => (
              <li key={task._id}>{task._id} - {task.title} - {task.status}</li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  );
};

export default TaskBoard;