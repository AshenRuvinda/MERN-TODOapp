import { useRoutes } from 'react-router-dom';
     import routes from './router';
     import Sidebar from './components/Sidebar';
     import Navbar from './components/Navbar';

     function App() {
       const content = useRoutes(routes);
       return (
         <div className="flex">
           <Sidebar />
           <div className="flex-1">
             <Navbar />
             <div className="p-4">{content}</div>
           </div>
         </div>
       );
     }

     export default App;