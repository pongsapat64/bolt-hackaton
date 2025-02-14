import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { ClipboardList, Volume2 } from 'lucide-react';
import { supabase } from '../lib/supabase'; // Import Supabase client

// Define the structure of an order item (from orderdetail)
interface OrderItem {
  id: number;
  name: string;
  unitprice: number;
  quantity: number;
  totalprice: number;
  desc?: string;
}

// Define the structure of an order (from order)
interface Order {
  id: number; // order_id
  created_at: string;
  totalAmount: number;
  Status: string;
  items: OrderItem[]; // Related order details
}

function ProcessingOrder() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<number | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);  // Current page number
  const [itemsPerPage] = useState(6);  // Number of orders to show per page

  // Fetch orders with related order details
  useEffect(() => {
    const fetchOrdersWithDetails = async () => {
      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('order')
        .select('*');

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        return;
      }

      // Fetch order details
      const { data: orderDetailsData, error: orderDetailsError } = await supabase
        .from('orderdetail')
        .select('*');

      if (orderDetailsError) {
        console.error('Error fetching order details:', orderDetailsError);
        return;
      }

      // Group order details by order_id and calculate total
      const groupedOrderDetails: { [key: number]: { items: OrderItem[]; total: number } } = {};

      orderDetailsData.forEach((detail: any) => {
        const orderId = detail.order_id;
        if (!groupedOrderDetails[orderId]) {
          groupedOrderDetails[orderId] = { items: [], total: 0 };
        }
        groupedOrderDetails[orderId].items.push(detail);
        groupedOrderDetails[orderId].total += detail.totalprice || 0; // Sum total price
      });

      // Merge orders with their details and total amount
      const formattedOrders = ordersData.map((order: any) => ({
        ...order,
        totalAmount: groupedOrderDetails[order.id]?.total || 0, // Attach total price
        items: groupedOrderDetails[order.id]?.items || [], // Attach related order details
      }));

      // Sort orders by `order_id` (descending)
      const sortedOrders = formattedOrders.sort((a, b) => b.id - a.id);

      setOrders(sortedOrders);
    };

    fetchOrdersWithDetails();
  }, []);

  // Calculate the total number of pages
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  // Get orders for the current page
  const currentOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,  // Start index for this page
    currentPage * itemsPerPage         // End index for this page
  );

  // Pagination controls
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle "Ready to Serve" button click
  const handleReadyToServe = async (orderId: number) => {
    setLoading(orderId);

    const textToSpeak = `ออเดอร์หมายเลข ${orderId} พร้อมแล้ว`;

    // Use environment variables for API call
    const BOTNOI_API_URL = import.meta.env.VITE_BOTNOI_API_URL;
    const BOTNOI_TOKEN = import.meta.env.VITE_BOTNOI_TOKEN;

    try {
      const response = await fetch(BOTNOI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Botnoi-Token': BOTNOI_TOKEN
        },
        body: JSON.stringify({
          text: textToSpeak,
          speaker: "2",
          volume: 1,
          speed: 1,
          type_media: "mp3",
          save_file: true
        })
      });

      const data = await response.json();

      if (data && data.audio_url) {
        const audio = new Audio(data.audio_url);
        audio.play();
      } else {
        console.error('Error generating audio:', data);
      }
    } catch (error) {
      console.error('Error calling the API:', error);
    } finally {
      setLoading(null);
    }
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
          {currentOrders.length === 0 ? (
            <p className="text-center text-gray-500">No processing orders available.</p>
          ) : (
            currentOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md border border-gray-300 flex flex-col h-full">
                {/* Order Header */}
                <div className="p-4 bg-slate-50 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-900">Order #{order.id}</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 capitalize">
                      {order.Status || "Pending"}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 flex-1">
                  <div className="space-y-3">
                    {order.items.length === 0 ? (
                      <p className="text-sm text-gray-500">No items in this order</p>
                    ) : (
                      order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-slate-900">
                              {item.quantity}x {item.name} - {item.unitprice}฿
                            </p>
                            {item.desc && <p className="text-sm text-slate-600">{item.desc}</p>}
                          </div>
                          <span className="font-semibold text-slate-900">{item.totalprice}฿</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Total & Button (Stick to Bottom) */}
                <div className="mt-auto p-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-slate-900">Total:</span>
                    <span className="text-lg font-bold text-green-600">{order.totalAmount.toFixed(2)}฿</span>
                  </div>

                  <button
                    onClick={() => handleReadyToServe(order.id)}
                    disabled={loading === order.id}
                    className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors mt-3 ${
                      loading === order.id ? 'bg-gray-400' : 'bg-slate-700 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <Volume2 className="h-5 w-5" />
                    <span>{loading === order.id ? 'Loading...' : 'Ready to Serve'}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between mt-4">
          <button onClick={prevPage} disabled={currentPage === 1} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={nextPage} disabled={currentPage === totalPages} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProcessingOrder;
