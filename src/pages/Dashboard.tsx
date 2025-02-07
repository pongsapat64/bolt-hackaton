import React from 'react';
import Sidebar from '../components/Sidebar';

function Dashboard() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-slate-600">Dashboard content will be displayed here</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;