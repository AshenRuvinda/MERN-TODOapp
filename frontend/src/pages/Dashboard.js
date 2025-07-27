import { useState, useEffect, useContext } from 'react';
  import axios from 'axios';
  import { AuthContext } from '../context/AuthContext';
  import { toast } from 'react-toastify';
  import { DndProvider } from 'react-dnd';
  import { HTML5Backend } from 'react-dnd-html5-backend';
  import TaskCard from '../components/TaskCard';

  const Dashboard = () => {
    const { user } = useContext(AuthContext);
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

    const handleDrop = async (taskId, newStatus) => {
      try {
        await axios.put(`/api/tasks/${taskId}`, { status: newStatus }, { withCredentials: true });
        setTasks(tasks.map(task => task._id === taskId ? { ...task, status: newStatus } : task));
        toast.success('Task status updated');
      } catch (error) {
        toast.error('Failed to update task status');
      }
    };

    return (
      <DndProvider backend={HTML5Backend}>
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-6 text-primary">Welcome, {user?.displayName || user?.email}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Todo', 'In Progress', 'Done'].map(status => (
              <div key={status} className="card">
                <h3 className="text-xl font-semibold text-secondary mb-4">{status}</h3>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    const taskId = e.dataTransfer.getData('text/plain').split(':')[0];
                    handleDrop(taskId, status);
                  }}
                  className="min-h-[200px] p-4 bg-background rounded-lg"
                >
                  {tasks
                    .filter(task => task.status === status)
                    .map(task => (
                      <TaskCard key={task._id} task={task} />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DndProvider>
    );
  };

  export default Dashboard;