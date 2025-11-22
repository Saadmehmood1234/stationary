'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Order } from '@/types';
import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, RefreshCw } from 'lucide-react';
import { getOrders } from '@/app/actions/order.actions';

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchOrders = async (page: number = 1, status: string = 'all') => {
    setLoading(true);
    try {
      const result = await getOrders(page, 10, status !== 'all' ? status : undefined);
      
      if (result.success && result.data) {
        setOrders(result.data.orders);
        setPagination(result.data.pagination);
      } else {
        console.error('Failed to fetch orders:', result.message);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, statusFilter);
  }, [currentPage, statusFilter]);

  const handleRefresh = () => {
    fetchOrders(currentPage, statusFilter);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'confirmed': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'ready': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'completed': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'failed': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const filterButtons = [
    { key: 'all', label: 'All Orders', color: 'from-[#D5D502] to-yellow-500' },
    { key: 'pending', label: 'Pending', color: 'from-[#D5D502] to-yellow-500' },
    { key: 'confirmed', label: 'Confirmed', color: 'from-[#D5D502] to-yellow-500' },
    { key: 'ready', label: 'Ready for Pickup', color: 'from-[#D5D502] to-yellow-500' },
    { key: 'completed', label: 'Completed', color: 'from-[#D5D502] to-yellow-500' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
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
              Orders
            </h1>
            <p className="text-gray-300 mt-2 text-lg">Manage customer orders</p>
          </div>
          <Button 
            onClick={handleRefresh}
            disabled={loading}
            className="bg-gradient-to-r from-[#D5D502] to-yellow-500 rounded-full cursor-pointer hover:from-[#c4c401] hover:to-yellow-600 text-gray-900 border-0"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#D5D502] to-yellow-400"></div>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-3">
                {filterButtons.map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => handleStatusFilterChange(filter.key)}
                    disabled={loading}
                    className={`px-6 py-3 rounded-full transition-all cursor-pointer duration-300 font-medium ${
                      statusFilter === filter.key
                        ? `bg-gradient-to-r ${filter.color} text-gray-900 shadow-lg shadow-yellow-500/25`
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
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
                {loading ? 'Loading orders...' : `${orders.length} order${orders.length !== 1 ? 's' : ''} found`}
                {pagination && ` • Page ${pagination.currentPage} of ${pagination.totalPages}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="space-y-4 p-6">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-white/10 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-gray-400 text-xl mb-2">No orders found</div>
                  <p className="text-gray-500">
                    {statusFilter === 'all' 
                      ? 'No orders have been placed yet.' 
                      : `No orders match the "${statusFilter}" status.`
                    }
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden">
                  <Table>
                    <TableHeader className="bg-white/5">
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-gray-300 font-semibold">Order</TableHead>
                        <TableHead className="text-gray-300 font-semibold">Customer</TableHead>
                        <TableHead className="text-gray-300 font-semibold">Items</TableHead>
                        <TableHead className="text-gray-300 font-semibold">Total</TableHead>
                        <TableHead className="text-gray-300 font-semibold">Status</TableHead>
                        <TableHead className="text-gray-300 font-semibold">Payment</TableHead>
                        <TableHead className="text-gray-300 font-semibold">Date</TableHead>
                        <TableHead className="text-gray-300 font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order, index) => (
                        <motion.tr
                          key={order._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-white/10 hover:bg-white/5 transition-colors duration-200"
                        >
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium text-white">{order.orderNumber}</div>
                              <div className="text-sm text-gray-300 capitalize">
                                {order.collectionMethod}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium text-white">{order.customer.name}</div>
                              <div className="text-sm text-gray-300">{order.customer.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm text-white">
                                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                              </div>
                              <div className="text-xs text-gray-300">
                                {order.items[0]?.name}
                                {order.items.length > 1 && ` +${order.items.length - 1} more`}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-semibold text-white">
                              {formatCurrency(order.total)}
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
                            <Badge 
                              variant="outline" 
                              className={getPaymentStatusColor(order.paymentStatus)}
                            >
                              {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
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
                                <Eye className="h-4 w-4 text-gray-200" />
                                View
                              </Link>
                              <button className="text-[#D5D502] cursor-pointer hover:text-yellow-300 transition-colors duration-200">
                                Update
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