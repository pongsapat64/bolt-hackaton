import React from 'react';
import Sidebar from '../components/Sidebar';

function ProductList() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Product List</h1>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-slate-600">Product list content will be displayed here</p>
        </div>
      </div>
    </div>
  );
}

export default ProductList;