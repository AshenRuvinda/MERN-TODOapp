import { Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import TaskForm from './pages/TaskForm';
import TaskDetail from './pages/TaskDetail';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import CalendarView from './components/CalendarView';
import PomodoroTimer from './components/PomodoroTimer';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

const routes = [
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/dashboard', element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
  { path: '/task', element: <ProtectedRoute><TaskForm /></ProtectedRoute> },
  { path: '/task/:id', element: <ProtectedRoute><TaskDetail /></ProtectedRoute> },
  { path: '/analytics', element: <ProtectedRoute><Analytics /></ProtectedRoute> },
  { path: '/calendar', element: <ProtectedRoute><CalendarView /></ProtectedRoute> },
  { path: '/pomodoro', element: <ProtectedRoute><PomodoroTimer /></ProtectedRoute> },
  { path: '/profile', element: <ProtectedRoute><Profile /></ProtectedRoute> },
  { path: '/', element: <Navigate to="/login" /> },
  { path: '*', element: <NotFound /> },
];

export default routes;