import React, { useEffect, useState } from 'react';
import { Coffee, ShoppingCart, Plus, Minus, Search, CreditCard, QrCode, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { supabase } from '../lib/supabase';

interface Product {
  id: number;
  name: string;
  nameEn: string;
  price: number;
  image: string;
  category?: string;
}

interface ProductCustomization {
  temperature: 'ร้อน' | 'เย็น' | 'ปั่น';
  size: 'เล็ก' | 'ใหญ่';
  sweetness: 'ไม่หวาน' | 'หวานน้อย' | 'หวานปกติ' | 'หวานมาก';
  note: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  customization: ProductCustomization;
  image: string; // Add this line
}

const products: Product[] = [
  {
    id: 1,
    name: 'อเมริกาโน่',
    nameEn: 'Americano',
    price: 40,
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&q=80',
    category: 'Hot Coffee'
  },
  {
    id: 2,
    name: 'เอสเพรสโซ่',
    nameEn: 'Espresso',
    price: 45,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80',
    category: 'Hot Coffee'
  },
  {
    id: 3,
    name: 'คาปูชิโน่',
    nameEn: 'Cappuccino',
    price: 40,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&q=80',
    category: 'Hot Coffee'
  },
  {
    id: 4,
    name: 'มอคค่า',
    nameEn: 'Mocha',
    price: 45,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80',
    category: 'Cold Coffee'
  },
  {
    id: 5,
    name: 'ลาเต้',
    nameEn: 'Latte',
    price: 40,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&q=80',
    category: 'Cold Coffee'
  },
  {
    id: 6,
    name: 'คาราเมลมัคคิอาโต้',
    nameEn: 'Caramel Macchiato',
    price: 50,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80',
    category: 'Blended'
  },
  {
    id: 7,
    name: 'กาแฟเย็น',
    nameEn: 'Iced Coffee',
    price: 40,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&q=80',
    category: 'Cold Coffee'
  }
];

export interface Employee {
  id: number;
  firstname: string;
  lastname: string;
  firstlast: string;
}
function POSCafe() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCashPayment, setShowCashPayment] = useState(false);
  const [showQRPayment, setShowQRPayment] = useState(false);
  const [cashAmount, setCashAmount] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [showConfirmPayment, setShowConfirmPayment] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]); // State for employees
  const [customization, setCustomization] = useState<ProductCustomization>({
    temperature: 'ร้อน',
    size: 'เล็ก',
    sweetness: 'หวานปกติ',
    note: ''
  });

  const filteredProducts = products.filter(product => {
    if (selectedCategory === 'ทั้งหมด') return true;
    if (selectedCategory === 'ร้อน') return product.category === 'Hot Coffee';
    if (selectedCategory === 'เย็น') return product.category === 'Cold Coffee';
    if (selectedCategory === 'ปั่น') return product.category === 'Blended';
    return true;
  });

  const addToCart = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const newItem: CartItem = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      quantity: 1,
      customization: { ...customization },
      image: selectedProduct.image
    };

    setCart(prev => [...prev, newItem]);
    setSelectedProduct(null);
    setCustomization({
      temperature: 'ร้อน',
      size: 'เล็ก',
      sweetness: 'หวานปกติ',
      note: ''
    });
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, increment: boolean) => {
    setCart(prev => prev.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          quantity: increment ? item.quantity + 1 : Math.max(1, item.quantity - 1)
        };
      }
      return item;
    }));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  useEffect(() => {
    const fetchEmployees = async () => {
      const { data, error } = await supabase.from('employee').select('*');

      if (error) {
        console.error('Error fetching employees:', error);
      } else {
        setEmployees(data); // Set employee data to state
      }
    };

    fetchEmployees();
  }, []);
  const handleCashPayment = () => {
    if (cart.length === 0) {
        console.error("Cart is empty. Cannot process payment.");
        return;
    }
    if (!selectedEmployee === true){
      alert("กรุณาเลือกพนักงาน");
      return;
    }
    setShowCashPayment(true); // Show cash payment popup first
};

// Function to confirm and insert the order
const confirmCashPayment = async () => {
  if (!cashAmount || parseFloat(cashAmount) < total) {
      alert("Amount paid is insufficient!");
      return;
  }

  try {
      // Step 1: Insert into `order` table
      const { data: orderData, error: orderError } = await supabase
          .from('order')
          .insert([{ 
              Status: "Processing", 
              TotalAmount: total 
          }])
          .select('id')
          .single();

      if (orderError) {
          console.error("Error inserting order:", orderError);
          return;
      }

      const orderId = orderData.id; // Get the inserted order ID

      // Step 2: Prepare `orderdetail` data
      const orderDetails = cart.map(item => ({
          order_id: orderId, 
          name: item.name,
          unitprice: item.price,
          quantity: item.quantity,
          totalprice: item.price * item.quantity,
          desc: `${item.customization.sweetness}, ${item.customization.size}, ${item.customization.temperature}`
      }));

      // Step 3: Insert into `orderdetail` table
      const { error: orderDetailsError } = await supabase
          .from('orderdetail')
          .insert(orderDetails);

      if (orderDetailsError) {
          console.error("Error inserting order details:", orderDetailsError);
          return;
      }

      console.log("Order and order details successfully saved to database!");
      console.log("this is selected emply:",` ${selectedEmployee}`);
      // Step 4: Insert into `receipt` table
      const { error: receiptError } = await supabase
          .from('receipt')
          .insert([{
              order_id: orderId,
              payment_method: "cash",  // Assuming payment method is cash
              total_amount: total,
              status: "Processing",  // Assuming status is completed after successful payment
              employee: selectedEmployee  // You can set this based on the employee selected
          }]);

      if (receiptError) {
          console.error("Error inserting receipt:", receiptError);
          return;
      }

      console.log("Receipt successfully saved to database!");

      // Step 5: Reset state and redirect
      setCart([]); // Clear cart after successful order
      setCashAmount(''); // Reset cash amount
      setShowCashPayment(false); // Close popup
      setShowConfirmPayment(false); // Close confirmation popup
      navigate('/processing', { 
        state: { orderId, orderDetails }
      });

  } catch (error) {
      console.error("Unexpected error:", error);
  }
};



  const handleQRPayment = async () => {
    if (cart.length === 0) {
        console.error("Cart is empty. Cannot process payment.");
        return;
    }
    // Convert cart items to match the expected API payload format, including the image
    const payload = {
        item: cart.map(item => ({
            name: item.name,
            description: `${item.customization.sweetness} ${item.customization.size}`,
            price: item.price * 100, // Convert to smallest currency unit (e.g., THB cents)
            image: item.image // Include product image URL
        })),
        currency: "thb",
        method: ["promptpay"],
        employee: selectedEmployee
    };
    setShowQRPayment(true);
    try {
        const backend_api = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${backend_api}/api/stripe/custom_price`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.data) {
          const paymentUrl = data.data; // Stripe payment URL
          
            // Open in a new tab
          window.open(paymentUrl, "_blank");
          setShowQRPayment(false); // Close QR payment popup
          setCart([]); // Clear cart after successful order
          
          
        }

    } catch (error) {
        console.error("Error processing QR payment:", error);
    }
};


  const handleProcessPayment = () => {
    if (!selectedEmployee) {
      alert('กรุณาเลือกพนักงาน');
      return;
    }
    navigate('/processing', { 
      state: { 
        cart,
        employee: selectedEmployee,
        paymentMethod: showCashPayment ? 'cash' : 'qr',
        cashAmount: showCashPayment ? parseFloat(cashAmount) : null
      } 
    });
  };
  
  const handleCashInput = (value: string) => {
    if (value === 'clear') {
      setCashAmount('');
    } else if (value === 'backspace') {
      setCashAmount(prev => prev.slice(0, -1));
    } else {
      setCashAmount(prev => prev + value);
    }
  };

  const getChange = () => {
    const paid = parseFloat(cashAmount) || 0;
    return Math.max(0, paid - total);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex flex-1">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedCategory('ทั้งหมด')}
                className={`px-4 py-2 rounded-full text-sm ${
                  selectedCategory === 'ทั้งหมด'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-slate-700'
                }`}
              >
                ทั้งหมด
              </button>
              <button
                onClick={() => setSelectedCategory('ร้อน')}
                className={`px-4 py-2 rounded-full text-sm ${
                  selectedCategory === 'ร้อน'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-slate-700'
                }`}
              >
                ร้อน
              </button>
              <button
                onClick={() => setSelectedCategory('เย็น')}
                className={`px-4 py-2 rounded-full text-sm ${
                  selectedCategory === 'เย็น'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-slate-700'
                }`}
              >
                เย็น
              </button>
              <button
                onClick={() => setSelectedCategory('ปั่น')}
                className={`px-4 py-2 rounded-full text-sm ${
                  selectedCategory === 'ปั่น'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-slate-700'
                }`}
              >
                ปั่น
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg"
              >
                <option value="">เลือกพนักงาน</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.firstlast} >
                  {emp.firstname} {emp.lastname}
                  </option>
                ))}
              </select>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="ค้นหา..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-3 gap-4">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => addToCart(product)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium text-slate-900">{product.name}</h3>
                  <p className="text-sm text-slate-500">{product.nameEn}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-orange-500 font-medium">฿{product.price}</span>
                    <button className="w-8 h-8 flex items-center justify-center bg-orange-500 text-white rounded-full">
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Panel */}
        <div className="w-96 bg-white border-l border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">รายการสั่งซื้อ</h2>
            <span className="text-sm text-slate-500">#{String(Math.floor(Math.random() * 1000)).padStart(3, '0')}</span>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto mb-6">
            {cart.map((item, index) => (
              <div key={index} className="mb-4 p-3 border border-slate-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-slate-900">{item.name}</h3>
                    <p className="text-sm text-slate-600">฿{item.price}</p>
                    <div className="text-xs text-slate-500 mt-1">
                      <p>{item.customization.temperature}, {item.customization.size}</p>
                      <p>ความหวาน: {item.customization.sweetness}</p>
                      {item.customization.note && <p>หมายเหตุ: {item.customization.note}</p>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(index, false)}
                      className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-slate-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(index, true)}
                      className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeFromCart(index)}
                      className="w-6 h-6 flex items-center justify-center text-red-400 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total and Payment */}
          <div className="border-t border-slate-200 pt-4">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-900">ยอดรวม</span>
              <span className="text-xl font-semibold text-slate-900">฿{total}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleCashPayment}
                disabled={cart.length === 0}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-slate-200 disabled:cursor-not-allowed"
              >
                <CreditCard className="h-5 w-5" />
                <span>เงินสด</span>
              </button>
              <button
                onClick={handleQRPayment}
                disabled={cart.length === 0}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-slate-200 disabled:cursor-not-allowed"
              >
                <QrCode className="h-5 w-5" />
                <span>QR Code</span>
              </button>
            </div>
          </div>
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
                  อุณหภูมิ
                </label>
                <select
                  value={customization.temperature}
                  onChange={(e) => setCustomization(prev => ({
                    ...prev,
                    temperature: e.target.value as 'ร้อน' | 'เย็น' | 'ปั่น'
                  }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="ร้อน">ร้อน</option>
                  <option value="เย็น">เย็น</option>
                  <option value="ปั่น">ปั่น</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  ขนาด
                </label>
                <select
                  value={customization.size}
                  onChange={(e) => setCustomization(prev => ({
                    ...prev,
                    size: e.target.value as 'เล็ก' | 'ใหญ่'
                  }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="เล็ก">เล็ก</option>
                  <option value="ใหญ่">ใหญ่</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  ความหวาน
                </label>
                <select
                  value={customization.sweetness}
                  onChange={(e) => setCustomization(prev => ({
                    ...prev,
                    sweetness: e.target.value as 'ไม่หวาน' | 'หวานน้อย' | 'หวานปกติ' | 'หวานมาก'
                  }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="ไม่หวาน">ไม่หวาน</option>
                  <option value="หวานน้อย">หวานน้อย</option>
                  <option value="หวานปกติ">หวานปกติ</option>
                  <option value="หวานมาก">หวานมาก</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  หมายเหตุเพิ่มเติม
                </label>
                <textarea
                  value={customization.note}
                  onChange={(e) => setCustomization(prev => ({
                    ...prev,
                    note: e.target.value
                  }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  rows={3}
                  placeholder="เพิ่มหมายเหตุ..."
                />
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                เพิ่มลงตะกร้า
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cash Payment Modal */}
        {showCashPayment && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">ชำระเงินสด</h3>
          <button
            onClick={() => {
              setShowCashPayment(false);
              setCashAmount('');
            }}
            className="p-1 hover:bg-slate-100 rounded-full"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-600">ยอดรวม</span>
            <span className="text-lg font-semibold">฿{total}</span>
          </div>
          {cashAmount && (
            <>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-600">รับเงิน</span>
                <span className="text-lg font-semibold">฿{parseFloat(cashAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">เงินทอน</span>
                <span className="text-lg font-semibold text-green-600">
                  ฿{(parseFloat(cashAmount) - total).toFixed(2)}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={cashAmount}
              readOnly
              placeholder="0.00"
              className="w-full px-4 py-3 text-2xl text-right font-semibold bg-white border border-slate-200 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'backspace'].map((key) => (
              <button
                key={key}
                onClick={() => handleCashInput(key)}
                className="p-4 text-xl font-medium bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                {key === 'backspace' ? '←' : key === 'clear' ? 'C' : key}
              </button>
            ))}
          </div>

          {/* ✅ Confirm Payment Button */}
          <button
            onClick={confirmCashPayment} // Calls function to insert data
            disabled={!cashAmount || parseFloat(cashAmount) < total}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-slate-200 disabled:cursor-not-allowed"
          >
            <span>ยืนยันการชำระเงิน</span>
          </button>
        </div>
      </div>
    </div>
  )}


      {/* QR Payment Modal */}
      {showQRPayment && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">กำลังดำเนินการชำระเงิน...</h3>
            <button
              onClick={() => setShowQRPayment(false)}
              className="p-1 hover:bg-slate-100 rounded-full"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>
          </div>

          <div className="flex justify-center mb-6">
            {/* ✅ Show Loading Animation Instead of QR Code */}
            <div className="w-24 h-24 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>

          <p className="text-center text-gray-600 mb-4">
            กรุณารอสักครู่ ระบบกำลังดำเนินการชำระเงิน...
          </p>

          <button
            onClick={()=> setShowQRPayment(false)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            <span>ยกเลิกรายการ</span>
          </button>
        </div>
      </div>
    )}

    </div>
  );
}

export default POSCafe;