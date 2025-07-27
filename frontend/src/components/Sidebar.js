import { NavLink } from 'react-router-dom';

  const Sidebar = () => {
    return (
      <div className="w-64 bg-gray-900 text-white h-screen p-6 fixed">
        <h2 className="text-2xl font-bold mb-6 text-primary">Todo App</h2>
        <nav>
          {[
            { path: '/dashboard', label: 'Dashboard' },
            { path: '/task', label: 'Create Task' },
            { path: '/analytics', label: 'Analytics' },
            { path: '/calendar', label: 'Calendar' },
            { path: '/pomodoro', label: 'Pomodoro Timer' },
            { path: '/profile', label: 'Profile' },
          ].map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `block p-3 mb-2 rounded-lg transition ${
                  isActive ? 'bg-primary text-white' : 'hover:bg-gray-700'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    );
  };

  export default Sidebar;