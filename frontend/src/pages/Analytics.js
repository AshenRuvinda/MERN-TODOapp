import { useState, useEffect } from 'react';
  import axios from 'axios';
  import { toast } from 'react-toastify';
  import StatsChart from '../components/StatsChart';

  const Analytics = () => {
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
      const fetchAnalytics = async () => {
        try {
          const response = await axios.get('/api/analytics', { withCredentials: true });
          setAnalytics(response.data);
        } catch (error) {
          toast.error('Failed to fetch analytics');
        }
      };
      fetchAnalytics();
    }, []);

    if (!analytics) return <div className="text-center p-6">Loading...</div>;

    const chartData = [
      { name: 'Todo', value: analytics.todoCount },
      { name: 'In Progress', value: analytics.inProgressCount },
      { name: 'Done', value: analytics.doneCount },
    ];

    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-primary">Task Analytics</h2>
        <StatsChart data={chartData} />
      </div>
    );
  };

  export default Analytics;