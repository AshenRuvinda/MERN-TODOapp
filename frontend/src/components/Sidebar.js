import { NavLink } from 'react-router-dom';
  import { useState, useEffect } from 'react';
  import axios from 'axios';
  import { CheckSquare, LayoutDashboard, Plus, BarChart3, Calendar, Timer, User, TrendingUp, Clock } from 'lucide-react';

  const Sidebar = () => {
    const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });

    useEffect(() => {
      const fetchStats = async () => {
        try {
          const response = await axios.get('/api/analytics', { withCredentials: true });
          setStats({
            total: response.data.todoCount + response.data.inProgressCount + response.data.doneCount,
            completed: response.data.doneCount,
            pending: response.data.todoCount + response.data.inProgressCount,
          });
        } catch (error) {
          console.error('Failed to fetch stats');
        }
      };
      fetchStats();
    }, []);

    return (
      <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white h-screen fixed left-0 top-0 shadow-2xl z-40">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-600 p-2 rounded-lg">
              <CheckSquare className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">TaskFlow</h2>
              <p className="text-gray-400 text-xs">Stay Organized</p>
            </div>
          </div>
        </div>
        <nav className="mt-6 px-4">
          <h3 className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-4 px-2">Navigation</h3>
          {[
            { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { path: '/task', label: 'Create Task', icon: Plus },
            { path: '/analytics', label: 'Analytics', icon: BarChart3 },
            { path: '/calendar', label: 'Calendar', icon: Calendar },
            { path: '/pomodoro', label: 'Timer', icon: Timer },
            { path: '/profile', label: 'Profile', icon: User },
          ].map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="h-5 w-5 mr-3" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-8 px-4">
          <h3 className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-4 px-2">Quick Stats</h3>
          <div className="space-y-3">
            <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckSquare className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-gray-300">Total Tasks</span>
                </div>
                <span className="font-bold text-blue-400">{stats.total}</span>
              </div>
            </div>
            <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-gray-300">Completed</span>
                </div>
                <span className="font-bold text-green-400">{stats.completed}</span>
              </div>
            </div>
            <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">Pending</span>
                </div>
                <span className="font-bold text-yellow-400">{stats.pending}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default Sidebar;