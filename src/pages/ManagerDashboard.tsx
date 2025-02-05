import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, LogOut, Plus, Search } from 'lucide-react';

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
}

// Create a singleton to store employees (temporary solution)
export const employeeStore = {
  employees: [
    { id: 1, firstName: 'John', lastName: 'Doe' },
    { id: 2, firstName: 'Jane', lastName: 'Smith' },
    { id: 3, firstName: 'Mike', lastName: 'Johnson' },
  ],
  addEmployee: (firstName: string, lastName: string) => {
    const newId = employeeStore.employees.length > 0 
      ? Math.max(...employeeStore.employees.map(e => e.id)) + 1 
      : 1;
    const newEmployee = { id: newId, firstName, lastName };
    employeeStore.employees.push(newEmployee);
    return newEmployee;
  }
};

function ManagerDashboard() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>(employeeStore.employees);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    navigate('/login');
  };

  const filteredEmployees = employees.filter(employee => 
    `${employee.firstName} ${employee.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Update the employee list when the component mounts or regains focus
  React.useEffect(() => {
    const updateEmployees = () => {
      setEmployees([...employeeStore.employees]);
    };

    updateEmployees();
    window.addEventListener('focus', updateEmployees);
    return () => window.removeEventListener('focus', updateEmployees);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-slate-700" />
              <h1 className="ml-3 text-2xl font-bold text-slate-900">Manager Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Employee Directory</h2>
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                />
              </div>
              <button 
                onClick={() => navigate('/add-employee')}
                className="flex items-center px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Employee
              </button>
            </div>
          </div>

          {/* Employee List */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">First Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{employee.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{employee.firstName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{employee.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <button 
                        onClick={() => navigate('/employee')}
                        className="text-slate-600 hover:text-slate-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ManagerDashboard;