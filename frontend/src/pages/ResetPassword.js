import { useState } from 'react';
     import { useParams, useNavigate } from 'react-router-dom';
     import axios from 'axios';
     import { toast } from 'react-toastify';

     const ResetPassword = () => {
       const { token } = useParams();
       const navigate = useNavigate();
       const [formData, setFormData] = useState({ password: '' });

       const handleSubmit = async (e) => {
         e.preventDefault();
         try {
           await axios.post('/api/auth/reset-password', { token, password: formData.password }, { withCredentials: true });
           toast.success('Password reset successful! Please log in.');
           navigate('/login');
         } catch (error) {
           toast.error(error.response?.data?.message || 'Error resetting password');
         }
       };

       const handleChange = (e) => {
         setFormData({ ...formData, [e.target.name]: e.target.value });
       };

       return (
         <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
           <div className="p-6 bg-white dark:bg-gray-800 rounded shadow-md w-full max-w-md">
             <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
             <form onSubmit={handleSubmit}>
               <input
                 type="password"
                 name="password"
                 value={formData.password}
                 onChange={handleChange}
                 placeholder="New Password"
                 className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
               />
               <button
                 type="submit"
                 className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
               >
                 Reset Password
               </button>
             </form>
           </div>
         </div>
       );
     };

     export default ResetPassword;