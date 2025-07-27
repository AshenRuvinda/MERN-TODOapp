import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

  const StatsChart = ({ data }) => {
    const COLORS = ['#1D4ED8', '#10B981', '#F59E0B', '#EF4444'];

    return (
      <div className="card p-6">
        <h3 className="text-xl font-semibold text-secondary mb-4">Task Status Distribution</h3>
        <PieChart width={400} height={300}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    );
  };

  export default StatsChart;