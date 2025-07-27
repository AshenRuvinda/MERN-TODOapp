import { useState, useEffect } from 'react';
  import Calendar from 'react-calendar';
  import axios from 'axios';
  import { toast } from 'react-toastify';
  import 'react-calendar/dist/Calendar.css';

  const CalendarView = () => {
    const [date, setDate] = useState(new Date());
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
      const fetchTasks = async () => {
        try {
          const response = await axios.get('/api/tasks', { withCredentials: true });
          setTasks(response.data);
        } catch (error) {
          toast.error('Failed to fetch tasks');
        }
      };
      fetchTasks();
    }, []);

    const tileContent = ({ date }) => {
      const taskCount = tasks.filter(
        task => task.dueDate && new Date(task.dueDate).toDateString() === date.toDateString()
      ).length;
      return taskCount > 0 ? (
        <p className="text-danger font-semibold">{taskCount} tasks</p>
      ) : null;
    };

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="card">
          <h2 className="text-3xl font-bold mb-6 text-primary">Task Calendar</h2>
          <Calendar
            onChange={setDate}
            value={date}
            tileContent={tileContent}
            className="border-none shadow-lg rounded-lg"
          />
        </div>
      </div>
    );
  };

  export default CalendarView;