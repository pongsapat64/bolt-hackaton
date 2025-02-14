import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Package } from 'lucide-react';

interface ProductData {
  name: string;
  nameEn: string;
  price: string;
  category: string;
  description: string;
  stock: string;
  image: string;
}

function AddProduct() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [productData, setProductData] = useState<ProductData>({
    name: '',
    nameEn: '',
    price: '',
    category: 'Hot Coffee',
    description: '',
    stock: '',
    image: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!productData.name || !productData.price || !productData.stock) {
      setError('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    // Validate price and stock are numbers
    if (isNaN(Number(productData.price)) || isNaN(Number(productData.stock))) {
      setError('ราคาและจำนวนสต็อกต้องเป็นตัวเลขเท่านั้น');
      return;
    }

    try {
      // Here you would typically save the product data to your backend
      console.log('Saving product:', productData);
      
      // Show success message and navigate back
      alert('เพิ่มสินค้าสำเร็จ');
      navigate('/products');
    } catch (err) {
      setError('ไม่สามารถเพิ่มสินค้าได้ กรุณาลองใหม่อีกครั้ง');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/products')}
              className="flex items-center text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              กลับไปหน้าจัดการสินค้า
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100">
              <Package className="w-8 h-8 text-slate-700" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center text-slate-900 mb-8">
            เพิ่มสินค้าใหม่
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                  ชื่อสินค้า (ภาษาไทย) *
                </label>
                <input
                  type="text"
                  id="name"
                  value={productData.name}
                  onChange={(e) => setProductData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  placeholder="กรอกชื่อสินค้า"
                />
              </div>

              <div>
                <label htmlFor="nameEn" className="block text-sm font-medium text-slate-700">
                  ชื่อสินค้า (ภาษาอังกฤษ)
                </label>
                <input
                  type="text"
                  id="nameEn"
                  value={productData.nameEn}
                  onChange={(e) => setProductData(prev => ({ ...prev, nameEn: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-700">
                  หมวดหมู่ *
                </label>
                <select
                  id="category"
                  value={productData.category}
                  onChange={(e) => setProductData(prev => ({ ...prev, category: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                >
                  <option value="Hot Coffee">Hot Coffee</option>
                  <option value="Cold Coffee">Cold Coffee</option>
                  <option value="Pastries">Pastries</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-slate-700">
                  ราคา (บาท) *
                </label>
                <input
                  type="number"
                  id="price"
                  value={productData.price}
                  onChange={(e) => setProductData(prev => ({ ...prev, price: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-slate-700">
                  จำนวนในสต็อก *
                </label>
                <input
                  type="number"
                  id="stock"
                  value={productData.stock}
                  onChange={(e) => setProductData(prev => ({ ...prev, stock: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-slate-700">
                  URL รูปภาพ
                </label>
                <input
                  type="file"
                  id="image"
                  value={productData.image}
                  onChange={(e) => setProductData(prev => ({ ...prev, image: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                  รายละเอียดสินค้า
                </label>
                <textarea
                  id="description"
                  value={productData.description}
                  onChange={(e) => setProductData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  placeholder="กรอกรายละเอียดสินค้า"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Save className="h-5 w-5 mr-2" />
                บันทึกสินค้า
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default AddProduct;