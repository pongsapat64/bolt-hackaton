import React, { useState } from 'react';
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

const BOTNOI_API_URL = 'https://api-voice.botnoi.ai/openapi/v1/generate_audio';
const BOTNOI_TOKEN = 'UXpKT1FrUEZKY1FuU2lBUmU0bVI4czN6MkV6MTU2MTg5NA=='; // Add your Botnoi token here

function ProcessingOrder() {
  const [loading, setLoading] = useState<number | null>(null);

  const handleReadyToServe = async (orderNumber: number) => {
    setLoading(orderNumber);
    
    const textToSpeak = `ออเดอร์หมายเลข ${orderNumber} พร้อมแล้ว`;
    
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
                  disabled={loading === order.number}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    loading === order.number ? 'bg-gray-400' : 'bg-slate-700 hover:bg-slate-800 text-white'
                  }`}
                >
                  <Volume2 className="h-5 w-5" />
                  <span>{loading === order.number ? 'Loading...' : 'Ready to Serve'}</span>
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
