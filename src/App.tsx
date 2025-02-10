import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import POSCafe from './pages/POSCafe';
import ProcessingOrder from './pages/ProcessingOrder';
import Receipt from './pages/Receipt';
import ProductList from './pages/ProductList';
import Dashboard from './pages/Dashboard';
import AddEmployee from './pages/AddEmployee';
import AddProduct from './pages/AddProduct';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/pos" element={<POSCafe />} />
        <Route path="/processing" element={<ProcessingOrder />} />
        <Route path="/receipt" element={<Receipt />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;