import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TaskCard from '../components/TaskCard';
import { Plus, TrendingUp, Clock, CheckCircle2, User, Calendar } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, inProgress: 0, completed: 0 });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/api/tasks', { withCredentials: true });
        const tasks = response.data;
        setTasks(tasks);
        updateStats(tasks);
      } catch (error) {
        toast.error('Failed to fetch tasks');
      }
    };
    fetchTasks();
  }, []);

  // Helper function to update stats
  const updateStats = (taskList) => {
    setStats({
      total: taskList.length,
      inProgress: taskList.filter(task => task.status === 'In Progress').length,
      completed: taskList.filter(task => task.status === 'Done').length,
    });
  };

  const handleUpdateTask = (taskId, newStatus) => {
    const updatedTasks = tasks.map(task => 
      task._id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    updateStats(updatedTasks);
  };

  // ADD THIS MISSING FUNCTION
  const handleRemoveTask = (taskId) => {
    console.log('Removing task from dashboard:', taskId);
    const updatedTasks = tasks.filter(task => task._id !== taskId);
    setTasks(updatedTasks);
    updateStats(updatedTasks);
    console.log(`Task ${taskId} removed. Tasks count: ${updatedTasks.length}`);
  };

  const handleDrop = async (taskId, newStatus) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, { status: newStatus }, { withCredentials: true });
      handleUpdateTask(taskId, newStatus);
      toast.success('Task status updated');
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Todo':
        return {
          bgColor: 'bg-blue-600',
          icon: Clock,
          count: tasks.filter(task => task.status === status).length
        };
      case 'In Progress':
        return {
          bgColor: 'bg-amber-600',
          icon: Clock,
          count: tasks.filter(task => task.status === status).length
        };
      case 'Done':
        return {
          bgColor: 'bg-emerald-600',
          icon: CheckCircle2,
          count: tasks.filter(task => task.status === status).length
        };
      default:
        return {
          bgColor: 'bg-gray-600',
          icon: Clock,
          count: 0
        };
    }
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-semibold text-gray-900">
                      Welcome back, {user?.displayName || user?.email}
                    </h1>
                    <div className="flex items-center space-x-2 text-gray-600 mt-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{formatDate()}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 ml-15">Manage your tasks and stay productive</p>
              </div>
              <div className="mt-6 lg:mt-0">
                <a 
                  href="/task" 
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Task</span>
                </a>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Total Tasks</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">In Progress</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.inProgress}</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Completed</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Task Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {['Todo', 'In Progress', 'Done'].map(status => {
              const config = getStatusConfig(status);
              const StatusIcon = config.icon;
              
              return (
                <div key={status} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className={`${config.bgColor} p-4`}>
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center space-x-2">
                        <StatusIcon className="h-5 w-5" />
                        <h3 className="text-lg font-medium">{status}</h3>
                      </div>
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                        {tasks.filter(task => task.status === status).length}
                      </span>
                    </div>
                  </div>
                  
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      const taskId = e.dataTransfer.getData('text/plain').split(':')[0];
                      handleDrop(taskId, status);
                    }}
                    className="p-4 space-y-3 min-h-[400px] bg-gray-50/50"
                  >
                    {tasks
                      .filter(task => task.status === status)
                      .map(task => (
                        <TaskCard 
                          key={task._id} 
                          task={task} 
                          onUpdate={handleUpdateTask}
                          onRemove={handleRemoveTask}  
                        />
                      ))}
                    
                    {tasks.filter(task => task.status === status).length === 0 && (
                      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                        <StatusIcon className="h-12 w-12 mb-3 opacity-30" />
                        <p className="text-sm font-medium">No {status.toLowerCase()} tasks</p>
                        <p className="text-xs">Tasks will appear here</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default Dashboard;