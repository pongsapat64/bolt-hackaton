import React from 'react';
import Sidebar from '../components/Sidebar';
import { ClipboardList, Volume2 } from 'lucide-react';

// Mock data for processing orders
const mockOrders = [
  {
    number: 1002,
    status: 'processing',
    items: [
      { name: 'Espresso', quantity: 2, customization: { size: 'small', temperature: 'hot' } },
      { name: 'Croissant', quantity: 1 }
    ],
    timestamp: new Date()
  }
];

function ProcessingOrder() {
  const handleReadyToServe = (orderNumber: number) => {
    // Here you would typically:
    // 1. Play the voice API
    // 2. Update the order status
    console.log(`Order ${orderNumber} is ready to serve`);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex items-center mb-6">
          <ClipboardList className="h-6 w-6 text-slate-700 mr-2" />
          <h1 className="text-2xl font-bold text-slate-900">Processing Orders</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockOrders.map((order) => (
            <div key={order.number} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-900">Order #{order.number}</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 capitalize">
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="space-y-3 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-slate-900">
                          {item.quantity}x {item.name}
                        </p>
                        {item.customization && (
                          <p className="text-sm text-slate-600">
                            {Object.entries(item.customization)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleReadyToServe(order.number)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <Volume2 className="h-5 w-5" />
                  <span>Ready to Serve</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProcessingOrder;