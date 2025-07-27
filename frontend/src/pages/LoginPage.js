import { useState, useContext } from 'react';
  import { useNavigate, Link } from 'react-router-dom';
  import { AuthContext } from '../context/AuthContext';
  import { toast } from 'react-toastify';

  const LoginPage = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await login(formData.email, formData.password);
        toast.success('Logged in successfully!');
        navigate('/dashboard');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Login failed');
      }
    };

    const handleForgotPassword = async () => {
      if (!formData.email) return toast.error('Please enter your email');
      try {
        await axios.post('/api/auth/forgot-password', { email: formData.email }, { withCredentials: true });
        toast.success('Password reset email sent (check console if using mock)');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error sending reset email');
      }
    };

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="card w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-primary mb-6">Login</h2>
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
            <div className="mb-6">
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
            <button type="submit" className="btn-primary w-full">Login</button>
          </form>
          <button
            onClick={handleForgotPassword}
            className="mt-4 text-primary hover:underline"
          >
            Forgot Password?
          </button>
          <p className="mt-4 text-center">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    );
  };

  export default LoginPage;