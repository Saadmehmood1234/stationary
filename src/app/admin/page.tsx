"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Clock,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Plus,
  FileText,
  Layers,
  Users,
  Printer,
  Image,
  BookOpen,
  Zap,
  ShoppingCart,
  BarChart3,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { getOrderAnalytics } from "@/app/actions/order.actions";
import { getProductAnalytics } from "@/app/actions/product.actions";
import { getPrintAnalytics } from "@/app/actions/print.actions";

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalProducts: number;
  lowStockProducts: number;
  recentOrders: any[];
  popularProducts: any[];
  printStats: {
    totalPrintRequests: number;
    pendingPrintRequests: number;
    blackWhiteCount: number;
    colorCount: number;
    bindingCount: number;
    laminationCount: number;
    photoCount: number;
    dailyPrintStats: any[];
  };
  revenueData: {
    daily: any[];
    weekly: any[];
    monthly: any[];
    yearly: any[];
  };
  orderTrends: {
    daily: any[];
    weekly: any[];
    monthly: any[];
    yearly: any[];
  };
  stockData: any[];
}
const BarChart = ({
  data,
  color = "#D5D502",
}: {
  data: any[];
  color?: string;
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-end justify-between h-32 space-x-1">
        <div className="flex flex-col items-center flex-1">
          <span className="text-xs text-gray-400 mt-1">No data</span>
        </div>
      </div>
    );
  }

  const safeData = data.map((item) => ({
    ...item,
    value: item.value || 0,
  }));

  const maxValue = Math.max(...safeData.map((item) => item.value));

  return (
    <div className="flex items-end justify-between h-32 space-x-1">
      {safeData.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div
            className="w-full rounded-t transition-all duration-500"
            style={{
              height: `${(item.value / maxValue) * 100}%`,
              backgroundColor: color,
              opacity: 0.7,
            }}
          />
          <span className="text-xs text-gray-400 mt-1">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

const LineChart = ({
  data,
  color = "#D5D502",
}: {
  data: any[];
  color?: string;
}) => {
  // Add safety checks for empty data
  if (!data || data.length === 0) {
    return (
      <div className="relative h-32 flex items-center justify-center">
        <span className="text-gray-400 text-sm">No data available</span>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((item) => item.value || 0));

  // Ensure we have valid values
  const safeData = data.map((item) => ({
    ...item,
    value: item.value || 0,
  }));

  return (
    <div className="relative h-32">
      <svg width="100%" height="100%" className="overflow-visible">
        <path
          d={`M 0,${100 - (safeData[0].value / maxValue) * 100} ${safeData
            .map(
              (item, i) =>
                `L ${(i / (safeData.length - 1)) * 100},${
                  100 - (item.value / maxValue) * 100
                }`
            )
            .join(" ")}`}
          stroke={color}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {safeData.map((item, i) => (
          <circle
            key={i}
            cx={`${(i / (safeData.length - 1)) * 100}%`}
            cy={`${100 - (item.value / maxValue) * 100}%`}
            r="3"
            fill={color}
          />
        ))}
      </svg>
    </div>
  );
};
export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    recentOrders: [],
    popularProducts: [],
    printStats: {
      totalPrintRequests: 0,
      pendingPrintRequests: 0,
      blackWhiteCount: 0,
      colorCount: 0,
      bindingCount: 0,
      laminationCount: 0,
      photoCount: 0,
      dailyPrintStats: [],
    },
    revenueData: {
      daily: [],
      weekly: [],
      monthly: [],
      yearly: [],
    },
    orderTrends: {
      daily: [],
      weekly: [],
      monthly: [],
      yearly: [],
    },
    stockData: [],
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("weekly");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [orderAnalytics, productAnalytics, printAnalytics] =
        await Promise.all([
          getOrderAnalytics(),
          getProductAnalytics(),
          getPrintAnalytics(),
        ]);

      if (
        orderAnalytics.success &&
        productAnalytics.success &&
        printAnalytics.success
      ) {
        setStats({
          totalOrders: orderAnalytics.data?.totalOrders || 0,
          pendingOrders: orderAnalytics.data?.pendingOrders || 0,
          totalRevenue: orderAnalytics.data?.totalRevenue || 0,
          totalProducts: productAnalytics.data?.totalProducts || 0,
          lowStockProducts: productAnalytics.data?.lowStockProducts || 0,
          recentOrders: orderAnalytics.data?.recentOrdersData || [],
          popularProducts: productAnalytics.data?.popularProducts || [],
          printStats: {
            totalPrintRequests: printAnalytics.data?.totalPrintRequests || 0,
            pendingPrintRequests:
              printAnalytics.data?.pendingPrintRequests || 0,
            blackWhiteCount: printAnalytics.data?.blackWhiteCount || 0,
            colorCount: printAnalytics.data?.colorCount || 0,
            bindingCount: printAnalytics.data?.bindingCount || 0,
            laminationCount: printAnalytics.data?.laminationCount || 0,
            photoCount: printAnalytics.data?.photoCount || 0,
            dailyPrintStats: printAnalytics.data?.dailyPrintStats || [],
          },
          revenueData: orderAnalytics.data?.revenueData || {
            daily: [],
            weekly: [],
            monthly: [],
            yearly: [],
          },
          orderTrends: orderAnalytics.data?.orderTrends || {
            daily: [],
            weekly: [],
            monthly: [],
            yearly: [],
          },
          stockData: productAnalytics.data?.stockData || [],
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "ready":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "processing":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "confirmed":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-64 h-64 bg-[#D5D502] rounded-full blur-3xl opacity-10"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ top: "30%", left: "10%" }}
          />
          <motion.div
            className="absolute w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-10"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ top: "60%", right: "15%" }}
          />
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#D5D502] rounded-full opacity-40"
              animate={{
                y: [0, -100, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-center min-h-screen relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Animated Icon Container */}
            <motion.div
              className="relative mb-8"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-[#D5D502]/20 to-[#c4c400]/10 rounded-full border border-[#D5D502]/30 flex items-center justify-center mx-auto shadow-2xl shadow-[#D5D502]/10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <RefreshCw className="h-10 w-10 text-[#D5D502]" />
                </motion.div>
              </div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-[#D5D502] bg-clip-text text-transparent mb-4">
                Loading Dashboard
              </h2>
              <p className="text-gray-400 text-lg mb-6 max-w-md">
                Preparing your analytics and insights...
              </p>

              {/* Progress Bar */}
              <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden mx-auto">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#D5D502] to-[#c4c400]"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>

              {/* Loading Dots */}
              <div className="flex justify-center space-x-2 mt-6">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className="w-2 h-2 bg-[#D5D502] rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-[#D5D502] bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-400 mt-3 text-lg">
            Real-time overview of your stationery store
          </p>
        </motion.div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-[#D5D502]/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-white">
                  {stats.totalOrders}
                </p>
                <p className="text-xs text-gray-400 mt-1">All time orders</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-full border border-blue-500/30">
                <ShoppingCart className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </motion.div>

          {/* Pending Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-yellow-500/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Pending Orders
                </p>
                <p className="text-2xl font-bold text-white">
                  {stats.pendingOrders}
                </p>
                <p className="text-xs text-gray-400 mt-1">Need attention</p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-full border border-yellow-500/30">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </motion.div>

          {/* Total Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-green-500/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(stats.totalRevenue)}
                </p>
                <p className="text-xs text-gray-400 mt-1">Lifetime earnings</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-full border border-green-500/30">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </motion.div>

          {/* Low Stock */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-red-500/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Low Stock</p>
                <p className="text-2xl font-bold text-white">
                  {stats.lowStockProducts}
                </p>
                <p className="text-xs text-gray-400 mt-1">Need restocking</p>
              </div>
              <div className="p-3 bg-red-500/20 rounded-full border border-red-500/30">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Order Trends Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/20 p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Order Trends</h2>
              <div className="flex max-md:flex-col max-md:gap-4  space-x-2">
                {(["daily", "weekly", "monthly", "yearly"] as const).map(
                  (range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1 cursor-pointer rounded-full text-xs font-medium transition-colors ${
                        timeRange === range
                          ? "bg-[#D5D502] text-gray-900"
                          : "bg-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      {range.charAt(0).toUpperCase() + range.slice(1)}
                    </button>
                  )
                )}
              </div>
            </div>
            <LineChart
              data={stats.orderTrends[timeRange] || []}
              color="#D5D502"
            />
          </motion.div>

          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/20 p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">
                Revenue Trend
              </h2>
              <div className="text-[#D5D502] font-bold">
                {formatCurrency(
                  stats.revenueData[timeRange]?.reduce(
                    (sum: number, item: any) => sum + item.value,
                    0
                  ) || 0
                )}
              </div>
            </div>
            <BarChart
              data={stats.revenueData[timeRange] || []}
              color="#10B981"
            />
          </motion.div>
        </div>

        {/* Second Row - Products and Printing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Stock Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/20"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Stock Overview
                </h2>
                <Link
                  href="/admin/products"
                  className="text-[#D5D502] hover:text-yellow-400 text-sm transition-colors"
                >
                  Manage Stock
                </Link>
              </div>
              <div className="space-y-3">
                {stats.stockData.slice(0, 5).map((product, index) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          product.stock === 0
                            ? "bg-red-500"
                            : product.stock <= 10
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      />
                      <span className="font-medium text-white text-sm">
                        {product.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-sm font-medium ${
                          product.stock === 0
                            ? "text-red-400"
                            : product.stock <= 10
                            ? "text-yellow-400"
                            : "text-green-400"
                        }`}
                      >
                        {product.stock} in stock
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Printing Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/20"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Printing Services
                </h2>
                <Link
                  href="/admin/print-orders"
                  className="text-[#D5D502] hover:text-yellow-400 text-sm transition-colors"
                >
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <Printer className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">
                    {stats.printStats.totalPrintRequests}
                  </p>
                  <p className="text-gray-400 text-sm">Total Prints</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">
                    {stats.printStats.pendingPrintRequests}
                  </p>
                  <p className="text-gray-400 text-sm">Pending</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">
                    {stats.printStats.blackWhiteCount}
                  </p>
                  <p className="text-gray-400 text-sm">B&W Prints</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <Image className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">
                    {stats.printStats.colorCount}
                  </p>
                  <p className="text-gray-400 text-sm">Color Prints</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Third Row - Recent Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/20"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Recent Orders
                </h2>
                <Link
                  href="/admin/orders"
                  className="text-[#D5D502] hover:text-yellow-400 text-sm transition-colors"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {stats.recentOrders.slice(0, 5).map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0"
                  >
                    <div>
                      <p className="font-medium text-white">
                        {order.orderNumber}
                      </p>
                      <p className="text-sm text-gray-400">
                        {order.customer?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">
                        {formatCurrency(order.total)}
                      </p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Popular Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/20"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Popular Products
                </h2>
                <Link
                  href="/admin/products"
                  className="text-[#D5D502] hover:text-yellow-400 text-sm transition-colors"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {stats.popularProducts.slice(0, 5).map((product, index) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0"
                  >
                    <div className="flex items-center">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mr-3 ${
                          index === 0
                            ? "bg-gradient-to-r from-yellow-500 to-[#D5D502] text-white"
                            : index === 1
                            ? "bg-gray-500 text-white"
                            : "bg-gray-600 text-white"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="font-medium text-white">
                        {product.name}
                      </span>
                    </div>
                    <span className="text-gray-400">
                      {product.sales || 0} sales
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/20"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/admin/products/create"
                className="p-6 border-2 border-dashed border-white/20 rounded-xl text-center hover:border-[#D5D502] hover:bg-[#D5D502]/10 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-[#D5D502] rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <p className="font-medium text-white">Add Product</p>
                <p className="text-sm text-gray-400">Create new product</p>
              </Link>

              <Link
                href="/admin/orders"
                className="p-6 border-2 border-dashed border-white/20 rounded-xl text-center hover:border-green-500 hover:bg-green-500/10 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <p className="font-medium text-white">Manage Orders</p>
                <p className="text-sm text-gray-400">View all orders</p>
              </Link>

              <Link
                href="/admin/print-orders"
                className="p-6 border-2 border-dashed border-white/20 rounded-xl text-center hover:border-purple-500 hover:bg-purple-500/10 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Printer className="w-6 h-6 text-white" />
                </div>
                <p className="font-medium text-white">Print Requests</p>
                <p className="text-sm text-gray-400">Manage printing</p>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
