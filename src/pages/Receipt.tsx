import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Receipt as ReceiptIcon, Eye, X } from 'lucide-react';
import { supabase } from '../lib/supabase'; // Import Supabase client
import { format } from 'date-fns'; // Import date-fns for formatting date

// Define types for receipt and item structure
interface ReceiptItem {
  unitprice: any;
  name: string;
  price: number;
  quantity: number;
  customization?: {
    temperature: string;
    size: string;
    sweetness: string;
  };
}

interface Receipt {
  id: number;
  created_at: string;
  order_id: number;
  payment_method: string;
  status: string;
  total_amount: number;
  employee: string;
  items: ReceiptItem[]; // Related items for the receipt
}

interface ReceiptDetailsProps {
  receipt: Receipt;
  onClose: () => void;
}

function ReceiptDetails({ receipt, onClose }: ReceiptDetailsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">รายละเอียดใบเสร็จ #{receipt.order_id}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full">
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">วันที่</p>
              <p className="font-medium">{format(new Date(receipt.created_at), 'dd-MM-yyyy')}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">เวลา</p>
              <p className="font-medium">{format(new Date(receipt.created_at), 'HH:mm:ss')}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">พนักงาน</p>
              <p className="font-medium">{receipt.employee}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">วิธีชำระเงิน</p>
              <p className="font-medium capitalize">{receipt.payment_method}</p>
            </div>
          </div>

          <div className="border-t border-b border-slate-200 py-4">
            <table className="w-full">
              <thead>
                <tr className="text-sm text-slate-600">
                  <th className="text-left pb-2">รายการ</th>
                  <th className="text-center pb-2">จำนวน</th>
                  <th className="text-right pb-2">ราคา</th>
                  <th className="text-right pb-2">ยอดรวม</th>
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
                    <td className="text-right">฿{item.unitprice.toFixed(2)}</td> {/* Subprice per item */}
                    <td className="text-right">฿{(item.unitprice * item.quantity).toFixed(2)}</td> {/* Total per item */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <div className="text-right">
              <p className="text-lg font-semibold">ยอดรวม: ฿{receipt.total_amount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Receipt() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  // Fetch data from the `receipt` table in Supabase
  useEffect(() => {
    const fetchReceipts = async () => {
      const { data, error } = await supabase
        .from('receipt')
        .select('*')
        .order('created_at', { ascending: false }); // Sort by created_at, descending order
      
      if (error) {
        console.error('Error fetching receipts:', error);
      } else {
        // Fetch related items (you can also join with `orderdetail` if necessary)
        const enrichedReceipts = await Promise.all(data.map(async (receipt: any) => {
          const { data: itemsData, error: itemsError } = await supabase
            .from('orderdetail')
            .select('*')
            .eq('order_id', receipt.order_id);

          if (itemsError) {
            console.error('Error fetching order details:', itemsError);
            return { ...receipt, items: [] };
          }

          return { ...receipt, items: itemsData };
        }));

        setReceipts(enrichedReceipts);
      }
    };

    fetchReceipts();
  }, []);

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
                {receipts.map((receipt) => (
                  <tr key={receipt.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">#{receipt.order_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{format(new Date(receipt.created_at), 'dd-MM-yyyy')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{format(new Date(receipt.created_at), 'HH:mm:ss')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{receipt.employee}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 capitalize">{receipt.payment_method}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">฿{receipt.total_amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${receipt.status === 'done' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
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
