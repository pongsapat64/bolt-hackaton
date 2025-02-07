import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home,
  ClipboardList,
  Receipt,
  Package,
  LayoutDashboard,
  LogOut 
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { name: 'Home', path: '/pos', icon: <Home className="w-5 h-5" /> },
  { name: 'Processing Order', path: '/processing', icon: <ClipboardList className="w-5 h-5" /> },
  { name: 'Receipt', path: '/receipt', icon: <Receipt className="w-5 h-5" /> },
  { name: 'Product List', path: '/products', icon: <Package className="w-5 h-5" /> },
  { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col">
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <Home className="h-8 w-8 text-slate-700" />
          <span className="text-xl font-bold text-slate-900">Cafe POS</span>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;