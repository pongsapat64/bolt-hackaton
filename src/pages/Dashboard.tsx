import { useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  Coffee,
  ArrowUp,
  ArrowDown,
  DollarSign,
  Users,
  ChevronDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Mock data for demonstration
const salesData = {
  today: 2450.75,
  yesterday: 2100.5,
  percentageChange: 16.7,
  topProducts: [
    { name: "Cappuccino", sales: 145, revenue: 652.5 },
    { name: "Latte", sales: 120, revenue: 480.0 },
    { name: "Espresso", sales: 98, revenue: 343.0 },
  ],
  weeklySales: [
    { name: "Mon", sales: 1800 },
    { name: "Tue", sales: 2200 },
    { name: "Wed", sales: 1950 },
    { name: "Thu", sales: 2400 },
    { name: "Fri", sales: 2800 },
    { name: "Sat", sales: 3100 },
    { name: "Sun", sales: 2450 },
  ],
  monthlySales: [
    { name: "Jan", sales: 45000 },
    { name: "Feb", sales: 48000 },
    { name: "Mar", sales: 52000 },
  ],
  yearlySales: [
    { name: "2022", sales: 520000 },
    { name: "2023", sales: 580000 },
    { name: "2024", sales: 480000 },
  ],
};

function Dashboard() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week");

  const getTimeRangeData = () => {
    switch (timeRange) {
      case "week":
        return salesData.weeklySales;
      case "month":
        return salesData.monthlySales;
      case "year":
        return salesData.yearlySales;
      default:
        return salesData.weeklySales;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Today's Sales Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="ml-3 text-lg font-semibold text-slate-900">
                  Today's Sales
                </h3>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  salesData.percentageChange >= 0
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {salesData.percentageChange >= 0 ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(salesData.percentageChange)}%
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              ${salesData.today.toLocaleString()}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              vs. ${salesData.yesterday.toLocaleString()} yesterday
            </p>
          </div>

          {/* Customer Traffic Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-slate-900">
                Customer Traffic
              </h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">247</p>
            <p className="text-sm text-slate-500 mt-1">Total customers today</p>
          </div>

          {/* Top Products Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Coffee className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-slate-900">
                Top Products
              </h3>
            </div>
            <div className="space-y-3">
              {salesData.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-900">
                    {product.name}
                  </span>
                  <span className="text-sm text-slate-600">
                    {product.sales} sales
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sales Graph */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Sales Overview
            </h3>
            <button
              className="flex items-center px-4 py-2 bg-slate-50 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              onClick={() => {
                const next = {
                  week: "month",
                  month: "year",
                  year: "week",
                }[timeRange] as "week" | "month" | "year";
                setTimeRange(next);
              }}
            >
              {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}ly
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
          </div>

          {/* Recharts Bar Graph with Improvements */}
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={getTimeRangeData()} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: "#4a5568", fontSize: 12 }} />
              <YAxis tick={{ fill: "#4a5568", fontSize: 12 }} />
              <Tooltip cursor={{ fill: "#f1f5f9" }} />
              <Bar dataKey="sales" fill="#6366F1" radius={[10, 10, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
