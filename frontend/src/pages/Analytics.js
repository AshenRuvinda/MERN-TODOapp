import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import StatsChart from '../components/StatsChart';
import { BarChart3, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/analytics', { withCredentials: true });
        setAnalytics(response.data);
      } catch (error) {
        toast.error('Failed to fetch analytics');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-slate-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No Data Available</h3>
          <p className="text-slate-600">Unable to load analytics data at this time.</p>
        </div>
      </div>
    );
  }

  const chartData = [
    { name: 'Todo', value: analytics.todoCount },
    { name: 'In Progress', value: analytics.inProgressCount },
    { name: 'Done', value: analytics.doneCount },
  ];

  const totalTasks = analytics.todoCount + analytics.inProgressCount + analytics.doneCount;
  const completionRate = totalTasks > 0 ? Math.round((analytics.doneCount / totalTasks) * 100) : 0;
  const progressRate = totalTasks > 0 ? Math.round((analytics.inProgressCount / totalTasks) * 100) : 0;

  const statCards = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: BarChart3,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'To Do',
      value: analytics.todoCount,
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'In Progress',
      value: analytics.inProgressCount,
      icon: TrendingUp,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Completed',
      value: analytics.doneCount,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Task Analytics Dashboard
          </h1>
          <p className="text-slate-600 text-lg">Monitor your productivity and task completion trends</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${stat.color}`}></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.textColor}`} />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                      <p className="text-sm text-slate-500">{stat.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Indicators */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
              Completion Rate
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Progress</span>
                <span className="text-2xl font-bold text-green-600">{completionRate}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
              <p className="text-sm text-slate-500">
                {analytics.doneCount} out of {totalTasks} tasks completed
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <TrendingUp className="h-6 w-6 text-blue-500 mr-2" />
              Work in Progress
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Active Tasks</span>
                <span className="text-2xl font-bold text-blue-600">{progressRate}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressRate}%` }}
                ></div>
              </div>
              <p className="text-sm text-slate-500">
                {analytics.inProgressCount} tasks currently in progress
              </p>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
            <h3 className="text-2xl font-bold text-white flex items-center">
              <BarChart3 className="h-7 w-7 mr-3" />
              Task Distribution
            </h3>
            <p className="text-blue-100 mt-1">Visual breakdown of your task status</p>
          </div>
          <div className="p-6">
            <StatsChart data={chartData} />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <h4 className="text-lg font-semibold mb-2">Productivity Score</h4>
            <p className="text-3xl font-bold mb-2">{completionRate}%</p>
            <p className="text-blue-100 text-sm">Based on completion rate</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
            <h4 className="text-lg font-semibold mb-2">Active Workload</h4>
            <p className="text-3xl font-bold mb-2">{analytics.inProgressCount + analytics.todoCount}</p>
            <p className="text-purple-100 text-sm">Tasks requiring attention</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
            <h4 className="text-lg font-semibold mb-2">Achievements</h4>
            <p className="text-3xl font-bold mb-2">{analytics.doneCount}</p>
            <p className="text-green-100 text-sm">Tasks completed successfully</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;