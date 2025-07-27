import { useContext } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { AuthContext } from '../context/AuthContext';
  import { toast } from 'react-toastify';

  const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
      try {
        await logout();
        toast.success('Logged out successfully');
        navigate('/login');
      } catch (error) {
        toast.error('Logout failed');
      }
    };

    return (
      <nav className="bg-primary text-white p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Todo App</h1>
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-sm">{user.displayName || user.email}</span>
              <button
                onClick={handleLogout}
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    );
  };

  export default Navbar;