"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  User,
  ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrderById } from "@/app/actions/order.actions";

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled';
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  paymentStatus: 'pending' | 'paid' | 'failed';
  collectionMethod: 'pickup' | 'delivery';
  notes?: string;
  subtotal?: number;
  tax?: number;
  paymentMethod?: string;
}

const statusSteps = [
  { key: 'pending', label: 'Order Placed', description: 'Your order has been received' },
  { key: 'confirmed', label: 'Confirmed', description: 'Order is being processed' },
  { key: 'ready', label: 'Ready for Pickup', description: 'Your order is ready' },
  { key: 'completed', label: 'Completed', description: 'Order has been picked up' },
  { key: 'cancelled', label: 'Cancelled', description: 'Order was cancelled' }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500';
    case 'ready':
      return 'bg-blue-500';
    case 'confirmed':
      return 'bg-blue-500';
    case 'pending':
      return 'bg-yellow-500';
    case 'cancelled':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    case 'ready':
      return <Package className="h-6 w-6 text-blue-500" />;
    case 'confirmed':
      return <Clock className="h-6 w-6 text-blue-500" />;
    case 'pending':
      return <Clock className="h-6 w-6 text-yellow-500" />;
    case 'cancelled':
      return <AlertCircle className="h-6 w-6 text-red-500" />;
    default:
      return <Package className="h-6 w-6 text-gray-500" />;
  }
};

const getEstimatedTime = (status: string): string => {
  switch (status) {
    case 'pending':
      return '1-2 hours';
    case 'confirmed':
      return '1 hour';
    case 'ready':
      return 'Ready now';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'N/A';
    default:
      return 'Processing';
  }
};

export default function TrackOrderPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get order ID from URL parameters
  const orderId = params.id as string;
  useEffect(() => {
    if (orderId) {
      loadOrder(orderId);
    } else {
      setLoading(false);
      setError("No order ID provided");
    }
  }, [orderId]);

  const loadOrder = async (id: string) => {
    setLoading(true);
    setError("");

    try {
      const result = await getOrderById(id);
      if (result.success && result.data) {
        setOrder(result.data);
      } else {
        setError(result.message || "Order not found");
        setOrder(null);
      }
    } catch (err: any) {
      setError("Failed to load order. Please try again.");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (orderId) {
      loadOrder(orderId);
    }
  };

  const getCurrentStepIndex = () => {
    if (!order) return -1;
    return statusSteps.findIndex(step => step.key === order.status);
  };

  const currentStepIndex = getCurrentStepIndex();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 relative overflow-hidden">
        <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
          <div className="text-center py-20">
            <RefreshCw className="h-12 w-12 animate-spin text-[#D5D502] mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">Loading Order Details</h3>
            <p className="text-gray-400">Please wait while we fetch your order information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
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
          style={{ top: "20%", left: "5%" }}
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
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white cursor-pointer"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>
          
          <Button
            onClick={handleRefresh}
            disabled={loading}
            className="cursor-pointer bg-gradient-to-r from-[#D5D502] to-[#c4c400] text-slate-900 hover:shadow-lg hover:shadow-[#D5D502]/25 px-4 py-2 rounded-full font-semibold"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </motion.div>

        {/* Error State */}
        {error && !order && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-12 w-12 text-red-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">
              Order Not Found
            </h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              {error}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push('/profile')}
                className="cursor-pointer bg-gradient-to-r from-[#D5D502] to-[#c4c400] text-slate-900 hover:shadow-lg hover:shadow-[#D5D502]/25 px-6 py-3 rounded-full font-semibold"
              >
                <User className="h-4 w-4 mr-2" />
                View My Orders
              </Button>
              <Button
                onClick={() => router.push('/shop')}
                variant="outline"
                className="cursor-pointer border-[#D5D502] text-[#D5D502] hover:bg-[#D5D502] hover:text-slate-900 px-6 py-3 rounded-full font-semibold"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </div>
          </motion.div>
        )}

        {/* Order Tracking */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Order Status Card */}
            <Card className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-white">
                      Order #{order.orderNumber}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Placed on {new Date(order.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#D5D502]">
                      ₹{order.total.toFixed(2)}
                    </div>
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                      order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Progress Steps */}
                <div className="relative">
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-600"></div>
                  <div 
                    className="absolute top-5 left-0 h-0.5 bg-[#D5D502] transition-all duration-500"
                    style={{ 
                      width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` 
                    }}
                  ></div>
                  
                  <div className="flex justify-between relative">
                    {statusSteps.map((step, index) => (
                      <div key={step.key} className="flex flex-col items-center text-center">
                        <div className={`w-10 h-10 max-sm:h-8 max-sm:w-8 rounded-full flex items-center justify-center border-2 z-10 ${
                          index <= currentStepIndex
                            ? 'bg-[#D5D502] border-[#D5D502] text-slate-900'
                            : 'bg-transparent border-gray-600 text-gray-400'
                        }`}>
                          {index < currentStepIndex ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            getStatusIcon(step.key)
                          )}
                        </div>
                        <div className="mt-3 max-w-24">
                          <p className={`text-sm max-md:text-[8px] font-medium ${
                            index <= currentStepIndex ? 'text-white' : 'text-gray-400'
                          }`}>
                            {step.label}
                          </p>
                          <p className="text-xs max-md:text-[5px] text-gray-500 mt-1">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Estimated Time */}
                <div className="mt-8 p-4 bg-[#D5D502]/10 rounded-2xl border border-[#D5D502]/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-[#D5D502]">Estimated Pickup Time</h4>
                      <p className="text-[#D5D502]/80 text-sm">
                        {order.status === 'completed' 
                          ? 'Order has been picked up' 
                          : order.status === 'cancelled'
                          ? 'Order was cancelled'
                          : `Ready in approximately ${getEstimatedTime(order.status)}`
                        }
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-[#D5D502]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Details & Customer Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Items */}
              <Card className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Package className="h-5 w-5 text-[#D5D502]" />
                    Order Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex-1">
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">₹{item.total.toFixed(2)}</p>
                          <p className="text-gray-400 text-sm">₹{item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Customer & Pickup Info */}
              <Card className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="h-5 w-5 text-[#D5D502]" />
                    Customer & Pickup Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-[#D5D502]" />
                      <div>
                        <p className="text-white font-medium">{order.customer.name}</p>
                        <p className="text-gray-400 text-sm">Customer</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-[#D5D502]" />
                      <div>
                        <p className="text-white font-medium">{order.customer.phone}</p>
                        <p className="text-gray-400 text-sm">Phone</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-[#D5D502]" />
                      <div>
                        <p className="text-white font-medium break-all">{order.customer.email}</p>
                        <p className="text-gray-400 text-sm">Email</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-[#D5D502]" />
                      <div>
                        <p className="text-white font-medium">In-Store Pickup</p>
                        <p className="text-gray-400 text-sm">
                          Ali Book, Tayyab Mosque\nShaheen Bagh Okhla New Delhi 110025
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          Mon-Sat: 9:00 AM - 11:00 PM
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}