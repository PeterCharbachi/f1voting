import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// ChartData will now contain race name and points for each user (dynamically)
interface ChartData {
  name: string; // Race name
  [key: string]: string | number; // Dynamic keys for user points, e.g., 'user_points', 'admin_points'
}

interface UserPointsChartProps {
  data: ChartData[];
  userKeys: { key: string; name: string; color: string }[]; // Array of objects for each user's line
}

const UserPointsChart: React.FC<UserPointsChartProps> = ({ data, userKeys }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#4a4a4a" />
        <XAxis dataKey="name" stroke="#9a9a9a" />
        <YAxis stroke="#9a9a9a" />
        <Tooltip
          contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '5px' }}
          labelStyle={{ color: '#fff' }}
          itemStyle={{ color: '#fff' }}
        />
        <Legend /> {/* Add Legend to show which line belongs to which user */}
        {userKeys.map((userKey) => (
          <Line
            key={userKey.key}
            type="monotone"
            dataKey={userKey.key}
            stroke={userKey.color}
            activeDot={{ r: 8 }}
            name={userKey.name} // Display user's name in the legend
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default UserPointsChart;