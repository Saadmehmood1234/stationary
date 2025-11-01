'use client';

import { useState } from 'react';
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

const mockOrders: Order[] = [
  {
    _id: '1',
    orderNumber: 'ORD-001',
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1-555-0123'
    },
    items: [
      {
        productId: 'prod-1',
        name: 'Premium Gel Pen - ',
        sku: 'PEN-GEL--07',
        quantity: 2,
        price: 3.99,
        total: 7.98
      },
      {
        productId: 'prod-2',
        name: 'A5 Lined Notebook',
        sku: 'NB-A5-LIN-120',
        quantity: 1,
        price: 8.99,
        total: 8.99
      }
    ],
    subtotal: 16.97,
    tax: 1.44,
    total: 18.41,
    status: 'pending',
    paymentStatus: 'paid',
    collectionMethod: 'pickup',
    notes: 'Please pack carefully',
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T10:30:00')
  },
  {
    _id: '2',
    orderNumber: 'ORD-002',
    customer: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1-555-0124'
    },
    items: [
      {
        productId: 'prod-3',
        name: 'Art Marker Set - 12 Colors',
        sku: 'MARKER-ART-12SET',
        quantity: 1,
        price: 24.99,
        total: 24.99
      }
    ],
    subtotal: 24.99,
    tax: 2.12,
    total: 27.11,
    status: 'ready',
    paymentStatus: 'paid',
    collectionMethod: 'pickup',
    createdAt: new Date('2024-01-15T09:15:00'),
    updatedAt: new Date('2024-01-15T11:20:00')
  }
];

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = statusFilter === 'all' 
    ? mockOrders 
    : mockOrders.filter(order => order.status === statusFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'confirmed': return 'bg--500/20 text--300 border--500/30';
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
    { key: 'all', label: 'All Orders', color: 'from-[#D5D502] to-[#D5D506]' },
    { key: 'pending', label: 'Pending', color: 'from-[#D5D502] to-[#D5D506]' },
    { key: 'ready', label: 'Ready for Pickup', color: 'from-[#D5D502] to-[#D5D506]' },
    { key: 'completed', label: 'Completed', color: 'from-[#D5D502] to-[#D5D506]' },
  ];

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
          className="absolute w-72 h-72 bg--500 rounded-full blur-3xl opacity-10"
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-[#D5D502] to--200 bg-clip-text text-transparent">
              Orders
            </h1>
            <p className="text-gray-300 mt-2 text-lg">Manage customer orders</p>
          </div>
          <Button className="bg-gradient-to-r from-[#D5D502] to-[#D5D506] rounded-full cursor-pointer hover:from-[#c4c401] hover:to--600 text-gray-900 border-0">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
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
            <div className="h-1 bg-gradient-to-r from-[#D5D502] to--400"></div>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-3">
                {filterButtons.map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setStatusFilter(filter.key)}
                    className={`px-6 py-3 rounded-full transition-all cursor-pointer duration-300 font-medium ${
                      statusFilter === filter.key
                        ? `bg-gradient-to-r ${filter.color} text-gray-900 shadow-lg shadow-${filter.color.split('-')[1]}-500/25`
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                    }`}
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
            <div className="h-1 bg-gradient-to-r from--400 to-[#D5D502]"></div>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">
                Order Management
              </CardTitle>
              <CardDescription className="text-gray-300">
                {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-gray-400 text-xl mb-2">No orders found</div>
                  <p className="text-gray-500">No orders match your current filter criteria</p>
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
                      {filteredOrders.map((order, index) => (
                        <motion.tr
                          key={order._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
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
                            <div className="font-semibold text-white">₹{order.total.toFixed(2)}</div>
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
                                className="text-gray-400 hover:text--300 transition-colors duration-200 flex items-center gap-1"
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
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}