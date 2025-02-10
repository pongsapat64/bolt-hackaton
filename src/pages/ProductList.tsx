import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Plus, Search, Edit, Trash2, Coffee, CakeSlice, IceCream, Users } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  stock: number;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Espresso',
    price: 3.50,
    category: 'Hot Coffee',
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&q=80',
    description: 'Rich and bold espresso shot made from premium coffee beans',
    stock: 100
  },
  {
    id: 2,
    name: 'Cappuccino',
    price: 4.50,
    category: 'Hot Coffee',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80',
    description: 'Classic Italian coffee with equal parts espresso, steamed milk, and milk foam',
    stock: 85
  },
  {
    id: 3,
    name: 'Latte',
    price: 4.00,
    category: 'Hot Coffee',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80',
    description: 'Smooth espresso with steamed milk and a light layer of milk foam',
    stock: 90
  },
  {
    id: 4,
    name: 'Iced Coffee',
    price: 4.00,
    category: 'Cold Coffee',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&q=80',
    description: 'Chilled coffee served over ice, perfect for hot days',
    stock: 75
  },
  {
    id: 5,
    name: 'Croissant',
    price: 3.00,
    category: 'Pastries',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80',
    description: 'Buttery, flaky French pastry',
    stock: 30
  },
  {
    id: 6,
    name: 'Chocolate Cake',
    price: 5.00,
    category: 'Pastries',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80',
    description: 'Rich chocolate cake with smooth chocolate ganache',
    stock: 20
  },
  {
    id: 7,
    name: 'Vanilla Ice Cream',
    price: 3.50,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?w=400&q=80',
    description: 'Creamy vanilla ice cream made with Madagascar vanilla',
    stock: 40
  },
  {
    id: 8,
    name: 'Green Tea',
    price: 3.00,
    category: 'Hot Tea',
    image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400&q=80',
    description: 'Japanese green tea with a delicate, earthy flavor',
    stock: 60
  }
];

function ProductList() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', ...new Set(products.map(product => product.category))];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Hot Coffee':
      case 'Cold Coffee':
        return <Coffee className="h-5 w-5" />;
      case 'Pastries':
        return <CakeSlice className="h-5 w-5" />;
      case 'Desserts':
        return <IceCream className="h-5 w-5" />;
      default:
        return <Coffee className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">จัดการสินค้า</h1>
          <div className="flex space-x-4">
            <button 
              onClick={() => navigate('/add-employee')}
              className="flex items-center px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Users className="h-5 w-5 mr-2" />
              เพิ่มพนักงาน
            </button>
            <button 
              onClick={() => navigate('/add-product')}
              className="flex items-center px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              เพิ่มสินค้า
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="ค้นหาสินค้า..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              />
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center ${
                  selectedCategory === category
                    ? 'bg-slate-700 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {category !== 'All' && <span className="mr-2">{getCategoryIcon(category)}</span>}
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">สินค้า</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">หมวดหมู่</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ราคา</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">สต็อก</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">จัดการ</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">{product.name}</div>
                          <div className="text-sm text-slate-500">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      ฿{product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.stock > 50
                          ? 'bg-green-100 text-green-800'
                          : product.stock > 20
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock} ชิ้น
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <div className="flex space-x-2">
                        <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1 hover:bg-red-100 rounded-lg text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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

export default ProductList;