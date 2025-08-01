import React from 'react';
  import ReactDOM from 'react-dom/client';
  import { BrowserRouter } from 'react-router-dom';
  import { ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import './styles/main.css';
  import App from './App';
  import { AuthProvider } from './context/AuthContext';

  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found. Ensure index.html contains <div id="root"></div>');
  } else {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <AuthProvider>
            <App />
            <ToastContainer />
          </AuthProvider>
        </BrowserRouter>
      </React.StrictMode>
    );
  }