import { useState, useContext } from 'react';
  import { useNavigate, Link } from 'react-router-dom';
  import { AuthContext } from '../context/AuthContext';
  import { toast } from 'react-toastify';
  import axios from 'axios';

  const RegisterPage = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '', displayName: '' });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.post('/api/auth/register', formData, { withCredentials: true });
        await login(formData.email, formData.password);
        toast.success('Registered successfully!');
        navigate('/dashboard');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Registration failed');
      }
    };

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="card w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-primary mb-6">Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-secondary mb-2" htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-secondary mb-2" htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input"
                placeholder="Enter your password"
              />
            </div>
            <div className="mb-6">
              <label className="block text-secondary mb-2" htmlFor="displayName">Display Name</label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className="input"
                placeholder="Enter your display name (optional)"
              />
            </div>
            <button type="submit" className="btn-primary w-full">Register</button>
          </form>
          <p className="mt-4 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    );
  };

  export default RegisterPage;