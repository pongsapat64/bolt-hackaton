import React from 'react';
import Sidebar from '../components/Sidebar';
import { Receipt as ReceiptIcon, Eye } from 'lucide-react';

// Mock data for receipts
const mockReceipts = [
  {
    number: 1001,
    date: '2024-03-15',
    time: '10:30 AM',
    paymentMethod: 'cash',
    total: 25.50,
    status: 'done'
  },
  {
    number: 1002,
    date: '2024-03-15',
    time: '11:15 AM',
    paymentMethod: 'qr',
    total: 18.75,
    status: 'processing'
  },
  {
    number: 1003,
    date: '2024-03-15',
    time: '11:45 AM',
    paymentMethod: 'cash',
    total: 32.00,
    status: 'cancelled'
  }
];

function Receipt() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex items-center mb-6">
          <ReceiptIcon className="h-6 w-6 text-slate-700 mr-2" />
          <h1 className="text-2xl font-bold text-slate-900">Receipts</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {mockReceipts.map((receipt) => (
                  <tr key={receipt.number} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      #{receipt.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {receipt.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {receipt.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 capitalize">
                      {receipt.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      ${receipt.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${receipt.status === 'processing' ? 'bg-yellow-100 text-yellow-800' : 
                          receipt.status === 'done' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {receipt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      <button className="flex items-center text-slate-600 hover:text-slate-900">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Receipt;