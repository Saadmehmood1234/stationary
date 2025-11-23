"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { Order } from "@/types";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  RefreshCw,
  Search,
  Filter,
  ArrowUpDown,
  BarChart3,
  TrendingUp,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  Calendar,
  Mail,
} from "lucide-react";
import {
  getOrders,
  updateOrderStatus,
  sendOrderConfirmation,
  getOrderAnalytics,
} from "@/app/actions/order.actions";
import { toast } from "react-hot-toast";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface OrderAnalytics {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  averageOrderValue: number;
  ordersByStatus: Record<string, number>;
  recentOrders: number;
  topProducts: Array<{ name: string; count: number }>;
}

type SortField =
  | "orderNumber"
  | "customer.name"
  | "total"
  | "status"
  | "createdAt"
  | "paymentStatus";
type SortDirection = "asc" | "desc";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<OrderAnalytics | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  const fetchOrders = async (
    page: number = 1,
    status: string = "all",
    payment: string = "all",
    search: string = ""
  ) => {
    setLoading(true);
    try {
      const result = await getOrders(
        page,
        10,
        status !== "all" ? status : undefined,
        payment !== "all" ? payment : undefined,
        search || undefined
      );

      if (result.success && result.data) {
        setOrders(result.data.orders);
        setPagination(result.data.pagination);
      } else {
        console.error("Failed to fetch orders:", result.message);
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const result = await getOrderAnalytics();
      if (result.success && result.data) {
        setAnalytics(result.data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, statusFilter, paymentFilter, searchTerm);
    fetchAnalytics();
  }, [currentPage, statusFilter, paymentFilter, searchTerm]);

  const handleRefresh = () => {
    fetchOrders(currentPage, statusFilter, paymentFilter, searchTerm);
    fetchAnalytics();
    toast.success("Data refreshed");
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingOrder(orderId);
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        toast.success("Order status updated");
        fetchOrders(currentPage, statusFilter, paymentFilter, searchTerm);
        fetchAnalytics();
      } else {
        toast.error(result.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Error updating order status");
    } finally {
      setUpdatingOrder(null);
    }
  };

  const handleSendConfirmation = async (orderId: string) => {
    try {
      const result = await sendOrderConfirmation(orderId);
      if (result.success) {
        toast.success("Confirmation email sent");
      } else {
        toast.error(result.message || "Failed to send confirmation email");
      }
    } catch (error) {
      console.error("Error sending confirmation email:", error);
      toast.error("Error sending confirmation email");
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setPaymentFilter("all");
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = [...orders];

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a;
      let bValue: any = b;

      // Handle nested field access
      if (sortField.includes(".")) {
        const fields = sortField.split(".");
        aValue = fields.reduce((obj:any, field) => obj[field], a);
        bValue = fields.reduce((obj:any, field) => obj[field], b);
      } else {
        aValue = a[sortField as keyof Order];
        bValue = b[sortField as keyof Order];
      }

      // Handle different data types
      if (sortField === "createdAt") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      } else if (sortField === "total") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [orders, sortField, sortDirection]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "confirmed":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "processing":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "ready":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "completed":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "failed":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "refunded":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // Simple bar chart for order status distribution
  const StatusBarChart = ({ analytics }: { analytics: OrderAnalytics }) => {
    const statusColors = {
      pending: "bg-yellow-500",
      confirmed: "bg-blue-500",
      processing: "bg-purple-500",
      ready: "bg-green-500",
      completed: "bg-gray-500",
      cancelled: "bg-red-500",
    };

    const maxCount = Math.max(...Object.values(analytics.ordersByStatus));

    return (
      <div className="space-y-2">
        {Object.entries(analytics.ordersByStatus).map(([status, count]) => (
          <div key={status} className="flex items-center space-x-3">
            <div className="w-20 text-sm text-gray-300 capitalize">
              {status}
            </div>
            <div className="flex-1">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  statusColors[status as keyof typeof statusColors] ||
                  "bg-gray-500"
                }`}
                style={{
                  width: `${(count / maxCount) * 100}%`,
                }}
              />
            </div>
            <div className="w-8 text-right text-sm text-white font-medium">
              {count}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 overflow-hidden p-6">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-64 h-64 bg-[#D5D502] rounded-full blur-3xl opacity-10"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ top: "10%", left: "5%" }}
        />
        <motion.div
          className="absolute w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-10"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ top: "60%", right: "10%" }}
        />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#D5D502] rounded-full opacity-40"
            animate={{
              y: [0, -60, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
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

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-[#D5D502] to-blue-200 bg-clip-text text-transparent">
              Orders Management
            </h1>
            <p className="text-gray-300 mt-2 text-lg">
              Manage and track all customer orders
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={loading}
            className="bg-gradient-to-r from-[#D5D502] to-yellow-500 rounded-full cursor-pointer hover:from-[#c4c401] hover:to-yellow-600 text-gray-900 border-0"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </motion.div>

        {/* Analytics Dashboard */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Orders */}
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
              <CardContent className="">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">
                      Total Orders
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {analytics.totalOrders}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {analytics.recentOrders} this week
                    </p>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-full">
                    <ShoppingCart className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Revenue */}
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
              <CardContent className="">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold text-[#D5D502]">
                      {formatCurrency(analytics.totalRevenue)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Avg: {formatCurrency(analytics.averageOrderValue)}
                    </p>
                  </div>
                  <div className="p-3 bg-green-500/20 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pending Orders */}
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
              <CardContent className="">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">
                      Pending Orders
                    </p>
                    <p className="text-2xl font-bold text-yellow-400">
                      {analytics.pendingOrders}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Need attention</p>
                  </div>
                  <div className="p-3 bg-yellow-500/20 rounded-full">
                    <Package className="h-6 w-6 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Completion Rate */}
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
              <CardContent className="">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">
                      Completion Rate
                    </p>
                    <p className="text-2xl font-bold text-green-400">
                      {(
                        (analytics.completedOrders / analytics.totalOrders) *
                        100
                      ).toFixed(1)}
                      %
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {analytics.completedOrders} completed
                    </p>
                  </div>
                  <div className="p-3 bg-green-500/20 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Highlights Section */}
        {analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Status Distribution */}
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                  Order Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StatusBarChart analytics={analytics} />
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-400" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orders
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    )
                    .slice(0, 3)
                    .map((order) => (
                      <div
                        key={order._id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <div className="text-white text-sm font-medium truncate">
                            {order.orderNumber}
                          </div>
                          <div className="text-xs text-gray-400">
                            {order.customer.name}
                          </div>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  Popular Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.topProducts.slice(0, 3).map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="text-white text-sm font-medium truncate">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {product.count} orders
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/20 p-6 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full lg:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 text-white placeholder-gray-400 rounded-full"
              />
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              {/* Status Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-white/20 cursor-pointer text-gray-300 bg-white/5 rounded-full hover:bg-white/10 hover:text-white"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Status: {statusFilter === "all" ? "All" : statusFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-800 border border-white/20">
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("all")}
                    className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                  >
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("pending")}
                    className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                  >
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("confirmed")}
                    className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                  >
                    Confirmed
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("processing")}
                    className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                  >
                    Processing
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("ready")}
                    className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                  >
                    Ready
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("completed")}
                    className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                  >
                    Completed
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Payment Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-white/20 cursor-pointer text-gray-300 bg-white/5 rounded-full hover:bg-white/10 hover:text-white"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Payment: {paymentFilter === "all" ? "All" : paymentFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-800 border border-white/20">
                  <DropdownMenuItem
                    onClick={() => setPaymentFilter("all")}
                    className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                  >
                    All Payments
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem
                    onClick={() => setPaymentFilter("paid")}
                    className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                  >
                    Paid
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setPaymentFilter("pending")}
                    className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                  >
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setPaymentFilter("failed")}
                    className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                  >
                    Failed
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setPaymentFilter("refunded")}
                    className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                  >
                    Refunded
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-white/20 cursor-pointer text-gray-300 bg-white/5 rounded-full hover:bg-white/10 hover:text-white"
                  >
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-800 border border-white/20">
                  <DropdownMenuItem
                    onClick={() => handleSort("createdAt")}
                    className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                  >
                    Date{" "}
                    {sortField === "createdAt" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSort("total")}
                    className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                  >
                    Amount{" "}
                    {sortField === "total" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSort("status")}
                    className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                  >
                    Status{" "}
                    {sortField === "status" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSort("orderNumber")}
                    className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                  >
                    Order #{" "}
                    {sortField === "orderNumber" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-400">
            Showing {filteredAndSortedOrders.length} of {orders.length} orders
            {(searchTerm ||
              statusFilter !== "all" ||
              paymentFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="ml-2 text-xs text-[#D5D502] hover:text-[#D5D502]/80 hover:bg-[#D5D502]/10"
              >
                Clear filters
              </Button>
            )}
          </div>
        </motion.div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-yellow-400 to-[#D5D502]"></div>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">
                Order Management
              </CardTitle>
              <CardDescription className="text-gray-300">
                {loading
                  ? "Loading orders..."
                  : `${filteredAndSortedOrders.length} order${
                      filteredAndSortedOrders.length !== 1 ? "s" : ""
                    } found`}
                {pagination &&
                  ` • Page ${pagination.currentPage} of ${pagination.totalPages}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="space-y-4 p-6">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-16 bg-white/10 rounded-xl animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-gray-400 text-xl mb-2">
                    No orders found
                  </div>
                  <p className="text-gray-500">
                    {statusFilter === "all"
                      ? "No orders have been placed yet."
                      : `No orders match the current filters.`}
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden">
                  <Table>
                    <TableHeader className="bg-white/5">
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-gray-300 font-semibold">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("orderNumber")}
                            className="p-0 hover:bg-transparent hover:text-gray-400 cursor-pointer text-gray-300 font-semibold"
                          >
                            Order
                            <ArrowUpDown className="h-4 w-4 ml-2" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-gray-300 font-semibold">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("customer.name")}
                            className="p-0 hover:bg-transparent hover:text-gray-400 cursor-pointer text-gray-300 font-semibold"
                          >
                            Customer
                            <ArrowUpDown className="h-4 w-4 ml-2" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-gray-300 font-semibold">
                          Items
                        </TableHead>
                        <TableHead className="text-gray-300 font-semibold">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("total")}
                            className="p-0 hover:bg-transparent hover:text-gray-400 cursor-pointer text-gray-300 font-semibold"
                          >
                            Total
                            <ArrowUpDown className="h-4 w-4 ml-2" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-gray-300 font-semibold">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("status")}
                            className="p-0 hover:bg-transparent hover:text-gray-400 cursor-pointer text-gray-300 font-semibold"
                          >
                            Status
                            <ArrowUpDown className="h-4 w-4 ml-2" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-gray-300 font-semibold">
                          Payment
                        </TableHead>
                        <TableHead className="text-gray-300 font-semibold">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("createdAt")}
                            className="p-0 hover:bg-transparent hover:text-gray-400 cursor-pointer text-gray-300 font-semibold"
                          >
                            Date
                            <ArrowUpDown className="h-4 w-4 ml-2" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-gray-300 font-semibold">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedOrders.map((order, index) => (
                        <motion.tr
                          key={order._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-white/10 hover:bg-white/5 transition-colors duration-200"
                        >
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium text-white">
                                {order.orderNumber}
                              </div>
                              <div className="text-sm text-gray-300 capitalize">
                                {order.collectionMethod}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium text-white">
                                {order.customer.name}
                              </div>
                              <div className="text-sm text-gray-300">
                                {order.customer.email}
                              </div>
                              <div className="text-xs text-gray-400">
                                {order.customer.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm text-white">
                                {order.items.length} item
                                {order.items.length !== 1 ? "s" : ""}
                              </div>
                              <div className="text-xs text-gray-300">
                                {order.items[0]?.name}
                                {order.items.length > 1 &&
                                  ` +${order.items.length - 1} more`}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-semibold text-white">
                              {formatCurrency(order.total)}
                            </div>
                            {order.paymentMethod === "razorpay" && (
                              <div className="text-xs text-[#D5D502]">
                                Razorpay
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={order.status}
                              onValueChange={(value) =>
                                handleStatusUpdate(order._id!, value)
                              }
                              disabled={updatingOrder === order._id}
                            >
                              <SelectTrigger
                                className={`w-32 cursor-pointer rounded-full border-white/20 text-white ${
                                  updatingOrder === order._id
                                    ? "opacity-50"
                                    : ""
                                }`}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 text-white border-white/20">
                                <SelectItem
                                  value="pending"
                                  className="rounded-full focus:bg-gradient-to-l focus:from-[#EDB600] focus:to-[#D9D000] cursor-pointer"
                                >
                                  Pending
                                </SelectItem>
                                <SelectItem
                                  value="confirmed"
                                  className="rounded-full focus:bg-gradient-to-l focus:from-[#EDB600] focus:to-[#D9D000] cursor-pointer"
                                >
                                  Confirmed
                                </SelectItem>
                                <SelectItem
                                  value="processing"
                                  className="rounded-full focus:bg-gradient-to-l focus:from-[#EDB600] focus:to-[#D9D000] cursor-pointer"
                                >
                                  Processing
                                </SelectItem>
                                <SelectItem
                                  value="ready"
                                  className="rounded-full focus:bg-gradient-to-l focus:from-[#EDB600] focus:to-[#D9D000] cursor-pointer"
                                >
                                  Ready
                                </SelectItem>
                                <SelectItem
                                  value="completed"
                                  className="rounded-full focus:bg-gradient-to-l focus:from-[#EDB600] focus:to-[#D9D000] cursor-pointer"
                                >
                                  Completed
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getPaymentStatusColor(
                                order.paymentStatus
                              )}
                            >
                              {order.paymentStatus.charAt(0).toUpperCase() +
                                order.paymentStatus.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm text-white">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-gray-300">
                                {new Date(order.createdAt).toLocaleTimeString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-3">
                              <Link
                                href={`/admin/orders/${order._id}`}
                                className="text-gray-400 hover:text-blue-300 transition-colors duration-200 flex items-center gap-1"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </Link>
                              <button
                                onClick={() =>
                                  handleSendConfirmation(order._id!)
                                }
                                className="text-[#D5D502] cursor-pointer hover:text-yellow-300 transition-colors duration-200 flex items-center gap-1"
                              >
                                <Mail className="h-4 w-4" />
                                Email
                              </button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-between items-center p-6 border-t border-white/10">
                  <div className="text-sm text-gray-400">
                    Showing {orders.length} of {pagination.totalOrders} orders
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage || loading}
                      className="border-white/20 text-white hover:bg-white/10 rounded-full"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage || loading}
                      className="border-white/20 text-white hover:bg-white/10 rounded-full"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
