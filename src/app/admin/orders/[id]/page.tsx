'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Printer, RefreshCw } from 'lucide-react';
import { Order } from '@/types';
import { getOrderById } from '@/app/actions/order.actions';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getOrderById(orderId);
      
      if (result.success && result.data) {
        setOrder(result.data);
      } else {
        setError(result.message || 'Failed to load order');
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleRefresh = () => {
    fetchOrder();
  };

  const handlePrint = () => {
    window.print();
  };

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 overflow-hidden p-6">
        <div className="relative max-w-7xl mx-auto">
          <div className="flex justify-center items-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D5D502] mx-auto mb-4"></div>
              <p className="text-gray-300">Loading order details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 overflow-hidden p-6">
        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-96 text-center">
            <div className="text-red-400 text-xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-2">Order Not Found</h2>
            <p className="text-gray-300 mb-6">{error || 'The order you are looking for does not exist.'}</p>
            <Link
              href="/admin/orders"
              className="bg-gradient-to-r from-[#D5D502] to-yellow-500 hover:from-[#c4c401] hover:to-yellow-600 text-gray-900 px-6 py-3 rounded-full font-medium transition-all duration-200"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
              <p className="text-gray-400 text-sm mt-1">
                Last updated: {new Date(order.updatedAt).toLocaleDateString()} at{' '}
                {new Date(order.updatedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              variant="outline"
              onClick={handlePrint}
              className="border-white/20 text-white hover:text-white cursor-pointer hover:bg-gray-800/10 rounded-full bg-gray-800"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button 
              onClick={handleRefresh}
              disabled={loading}
              className="bg-gradient-to-r from-[#D5D502] to-yellow-500 hover:from-[#c4c401] hover:to-yellow-600 text-gray-900 cursor-pointer border-0 rounded-full"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh'}
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
                  <CardDescription className="text-gray-300">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''} in this order
                  </CardDescription>
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
                          <p className="text-sm text-gray-400">Price: {formatCurrency(item.price)} each</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400">Qty: {item.quantity}</p>
                          <p className="font-semibold text-white text-lg">{formatCurrency(item.total)}</p>
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

            {/* Customer Information Card */}
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
                      <a 
                        href={`mailto:${order.customer.email}`}
                        className="text-[#D5D502] font-medium hover:text-[#D5D502]/70 transition-colors"
                      >
                        {order.customer.email}
                      </a>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Phone</p>
                      <a 
                        href={`tel:${order.customer.phone}`}
                        className="text-white font-medium hover:text-gray-300 transition-colors"
                      >
                        {order.customer.phone}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Total Card */}
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
                      <span className="text-white">{formatCurrency(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Tax:</span>
                      <span className="text-white">{formatCurrency(order.tax)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t border-white/10 pt-3">
                      <span className="text-white">Total:</span>
                      <span className="text-[#D5D502]">{formatCurrency(order.total)}</span>
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