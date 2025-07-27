import { createContext, useState, useEffect } from 'react';
       import axios from 'axios';
       import { useNavigate } from 'react-router-dom';

       export const AuthContext = createContext();

       export const AuthProvider = ({ children }) => {
         const [user, setUser] = useState(null);
         const navigate = useNavigate();

         useEffect(() => {
           axios.get('/api/auth/me', { withCredentials: true })
             .then(response => {
               setUser(response.data);
             })
             .catch(() => {
               setUser(null);
             });
         }, []);

         const login = async (email, password) => {
           const response = await axios.post('/api/auth/login', { email, password }, { withCredentials: true });
           setUser(response.data.user);
         };

         const logout = async () => {
           await axios.post('/api/auth/logout', {}, { withCredentials: true });
           setUser(null);
           navigate('/login');
         };

         return (
           <AuthContext.Provider value={{ user, login, logout }}>
             {children}
           </AuthContext.Provider>
         );
       };

       export default AuthProvider;