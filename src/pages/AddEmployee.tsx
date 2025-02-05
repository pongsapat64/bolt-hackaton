import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User } from 'lucide-react';
import { employeeStore } from './ManagerDashboard';

function AddEmployee() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim() || !lastName.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      // Add the new employee
      employeeStore.addEmployee(firstName.trim(), lastName.trim());
      
      // Show success message and navigate back
      alert('Employee added successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to add employee. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100">
              <User className="w-8 h-8 text-slate-700" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center text-slate-900 mb-8">
            Add New Employee
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-700">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  placeholder="Enter first name"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-slate-700">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Save className="h-5 w-5 mr-2" />
                Add Employee
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default AddEmployee;