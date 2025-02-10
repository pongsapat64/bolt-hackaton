import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Receipt as ReceiptIcon, Eye, X } from 'lucide-react';

// Mock data for receipts
const mockReceipts = [
  {
    id: 1001,
    date: '2024-03-15',
    time: '10:30 AM',
    paymentMethod: 'cash',
    total: 25.50,
    status: 'done',
    employee: 'John',
    items: [
      { name: 'Americano', price: 40, quantity: 2, customization: { temperature: 'ร้อน', size: 'เล็ก', sweetness: 'หวานปกติ' } },
      { name: 'Croissant', price: 35, quantity: 1 }
    ]
  },
  // ... (keep other mock receipts)
];

interface ReceiptDetailsProps {
  receipt: typeof mockReceipts[0];
  onClose: () => void;
}

function ReceiptDetails({ receipt, onClose }: ReceiptDetailsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">รายละเอียดใบเสร็จ #{receipt.id}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-full"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">วันที่</p>
              <p className="font-medium">{receipt.date}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">เวลา</p>
              <p className="font-medium">{receipt.time}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">พนักงาน</p>
              <p className="font-medium">{receipt.employee}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">วิธีชำระเงิน</p>
              <p className="font-medium capitalize">{receipt.paymentMethod}</p>
            </div>
          </div>

          <div className="border-t border-b border-slate-200 py-4">
            <table className="w-full">
              <thead>
                <tr className="text-sm text-slate-600">
                  <th className="text-left pb-2">รายการ</th>
                  <th className="text-center pb-2">จำนวน</th>
                  <th className="text-right pb-2">ราคา</th>
                </tr>
              </thead>
              <tbody>
                {receipt.items.map((item, index) => (
                  <tr key={index}>
                    <td className="py-2">
                      <p className="font-medium">{item.name}</p>
                      {item.customization && (
                        <p className="text-sm text-slate-500">
                          {item.customization.temperature}, {item.customization.size}, {item.customization.sweetness}
                        </p>
                      )}
                    </td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">฿{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <div className="text-right">
              <p className="text-lg font-semibold">ยอดรวม: ฿{receipt.total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Receipt() {
  const [selectedReceipt, setSelectedReceipt] = useState<typeof mockReceipts[0] | null>(null);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex items-center mb-6">
          <ReceiptIcon className="h-6 w-6 text-slate-700 mr-2" />
          <h1 className="text-2xl font-bold text-slate-900">ใบเสร็จ</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    เลขที่
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    วันที่
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    เวลา
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    พนักงาน
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    วิธีชำระเงิน
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    ยอดรวม
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    สถานะ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {mockReceipts.map((receipt) => (
                  <tr key={receipt.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      #{receipt.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {receipt.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {receipt.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {receipt.employee}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 capitalize">
                      {receipt.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      ฿{receipt.total.toFixed(2)}
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
                      <button 
                        onClick={() => setSelectedReceipt(receipt)}
                        className="flex items-center text-slate-600 hover:text-slate-900"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        ดูรายละเอียด
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedReceipt && (
        <ReceiptDetails 
          receipt={selectedReceipt} 
          onClose={() => setSelectedReceipt(null)} 
        />
      )}
    </div>
  );
}

export default Receipt;