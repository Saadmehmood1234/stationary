"use client";

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Printer, RefreshCw } from 'lucide-react';

const mockOrder = {
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
      name: 'Premium Gel Pen - Blue',
      sku: 'PEN-GEL-BLUE-07',
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
  notes: 'Please pack carefully. Customer prefers blue ink pens.',
  createdAt: new Date('2024-01-15T10:30:00'),
  updatedAt: new Date('2024-01-15T10:30:00')
};

export default function OrderDetailPage() {
  const order = mockOrder;

  if (!order) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'confirmed': return 'bg-[#D5D502]/20 text-[#D5D502] border-[#D5D502]/30';
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
          className="absolute w-72 h-72 bg-[#D5D502] rounded-full blur-3xl opacity-10"
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
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4"
        >
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <Link
                href="/admin/orders"
                className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Orders
              </Link>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-[#D5D502] to-blue-200 bg-clip-text text-transparent">
                {order.orderNumber}
              </h1>
              <p className="text-gray-300 mt-2 text-lg">
                Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                {new Date(order.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              variant="outline"
              className="border-white/20 text-white hover:text-white cursor-pointer hover:bg-gray-800/10 rounded-full bg-gray-800"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button className="bg-gradient-to-r from-[#D5D502] to-[#D5D502] hover:from-[#c4c401] hover:to-[#D5D502]/90 text-gray-900 cursor-pointer border-0 rounded-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Update Status
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-[#D5D502] to-[#D5D502]/70"></div>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white">Order Items</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="flex items-center justify-between py-4 border-b border-white/10 last:border-b-0"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-white text-lg">{item.name}</p>
                          <p className="text-sm text-gray-400">SKU: {item.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400">Qty: {item.quantity}</p>
                          <p className="font-semibold text-white text-lg">₹{item.total.toFixed(2)}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {order.notes && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-[#D5D502]/80 to-[#D5D502]"></div>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-white">Order Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-gray-300 leading-relaxed">{order.notes}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
          <div className="space-y-6">
            {/* Order Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-[#D5D502] to-[#D5D502]/90"></div>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white">Order Status</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Status:</span>
                      <Badge 
                        variant="outline" 
                        className={getStatusColor(order.status)}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Payment:</span>
                      <Badge 
                        variant="outline" 
                        className={getPaymentStatusColor(order.paymentStatus)}
                      >
                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Collection:</span>
                      <span className="font-medium text-white capitalize">{order.collectionMethod}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-[#D5D502]/90 to-[#D5D502]"></div>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white">Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-sm">Name</p>
                      <p className="text-white font-medium">{order.customer.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Email</p>
                      <p className="text-white font-medium">{order.customer.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Phone</p>
                      <p className="text-white font-medium">{order.customer.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-[#D5D502] to-[#D5D502]/80"></div>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white">Order Total</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Subtotal:</span>
                      <span className="text-white">₹{order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Tax:</span>
                      <span className="text-white">₹{order.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t border-white/10 pt-3">
                      <span className="text-white">Total:</span>
                      <span className="text-[#D5D502]">₹{order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}