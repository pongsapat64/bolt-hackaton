import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ManagerDashboard from './pages/ManagerDashboard';
import EmployeePage from './pages/EmployeePage';
import AddEmployee from './pages/AddEmployee';
import POSCafe from './pages/POSCafe';
import OrdersHistory from './pages/OrdersHistory';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ManagerDashboard />} />
        <Route path="/employee" element={<EmployeePage />} />
        <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/pos" element={<POSCafe />} />
        <Route path="/orders" element={<OrdersHistory />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App