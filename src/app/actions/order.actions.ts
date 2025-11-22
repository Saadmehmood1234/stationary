'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/dbConnect';
import Order, { IOrder } from '@/models/Order';
import { Order as OrderType, OrderItem } from '@/types';

function transformOrderDocument(doc: any): OrderType {
  return {
    _id: doc._id.toString(),
    orderNumber: doc.orderNumber,
    customer: {
      name: doc.customer.name,
      email: doc.customer.email,
      phone: doc.customer.phone
    },
    items: doc.items.map((item: any) => ({
      productId: item.productId,
      name: item.name,
      sku: item.sku,
      quantity: item.quantity,
      price: item.price,
      total: item.total
    })) as OrderItem[],
    subtotal: doc.subtotal,
    tax: doc.tax,
    total: doc.total,
    status: doc.status,
    paymentStatus: doc.paymentStatus,
    collectionMethod: doc.collectionMethod,
    notes: doc.notes,
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt)
  };
}

export async function createOrder(orderData: Omit<OrderType, '_id' | 'createdAt' | 'updatedAt'>) {
  try {
    await dbConnect();
    
    const order = new Order(orderData);
    await order.save();
    
    revalidatePath('/admin/orders');
    return { success: true, data: transformOrderDocument(order) };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, message: 'Failed to create order' };
  }
}

export async function getOrders(page: number = 1, limit: number = 10, status?: string) {
  try {
    await dbConnect();
    
    const skip = (page - 1) * limit;
    const filter = status && status !== 'all' ? { status } : {};
    
    const [orders, totalCount] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter)
    ]);
    
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    return {
      success: true,
      data: {
        orders: orders.map(order => transformOrderDocument(order)),
        pagination: {
          currentPage: page,
          totalPages,
          totalOrders: totalCount,
          hasNextPage,
          hasPrevPage
        }
      }
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { success: false, message: 'Failed to fetch orders' };
  }
}

export async function getOrderById(id: string) {
  try {
    await dbConnect();
    
    const order = await Order.findById(id).lean();
    if (!order) {
      return { success: false, message: 'Order not found' };
    }
    
    return {
      success: true,
      data: transformOrderDocument(order)
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    return { success: false, message: 'Failed to fetch order' };
  }
}

export async function updateOrder(id: string, updates: Partial<OrderType>) {
  try {
    await dbConnect();
    
    const order = await Order.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();
    
    if (!order) {
      return { success: false, message: 'Order not found' };
    }
    
    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${id}`);
    
    return {
      success: true,
      data: transformOrderDocument(order)
    };
  } catch (error) {
    console.error('Error updating order:', error);
    return { success: false, message: 'Failed to update order' };
  }
}

export async function deleteOrder(id: string) {
  try {
    await dbConnect();
    
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return { success: false, message: 'Order not found' };
    }
    
    revalidatePath('/admin/orders');
    return { success: true, message: 'Order deleted successfully' };
  } catch (error) {
    console.error('Error deleting order:', error);
    return { success: false, message: 'Failed to delete order' };
  }
}

export async function getOrdersByLimit(limit: number = 5) {
  try {
    await dbConnect();
    
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    
    return {
      success: true,
      data: orders.map(order => transformOrderDocument(order))
    };
  } catch (error) {
    console.error('Error fetching limited orders:', error);
    return { success: false, message: 'Failed to fetch orders' };
  }
}