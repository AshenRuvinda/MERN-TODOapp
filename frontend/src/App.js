import { useRoutes, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import routes from './router';

function App() {
  const content = useRoutes(routes);
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="flex min-h-screen">
      {!isAuthPage && <Sidebar />}
      <div className={`flex-1 ${!isAuthPage ? 'ml-64 pt-20' : ''}`}>
        {!isAuthPage && <Navbar />}
        <div className="p-6">{content}</div>
      </div>
    </div>
  );
}

export default App;