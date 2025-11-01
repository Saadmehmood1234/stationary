'use client';

import { useEffect, useState } from 'react';
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
import { Loader2 } from 'lucide-react';

export default function PrintOrdersAdmin() {
  const [orders, setOrders] = useState<PrintOrder[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 flex justify-center items-center">
        <div className="flex items-center gap-3 text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading orders...</span>
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#D5D502] to-yellow-400"></div>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">
                Print Orders
              </CardTitle>
              <CardDescription className="text-gray-300">
                {orders.length} order{orders.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {orders.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-gray-400 text-xl mb-2">No print orders yet</div>
                  <p className="text-gray-500">Print orders will appear here when customers submit requests</p>
                </div>
              ) : (
                <div className="overflow-hidden">
                  <Table>
                    <TableHeader className="bg-white/5">
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-gray-300 font-semibold">Order Details</TableHead>
                        <TableHead className="text-gray-300 font-semibold">Specifications</TableHead>
                        <TableHead className="text-gray-300 font-semibold">Cost</TableHead>
                        <TableHead className="text-gray-300 font-semibold">Status</TableHead>
                        <TableHead className="text-gray-300 font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order, index) => (
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
                                Urgency: {order.urgency}
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
                              <SelectTrigger className="bg-white/10 border-white/20 text-white w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 text-white border-white/20">
                                <SelectItem value="pending" className="focus:bg-white/10">Pending</SelectItem>
                                <SelectItem value="confirmed" className="focus:bg-white/10">Confirmed</SelectItem>
                                <SelectItem value="printing" className="focus:bg-white/10">Printing</SelectItem>
                                <SelectItem value="completed" className="focus:bg-white/10">Completed</SelectItem>
                                <SelectItem value="cancelled" className="focus:bg-white/10">Cancelled</SelectItem>
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