'use client';

import { useEffect, useState, useMemo } from 'react';
import { getPrintOrders, updatePrintOrderStatus } from '@/app/actions/print.actions';
import { PrintOrder } from '@/types';
import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Filter,
  ArrowUpDown,
  Loader2,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function PrintOrdersAdmin() {
  const [orders, setOrders] = useState<PrintOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof PrintOrder>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const result = await getPrintOrders();
    if (result.success) {
      setOrders(result.data);
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    const result = await updatePrintOrderStatus(orderId, newStatus);
    if (result.success) {
      toast.success("Status Updated Successfully!")
      loadOrders();
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      confirmed: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      printing: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      completed: 'bg-green-500/20 text-green-300 border-green-500/30',
      cancelled: 'bg-red-500/20 text-red-300 border-red-500/30'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const getUrgencyColor = (urgency: string) => {
    const colors = {
      express: 'text-red-300',
      urgent: 'text-yellow-300', 
      normal: 'text-green-300'
    };
    return colors[urgency as keyof typeof colors] || 'text-gray-300';
  };

  const getUrgencyLabel = (urgency: string) => {
    const labels = {
      express: 'Express',
      urgent: 'Urgent',
      normal: 'Normal'
    };
    return labels[urgency as keyof typeof labels] || urgency;
  };

  // Analytics calculations
  const analytics = useMemo(() => {
    if (!orders.length) return null;

    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter(order => order.status === 'completed' && order.finalCost)
      .reduce((sum, order) => sum + (order.finalCost || order.estimatedCost), 0);
    
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const completedOrders = orders.filter(order => order.status === 'completed').length;
    const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;

    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const urgencyCounts = orders.reduce((acc, order) => {
      acc[order.urgency] = (acc[order.urgency] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageCost = orders.reduce((sum, order) => sum + order.estimatedCost, 0) / totalOrders;

    // Most urgent orders (express priority)
    const expressOrders = orders.filter(order => order.urgency === 'express').length;

    // Recent orders (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentOrders = orders.filter(order => new Date(order.createdAt) > oneWeekAgo).length;

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      statusCounts,
      urgencyCounts,
      averageCost,
      expressOrders,
      recentOrders,
    };
  }, [orders]);

  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders.filter((order) => {
      // Search filter
      const matchesSearch = 
        order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.specialInstructions?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      // Urgency filter
      const matchesUrgency = urgencyFilter === 'all' || order.urgency === urgencyFilter;

      return matchesSearch && matchesStatus && matchesUrgency;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Handle different data types
      if (sortField === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [orders, searchTerm, statusFilter, urgencyFilter, sortField, sortDirection]);

  const handleSort = (field: keyof PrintOrder) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Simple bar chart for order status distribution
  const StatusBarChart = ({ orders }: { orders: PrintOrder[] }) => {
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const maxCount = Math.max(...Object.values(statusCounts));
    const statusColors = {
      pending: 'bg-yellow-500',
      confirmed: 'bg-blue-500',
      printing: 'bg-purple-500',
      completed: 'bg-green-500',
      cancelled: 'bg-red-500',
    };

    return (
      <div className="space-y-2">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="flex items-center space-x-3">
            <div className="w-20 text-sm text-gray-300 capitalize">
              {status}
            </div>
            <div className="flex-1">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  statusColors[status as keyof typeof statusColors] || 'bg-gray-500'
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

  if (loading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 flex justify-center items-center">
        <div className="flex items-center gap-3 text-white">
          <RefreshCw className="h-12 w-12 animate-spin text-[#D5D502] mx-auto mb-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 overflow-hidden p-6">
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-[#D5D502] to-blue-200 bg-clip-text text-transparent mb-2">
            Print Orders Management
          </h1>
          <p className="text-gray-300 text-lg">
            Manage and track all print service orders
          </p>
        </motion.div>

        {/* Analytics Dashboard */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Orders */}
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
              <CardContent className="">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Total Orders</p>
                    <p className="text-2xl font-bold text-white">{analytics.totalOrders}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {analytics.recentOrders} this week
                    </p>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-full">
                    <Package className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Revenue */}
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
              <CardContent className="">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Total Revenue</p>
                    <p className="text-2xl font-bold text-[#D5D502]">
                      ₹{analytics.totalRevenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Avg: ₹{analytics.averageCost.toFixed(0)}
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
                    <p className="text-sm font-medium text-gray-400">Pending Orders</p>
                    <p className="text-2xl font-bold text-yellow-400">{analytics.pendingOrders}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {analytics.expressOrders} express
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-500/20 rounded-full">
                    <Clock className="h-6 w-6 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Completion Rate */}
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
              <CardContent className="">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Completion Rate</p>
                    <p className="text-2xl font-bold text-green-400">
                      {((analytics.completedOrders / analytics.totalOrders) * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {analytics.completedOrders} completed
                    </p>
                  </div>
                  <div className="p-3 bg-green-500/20 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-400" />
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
                <StatusBarChart orders={orders} />
              </CardContent>
            </Card>

            {/* Express Orders */}
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  Express Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orders.filter(order => order.urgency === 'express' && order.status !== 'completed' && order.status !== 'cancelled').length > 0 ? (
                  <div className="space-y-3">
                    {orders
                      .filter(order => order.urgency === 'express' && order.status !== 'completed' && order.status !== 'cancelled')
                      .slice(0, 3)
                      .map(order => (
                        <div key={order._id} className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                          <div>
                            <div className="text-white font-medium truncate">
                              {order.name}
                            </div>
                            <div className="text-sm text-red-300">
                              {order.pageCount} pages • {getUrgencyLabel(order.urgency)}
                            </div>
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-4">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-400" />
                    No express orders pending
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orders
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 3)
                    .map(order => (
                      <div key={order._id} className="flex items-center justify-between">
                        <div>
                          <div className="text-white text-sm font-medium truncate">
                            {order.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString()}
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
          </div>
        )}

        {/* Search and Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
                    Status: {statusFilter === 'all' ? 'All' : statusFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-800 border border-white/20">
                  <DropdownMenuItem
                    onClick={() => setStatusFilter('all')}
                    className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                  >
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem
                    onClick={() => setStatusFilter('pending')}
                    className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                  >
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter('confirmed')}
                    className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                  >
                    Confirmed
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter('printing')}
                    className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                  >
                    Printing
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter('completed')}
                    className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                  >
                    Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter('cancelled')}
                    className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                  >
                    Cancelled
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Urgency Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-white/20 cursor-pointer text-gray-300 bg-white/5 rounded-full hover:bg-white/10 hover:text-white"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Urgency: {urgencyFilter === 'all' ? 'All' : getUrgencyLabel(urgencyFilter)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-800 border border-white/20">
                  <DropdownMenuItem
                    onClick={() => setUrgencyFilter('all')}
                    className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                  >
                    All Urgency
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem
                    onClick={() => setUrgencyFilter('normal')}
                    className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                  >
                    Normal
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setUrgencyFilter('urgent')}
                    className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                  >
                    Urgent
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setUrgencyFilter('express')}
                    className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                  >
                    Express
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
                    onClick={() => handleSort('createdAt')}
                    className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                  >
                    Date {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSort('estimatedCost')}
                    className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                  >
                    Cost {sortField === 'estimatedCost' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSort('pageCount')}
                    className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                  >
                    Pages {sortField === 'pageCount' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSort('urgency')}
                    className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                  >
                    Urgency {sortField === 'urgency' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSort('name')}
                    className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                  >
                    Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-400">
            Showing {filteredAndSortedOrders.length} of {orders.length} orders
            {(searchTerm || statusFilter !== 'all' || urgencyFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setUrgencyFilter('all');
                }}
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
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#D5D502] to-yellow-400"></div>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">
                Print Orders
              </CardTitle>
              <CardDescription className="text-gray-300">
                {filteredAndSortedOrders.length} order{filteredAndSortedOrders.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {filteredAndSortedOrders.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-gray-400 text-xl mb-2">No print orders found</div>
                  <p className="text-gray-500">
                    {orders.length === 0 
                      ? "Print orders will appear here when customers submit requests"
                      : "Try adjusting your search or filters"
                    }
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
                            onClick={() => handleSort('name')}
                            className="p-0 hover:bg-transparent hover:text-gray-400 cursor-pointer text-gray-300 font-semibold"
                          >
                            Order Details
                            <ArrowUpDown className="h-4 w-4 ml-2" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-gray-300 font-semibold">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort('pageCount')}
                            className="p-0 hover:bg-transparent hover:text-gray-400 cursor-pointer text-gray-300 font-semibold"
                          >
                            Specifications
                            <ArrowUpDown className="h-4 w-4 ml-2" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-gray-300 font-semibold">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort('estimatedCost')}
                            className="p-0 hover:bg-transparent hover:text-gray-400 cursor-pointer text-gray-300 font-semibold"
                          >
                            Cost
                            <ArrowUpDown className="h-4 w-4 ml-2" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-gray-300 font-semibold">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort('status')}
                            className="p-0 hover:bg-transparent hover:text-gray-400 cursor-pointer text-gray-300 font-semibold"
                          >
                            Status
                            <ArrowUpDown className="h-4 w-4 ml-2" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-gray-300 font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedOrders.map((order, index) => (
                        <motion.tr
                          key={order._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-white/10 hover:bg-white/5 transition-colors duration-200"
                        >
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium text-white">{order.name}</div>
                              <div className="text-sm text-gray-300">{order.email}</div>
                              <div className="text-sm text-gray-300">{order.phone}</div>
                              <div className="text-xs text-gray-400">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm text-white">
                                {order.paperSize} • {order.colorType === 'color' ? 'Color' : 'B&W'}
                              </div>
                              <div className="text-sm text-gray-300">
                                {order.pageCount} pages • {order.binding !== 'none' ? order.binding : 'No binding'}
                              </div>
                              <div className="text-sm text-gray-300">
                                <span className={`inline-flex items-center ${getUrgencyColor(order.urgency)}`}>
                                  <Clock className="h-3 w-3 mr-1" />
                                  {getUrgencyLabel(order.urgency)}
                                </span>
                              </div>
                              {order.specialInstructions && (
                                <div className="text-xs text-gray-400 mt-1 max-w-xs">
                                  {order.specialInstructions}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium text-white">
                                ₹{order.estimatedCost}
                              </div>
                              {order.finalCost && (
                                <div className="text-sm text-green-300">
                                  Final: ₹{order.finalCost}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={getStatusColor(order.status)}
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={order.status}
                              onValueChange={(value) => handleStatusUpdate(order._id!, value)}
                            >
                              <SelectTrigger className="bg-white/10 cursor-pointer rounded-full border-white/20 text-white w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 text-white border-white/20">
                                <SelectItem value="pending" className="rounded-full focus:bg-gradient-to-l focus:from-[#EDB600] focus:to-[#D9D000] cursor-pointer">Pending</SelectItem>
                                <SelectItem value="confirmed" className="rounded-full focus:bg-gradient-to-l focus:from-[#EDB600] focus:to-[#D9D000] cursor-pointer">Confirmed</SelectItem>
                                <SelectItem value="printing" className="rounded-full focus:bg-gradient-to-l focus:from-[#EDB600] focus:to-[#D9D000] cursor-pointer">Printing</SelectItem>
                                <SelectItem value="completed" className="rounded-full focus:bg-gradient-to-l focus:from-[#EDB600] focus:to-[#D9D000] cursor-pointer">Completed</SelectItem>
                                <SelectItem value="cancelled" className="rounded-full focus:bg-gradient-to-l focus:from-[#EDB600] focus:to-[#D9D000] cursor-pointer">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}