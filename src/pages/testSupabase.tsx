import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Define the type for a single row of data from Supabase
interface Item {
  id: number;
  order_id:number;
  name: string;
  description: string;  // Add other fields from your 'orderdetail' table as needed
}

const TestSupabase = () => {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch data from Supabase when the component mounts
    const fetchData = async () => {
      try {
        // Supabase query to get data from 'orderdetail' table
        const { data, error } = await supabase.from('orderdetail').select('*');
        if (error) {
          throw error;
        }
        setData(data as Item[]);
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Group the data by `id`
  const groupById = (items: Item[]) => {
    return items.reduce((acc: { [key: number]: Item[] }, item) => {
      if (!acc[item.order_id]) {
        acc[item.order_id] = [];
      }
      acc[item.order_id].push(item);
      return acc;
    }, {});
  };

  // If data is still loading, display a loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // Group items by their `id`
  const groupedData = groupById(data);

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {Object.keys(groupedData).map((groupId) => {
        const items = groupedData[Number(groupId)];

        return (
          <div
            key={groupId}
            className="bg-white rounded-lg shadow-md p-4"
            style={{ width: '300px' }}
          >
            <h2 className="text-xl font-semibold mb-4">Order ID: {groupId}</h2>
            <div>
              {items.map((item) => (
                <div key={item.order_id} className="mb-4">
                  <h3 className="text-lg font-medium">{item.name}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TestSupabase;
