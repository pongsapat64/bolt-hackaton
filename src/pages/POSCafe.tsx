import React, { useState } from 'react';
import { Coffee, ShoppingCart, Plus, X, Search } from 'lucide-react';
import Sidebar from '../components/Sidebar';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

interface ProductCustomization {
  amount: number;
  temperature: 'hot' | 'cold';
  size: 'small' | 'big';
  sweetness: 'little' | 'normal' | 'very sweet';
  notes: string;
}

interface CartItem extends Product {
  quantity: number;
  customization: ProductCustomization;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Espresso',
    price: 3.50,
    category: 'Hot Coffee',
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&q=80',
    description: 'Rich and bold espresso shot made from premium coffee beans'
  },
  {
    id: 2,
    name: 'Cappuccino',
    price: 4.50,
    category: 'Hot Coffee',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80',
    description: 'Classic Italian coffee with equal parts espresso, steamed milk, and milk foam'
  },
  {
    id: 3,
    name: 'Latte',
    price: 4.00,
    category: 'Hot Coffee',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80',
    description: 'Smooth espresso with steamed milk and a light layer of milk foam'
  },
  {
    id: 4,
    name: 'Iced Coffee',
    price: 4.00,
    category: 'Cold Coffee',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&q=80',
    description: 'Chilled coffee served over ice, perfect for hot days'
  },
  {
    id: 5,
    name: 'Croissant',
    price: 3.00,
    category: 'Pastries',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80',
    description: 'Buttery, flaky French pastry'
  },
  {
    id: 6,
    name: 'Chocolate Cake',
    price: 5.00,
    category: 'Pastries',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80',
    description: 'Rich chocolate cake with smooth chocolate ganache'
  }
];

function POSCafe() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customization, setCustomization] = useState<ProductCustomization>({
    amount: 1,
    temperature: 'hot',
    size: 'small',
    sweetness: 'normal',
    notes: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', ...new Set(products.map(product => product.category))];

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const searchedProducts = filteredProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCustomization = () => {
    if (!selectedProduct) return;

    const newItem: CartItem = {
      ...selectedProduct,
      quantity: customization.amount,
      customization: { ...customization }
    };

    setCart(currentCart => [...currentCart, newItem]);
    setSelectedProduct(null);
    setCustomization({
      amount: 1,
      temperature: 'hot',
      size: 'small',
      sweetness: 'normal',
      notes: ''
    });
  };

  const removeFromCart = (index: number) => {
    setCart(currentCart => currentCart.filter((_, i) => i !== index));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Please add items to cart before checking out');
      return;
    }
    alert('Order completed successfully!');
    setCart([]);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      
      <div className="flex-1">
        <div className="p-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-slate-700 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchedProducts.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow relative"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 font-medium">
                      ${product.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="w-10 h-10 rounded-full bg-slate-700 text-white flex items-center justify-center hover:bg-slate-800 transition-colors shadow-md"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-96 bg-white border-l border-slate-200 p-6">
        <div className="flex items-center mb-6">
          <ShoppingCart className="h-6 w-6 text-slate-700" />
          <h2 className="ml-2 text-xl font-semibold text-slate-900">Current Order</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {cart.map((item, index) => (
            <div key={index} className="mb-4 p-3 border border-slate-200 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-slate-900">{item.name}</h3>
                  <p className="text-sm text-slate-600">${item.price.toFixed(2)} x {item.quantity}</p>
                </div>
                <button
                  onClick={() => removeFromCart(index)}
                  className="p-1 hover:bg-slate-100 rounded-full"
                >
                  <X className="h-4 w-4 text-slate-600" />
                </button>
              </div>
              <div className="text-sm text-slate-600">
                <p>Size: {item.customization.size}</p>
                <p>Temperature: {item.customization.temperature}</p>
                <p>Sweetness: {item.customization.sweetness}</p>
                {item.customization.notes && (
                  <p>Notes: {item.customization.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-slate-200 pt-4">
          <div className="flex justify-between mb-4">
            <span className="font-semibold text-slate-900">Total</span>
            <span className="font-semibold text-slate-900">${total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Complete Order
          </button>
        </div>
      </div>

      {/* Customization Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{selectedProduct.name}</h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1 hover:bg-slate-100 rounded-full"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  min="1"
                  value={customization.amount}
                  onChange={(e) => setCustomization(prev => ({
                    ...prev,
                    amount: parseInt(e.target.value) || 1
                  }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                />
              </div>

              {selectedProduct.category.includes('Coffee') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Temperature
                    </label>
                    <select
                      value={customization.temperature}
                      onChange={(e) => setCustomization(prev => ({
                        ...prev,
                        temperature: e.target.value as 'hot' | 'cold'
                      }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    >
                      <option value="hot">Hot</option>
                      <option value="cold">Cold</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Size
                    </label>
                    <select
                      value={customization.size}
                      onChange={(e) => setCustomization(prev => ({
                        ...prev,
                        size: e.target.value as 'small' | 'big'
                      }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    >
                      <option value="small">Small</option>
                      <option value="big">Big</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Sweetness
                    </label>
                    <select
                      value={customization.sweetness}
                      onChange={(e) => setCustomization(prev => ({
                        ...prev,
                        sweetness: e.target.value as 'little' | 'normal' | 'very sweet'
                      }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    >
                      <option value="little">Little Sweet</option>
                      <option value="normal">Normal Sweet</option>
                      <option value="very sweet">Very Sweet</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Special Instructions
                </label>
                <textarea
                  value={customization.notes}
                  onChange={(e) => setCustomization(prev => ({
                    ...prev,
                    notes: e.target.value
                  }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  rows={3}
                  placeholder="Any special requests..."
                />
              </div>

              <button
                onClick={handleCustomization}
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                Add to Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default POSCafe;