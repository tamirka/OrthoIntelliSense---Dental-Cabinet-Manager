
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const revenueData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 6000 },
  { name: 'Jun', revenue: 5500 },
];

const patientData = [
  { name: 'Jan', new: 15, total: 120 },
  { name: 'Feb', new: 20, total: 130 },
  { name: 'Mar', new: 18, total: 145 },
  { name: 'Apr', new: 25, total: 160 },
  { name: 'May', new: 22, total: 175 },
  { name: 'Jun', new: 30, total: 190 },
];

const StatCard: React.FC<{ title: string; value: string; change: string; changeType: 'increase' | 'decrease' }> = ({ title, value, change, changeType }) => {
  const isIncrease = changeType === 'increase';
  return (
    <div className="bg-surface p-6 rounded-lg shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
      <h3 className="text-sm font-medium text-subtle">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
      <div className={`flex items-center mt-2 text-sm ${isIncrease ? 'text-green-500' : 'text-red-500'}`}>
        {isIncrease ? (
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd"></path></svg>
        ) : (
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-3.707-7.293l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414z" clipRule="evenodd"></path></svg>
        )}
        <span>{change} vs last month</span>
      </div>
    </div>
  );
};


const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="$45,231" change="+12.5%" changeType="increase" />
        <StatCard title="Appointments" value="132" change="-2.1%" changeType="decrease" />
        <StatCard title="New Patients" value="23" change="+5" changeType="increase" />
        <StatCard title="Outstanding Balance" value="$3,450" change="+8.2%" changeType="increase" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#007A7A" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-surface p-6 rounded-lg shadow-md">
           <h3 className="text-lg font-semibold text-gray-800 mb-4">Patient Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={patientData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#007A7A" strokeWidth={2} name="Total Patients"/>
              <Line type="monotone" dataKey="new" stroke="#FFC107" strokeWidth={2} name="New Patients"/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
