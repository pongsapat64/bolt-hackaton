import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ManagerDashboard from './pages/ManagerDashboard';
import EmployeePage from './pages/EmployeePage';
import AddEmployee from './pages/AddEmployee';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ManagerDashboard />} />
        <Route path="/employee" element={<EmployeePage />} />
        <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;