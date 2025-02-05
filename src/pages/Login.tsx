import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Shield } from 'lucide-react';

// In a real app, these would be stored securely in a database
const MANAGER_CREDENTIALS = {
  email: 'admin@cafe.com',
  password: 'admin123'
};

const EMPLOYEE_CREDENTIALS = {
  email: 'employee@cafe.com',
  password: 'cafe123'
};

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Check manager credentials
    if (email === MANAGER_CREDENTIALS.email && password === MANAGER_CREDENTIALS.password) {
      navigate('/dashboard');
      return;
    }

    // Check employee credentials
    if (email === EMPLOYEE_CREDENTIALS.email && password === EMPLOYEE_CREDENTIALS.password) {
      navigate('/pos');
      return;
    }

    setError('Invalid email or password');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
            <Shield className="w-8 h-8 text-slate-700" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Cafe Login</h1>
          <p className="text-slate-500 mt-2">Sign in to access your workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                Keep me signed in
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
          >
            Sign in
          </button>
        </form>

        <div className="text-center text-sm text-slate-500">
          <p>Manager Login: admin@cafe.com / admin123</p>
          <p>Employee Login: employee@cafe.com / cafe123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;