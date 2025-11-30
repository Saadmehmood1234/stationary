"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/dbConnect";
import Order, { IOrder } from "@/models/Order";
import { Order as OrderType, OrderItem } from "@/types";
import { getSession } from "./auth.actions";

function transformOrderDocument(doc: any): OrderType {
  if (!doc) throw new Error("Document is null or undefined");

  return {
    _id: doc._id?.toString() || "",
    orderNumber: doc.orderNumber || "",
    customer: {
      name: doc.customer?.name || "",
      email: doc.customer?.email || "",
      phone: doc.customer?.phone || "",
    },
    items: (doc.items || []).map((item: any) => ({
      productId: item.productId || "",
      name: item.name || "",
      sku: item.sku || "",
      quantity: item.quantity || 0,
      price: item.price || 0,
      total: item.total || 0,
    })) as OrderItem[],
    subtotal: doc.subtotal || 0,
    tax: doc.tax || 0,
    total: doc.total || 0,
    status: doc.status || "pending",
    paymentStatus: doc.paymentStatus || "pending",
    paymentMethod: doc.paymentMethod || "razorpay",
    collectionMethod: doc.collectionMethod || "pickup",
    notes: doc.notes || "",
    createdAt: doc.createdAt || new Date(),
    updatedAt: doc.updatedAt || new Date(),
  };
}

export async function getOrders(
  page: number = 1,
  limit: number = 10,
  status?: string,
  paymentStatus?: string,
  search?: string
) {
  try {
    await dbConnect();

    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (paymentStatus && paymentStatus !== "all") {
      filter.paymentStatus = paymentStatus;
    }

    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
        { "customer.email": { $regex: search, $options: "i" } },
        { "customer.phone": { $regex: search, $options: "i" } },
      ];
    }

    const [orders, totalCount] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      success: true,
      data: {
        orders: orders.map((order) => transformOrderDocument(order)),
        pagination: {
          currentPage: page,
          totalPages,
          totalOrders: totalCount,
          hasNextPage,
          hasPrevPage,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { success: false, message: "Failed to fetch orders" };
  }
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    await dbConnect();

    const order = await Order.findByIdAndUpdate(
      id,
      {
        status,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    ).lean();

    if (!order) {
      return { success: false, message: "Order not found" };
    }

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);

    return {
      success: true,
      data: transformOrderDocument(order),
    };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, message: "Failed to update order status" };
  }
}

export async function sendOrderConfirmation(id: string) {
  try {
    await dbConnect();

    const order = await Order.findById(id).lean();
    if (!order) {
      return { success: false, message: "Order not found" };
    }

    // Use type assertion to fix TypeScript error
    const orderDoc = order as any;

    // TODO: Implement actual email sending logic
    // For now, we'll simulate sending an email
    console.log(
      `Sending confirmation email for order ${orderDoc.orderNumber} to ${orderDoc.customer.email}`
    );

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      message: "Order confirmation email sent successfully",
    };
  } catch (error) {
    console.error("Error sending order confirmation:", error);
    return {
      success: false,
      message: "Failed to send order confirmation email",
    };
  }
}

interface OrderData {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    productId: string;
    name: string;
    sku: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  collectionMethod: "pickup" | "delivery";
  paymentMethod: string;
  notes?: string;
}

// Helper function to generate order number
async function generateOrderNumber(): Promise<string> {
  const count = await Order.countDocuments();
  return `ORD-${String(count + 1).padStart(3, "0")}`;
}

// Helper function to safely serialize order data
function serializeOrder(order: any) {
  return {
    _id: order._id.toString(),
    orderNumber: order.orderNumber,
    customer: order.customer,
    items: order.items.map((item: any) => ({
      productId: item.productId,
      name: item.name,
      sku: item.sku,
      quantity: item.quantity,
      price: item.price,
      total: item.total,
    })),
    subtotal: order.subtotal,
    tax: order.tax,
    total: order.total,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    collectionMethod: order.collectionMethod,
    notes: order.notes,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

export async function createOrder(orderData: OrderData) {
  try {
    await dbConnect();

    // Generate order number
    const orderNumber = await generateOrderNumber();

    // Create the order with all required fields
    const order = new Order({
      orderNumber,
      customer: orderData.customer,
      items: orderData.items,
      subtotal: orderData.subtotal,
      tax: orderData.tax,
      total: orderData.total,
      collectionMethod: orderData.collectionMethod,
      paymentMethod: orderData.paymentMethod,
      notes: orderData.notes,
      status: "pending",
      paymentStatus: "pending",
    });

    await order.save();

    // Use the helper function to safely serialize the order
    const serializedOrder = serializeOrder(order);

    revalidatePath("/admin/orders");
    return {
      success: true,
      data: serializedOrder,
    };
  } catch (error: any) {
    console.error("Error creating order:", error);
    return {
      success: false,
      message: error.message || "Failed to create order",
    };
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
      return { success: false, message: "Order not found" };
    }

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);

    return {
      success: true,
      data: transformOrderDocument(order),
    };
  } catch (error) {
    console.error("Error updating order:", error);
    return { success: false, message: "Failed to update order" };
  }
}

export async function deleteOrder(id: string) {
  try {
    await dbConnect();

    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return { success: false, message: "Order not found" };
    }

    revalidatePath("/admin/orders");
    return { success: true, message: "Order deleted successfully" };
  } catch (error) {
    console.error("Error deleting order:", error);
    return { success: false, message: "Failed to delete order" };
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
      data: orders.map((order) => transformOrderDocument(order)),
    };
  } catch (error) {
    console.error("Error fetching limited orders:", error);
    return { success: false, message: "Failed to fetch orders" };
  }
}
// Add these time-based analytics functions
async function getDailyRevenue() {
  try {
    const today = new Date();
    const last7Days = new Date(today);
    last7Days.setDate(today.getDate() - 6);

    const dailyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          value: { $sum: "$total" },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          label: "$_id",
          value: 1,
          _id: 0,
        },
      },
    ]);

    // Fill in missing days
    return fillMissingDays(dailyRevenue, 7);
  } catch (error) {
    console.error("Error fetching daily revenue:", error);
    return [];
  }
}

async function getWeeklyRevenue() {
  try {
    const weeklyRevenue = await Order.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%U",
              date: "$createdAt",
            },
          },
          value: { $sum: "$total" },
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $limit: 8,
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          label: "Week " + { $substr: ["$_id", 5, 2] },
          value: 1,
          _id: 0,
        },
      },
    ]);

    return weeklyRevenue.reverse();
  } catch (error) {
    console.error("Error fetching weekly revenue:", error);
    return [];
  }
}

async function getMonthlyRevenue() {
  try {
    const monthlyRevenue = await Order.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m",
              date: "$createdAt",
            },
          },
          value: { $sum: "$total" },
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $limit: 6,
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          label: {
            $dateToString: {
              format: "%b %Y",
              date: { $dateFromString: { dateString: "$_id" } },
            },
          },
          value: 1,
          _id: 0,
        },
      },
    ]);

    return monthlyRevenue;
  } catch (error) {
    console.error("Error fetching monthly revenue:", error);
    return [];
  }
}

async function getYearlyRevenue() {
  try {
    const yearlyRevenue = await Order.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y",
              date: "$createdAt",
            },
          },
          value: { $sum: "$total" },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          label: "$_id",
          value: 1,
          _id: 0,
        },
      },
    ]);

    return yearlyRevenue;
  } catch (error) {
    console.error("Error fetching yearly revenue:", error);
    return [];
  }
}

async function getDailyOrders() {
  try {
    const today = new Date();
    const last7Days = new Date(today);
    last7Days.setDate(today.getDate() - 6);

    const dailyOrders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          value: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          label: "$_id",
          value: 1,
          _id: 0,
        },
      },
    ]);

    // Fill in missing days
    return fillMissingDays(dailyOrders, 7);
  } catch (error) {
    console.error("Error fetching daily orders:", error);
    return [];
  }
}

async function getWeeklyOrders() {
  try {
    const weeklyOrders = await Order.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%U",
              date: "$createdAt",
            },
          },
          value: { $sum: 1 },
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $limit: 8,
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          label: "Week " + { $substr: ["$_id", 5, 2] },
          value: 1,
          _id: 0,
        },
      },
    ]);

    return weeklyOrders.reverse();
  } catch (error) {
    console.error("Error fetching weekly orders:", error);
    return [];
  }
}

async function getMonthlyOrders() {
  try {
    const monthlyOrders = await Order.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m",
              date: "$createdAt",
            },
          },
          value: { $sum: 1 },
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $limit: 6,
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          label: {
            $dateToString: {
              format: "%b %Y",
              date: { $dateFromString: { dateString: "$_id" } },
            },
          },
          value: 1,
          _id: 0,
        },
      },
    ]);

    return monthlyOrders;
  } catch (error) {
    console.error("Error fetching monthly orders:", error);
    return [];
  }
}

async function getYearlyOrders() {
  try {
    const yearlyOrders = await Order.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y",
              date: "$createdAt",
            },
          },
          value: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          label: "$_id",
          value: 1,
          _id: 0,
        },
      },
    ]);

    return yearlyOrders;
  } catch (error) {
    console.error("Error fetching yearly orders:", error);
    return [];
  }
}

// Helper function to fill missing days with zero values
function fillMissingDays(data: any[], days: number) {
  const today = new Date();
  const filledData = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split("T")[0];

    const existingData = data.find((item) => item.label === dateString);

    if (existingData) {
      filledData.push({
        label: getDayLabel(date),
        value: existingData.value,
      });
    } else {
      filledData.push({
        label: getDayLabel(date),
        value: 0,
      });
    }
  }

  return filledData;
}

// Helper function to format day labels
function getDayLabel(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }
}

// Function to get recent orders for dashboard
async function getRecentOrders(limit: number = 5) {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return orders.map((order) => transformOrderDocument(order));
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    return [];
  }
}

export async function getOrderAnalytics() {
  try {
    await dbConnect();

    const [
      totalOrders,
      completedOrders,
      pendingOrders,
      revenueData,
      statusCounts,
      recentOrdersCount,
      topProducts,
      dailyRevenue,
      weeklyRevenue,
      monthlyRevenue,
      yearlyRevenue,
      dailyOrders,
      weeklyOrders,
      monthlyOrders,
      yearlyOrders,
      recentOrders,
    ] = await Promise.all([
      // Total orders
      Order.countDocuments(),

      // Completed orders
      Order.countDocuments({ status: "completed" }),

      // Pending orders
      Order.countDocuments({ status: "pending" }),

      // Revenue data
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$total" },
            averageOrderValue: { $avg: "$total" },
          },
        },
      ]),

      // Orders by status
      Order.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      // Recent orders count (last 7 days)
      Order.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),

      // Top products
      Order.aggregate([
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.name",
            count: { $sum: "$items.quantity" },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
          $project: {
            name: "$_id",
            count: 1,
            _id: 0,
          },
        },
      ]),

      // Time-based revenue data
      getDailyRevenue(),
      getWeeklyRevenue(),
      getMonthlyRevenue(),
      getYearlyRevenue(),

      // Time-based order trends
      getDailyOrders(),
      getWeeklyOrders(),
      getMonthlyOrders(),
      getYearlyOrders(),

      // Recent orders data
      getRecentOrders(5),
    ]);

    const analytics = {
      totalOrders,
      totalRevenue: revenueData[0]?.totalRevenue || 0,
      averageOrderValue: revenueData[0]?.averageOrderValue || 0,
      completedOrders,
      pendingOrders,
      recentOrders: recentOrdersCount, // This should be a number, not an array
      ordersByStatus: (statusCounts || []).reduce((acc: any, item: any) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      topProducts: topProducts || [],
      revenueData: {
        daily: dailyRevenue || [],
        weekly: weeklyRevenue || [],
        monthly: monthlyRevenue || [],
        yearly: yearlyRevenue || [],
      },
      orderTrends: {
        daily: dailyOrders || [],
        weekly: weeklyOrders || [],
        monthly: monthlyOrders || [],
        yearly: yearlyOrders || [],
      },
      recentOrdersData: recentOrders || [], // Add this for the actual recent orders array
    };

    return {
      success: true,
      data: analytics,
    };
  } catch (error) {
    console.error("Error fetching order analytics:", error);
    return { success: false, message: "Failed to fetch order analytics" };
  }
}

// Use the same Order interface as in your frontend

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled';
  total: number;
  items: OrderItem[];
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

export async function getUserOrders(): Promise<{ success: boolean; data?: Order[]; message?: string }> {
  try {
    const session = await getSession()
    
    if (!session?.email) {
      return { success: false, message: 'Not authenticated' };
    }

    await dbConnect();
    
    const orders = await Order.find({ 'customer.email': session.email })
      .sort({ createdAt: -1 })
      .lean();
    
    const transformedOrders: Order[] = orders.map((order: any) => ({
      id: order._id.toString(),
      orderNumber: order.orderNumber,
      date: order.createdAt.toISOString(),
      status: order.status,
      total: order.total,
      items: order.items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.total
      })),
      customer: order.customer,
      paymentStatus: order.paymentStatus,
      collectionMethod: order.collectionMethod,
      notes: order.notes,
      subtotal: order.subtotal,
      tax: order.tax,
      paymentMethod: order.paymentMethod
    }));

    return { 
      success: true, 
      data: transformedOrders 
    };
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return { 
      success: false, 
      message: 'Failed to fetch orders' 
    };
  }
}

export async function getOrderById(orderId: string): Promise<{ success: boolean; data?: Order; message?: string }> {
  try {
    const session = await getSession()
    
    if (!session?.email) {
      return { success: false, message: 'Not authenticated' };
    }

    await dbConnect();
    
    const order = await Order.findOne({ 
      _id: orderId,
      'customer.email': session.email 
    }).lean();

    if (!order) {
      return { success: false, message: 'Order not found' };
    }

    const transformedOrder: Order = {
      id: (order as any)._id.toString(),
      orderNumber: (order as any).orderNumber,
      date: (order as any).createdAt.toISOString(),
      status: (order as any).status,
      total: (order as any).total,
      items: (order as any).items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.total
      })),
      customer: (order as any).customer,
      paymentStatus: (order as any).paymentStatus,
      collectionMethod: (order as any).collectionMethod,
      notes: (order as any).notes,
      subtotal: (order as any).subtotal,
      tax: (order as any).tax,
      paymentMethod: (order as any).paymentMethod
    };

    return { 
      success: true, 
      data: transformedOrder 
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    return { 
      success: false, 
      message: 'Failed to fetch order' 
    };
  }
}