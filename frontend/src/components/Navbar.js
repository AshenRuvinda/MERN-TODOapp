import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Bell, User, LogOut, CheckSquare, Search, Settings, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      // Handle search functionality
      console.log('Searching for:', searchValue);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-primary-600 to-blue-600 text-white shadow-xl fixed top-0 left-64 right-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm border border-white/10 shadow-lg">
              <CheckSquare className="h-8 w-8 drop-shadow-sm" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                TaskFlow
              </h1>
              <p className="text-blue-100/80 text-xs font-medium tracking-wide">
                Productivity Suite
              </p>
            </div>
          </div>

          {/* Search Section */}
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative w-full group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-200 group-focus-within:text-white transition-colors duration-200" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search tasks, projects, or team members..."
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/70 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/30 focus:bg-white/15 transition-all duration-300 text-sm font-medium backdrop-blur-sm"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <button className="relative p-3 hover:bg-white/15 rounded-xl transition-all duration-200 group border border-transparent hover:border-white/20">
              <Bell className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-lg border border-red-400/50">
                3
              </span>
            </button>

            {/* User Profile */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 rounded-xl px-4 py-2.5 transition-all duration-200 border border-white/10 hover:border-white/20 group backdrop-blur-sm"
                >
                  <div className="bg-gradient-to-br from-white/30 to-white/10 p-2 rounded-full border border-white/20">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold text-white">
                      {user.displayName || 'User'}
                    </p>
                    <p className="text-xs text-blue-100/80 font-medium">
                      {user.email}
                    </p>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 backdrop-blur-xl">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">
                        {user.displayName || 'User'}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-200">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Logout Button */}
            <button
              onClick={handleLogout}
              className="sm:hidden flex items-center justify-center p-3 bg-red-500/20 hover:bg-red-500/30 rounded-xl transition-all duration-200 border border-red-400/30 hover:border-red-400/50"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Search */}
      <div className="md:hidden px-6 pb-3">
        <form onSubmit={handleSearch} className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-200 group-focus-within:text-white transition-colors duration-200" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-12 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/70 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/30 focus:bg-white/15 transition-all duration-300 text-sm backdrop-blur-sm"
          />
        </form>
      </div>

      {/* Click outside handler for user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;