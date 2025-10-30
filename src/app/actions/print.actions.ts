"use server";

import { revalidatePath } from "next/cache";
import PrintOrder from "@/models/PrintOrder";
import dbConnect from "@/lib/dbConnect";
import { CreatePrintOrderInput } from "@/types";
import { uploadFile, validateFile, deleteFile } from "@/lib//fileUpload";
import { PrintOrder as PrintOrderType } from '@/types'; 
export async function createPrintOrder(formData: FormData) {
  await dbConnect();

  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const paperSize = formData.get("paperSize") as string;
    const colorType = formData.get("colorType") as string;
    const pageCount = parseInt(formData.get("pageCount") as string);
    const binding = formData.get("binding") as string;
    const urgency = formData.get("urgency") as string;
    const specialInstructions = formData.get("specialInstructions") as string;
    const file = formData.get("file") as File;

    if (!name || !email || !phone || !pageCount) {
      return {
        success: false,
        error: "Missing required fields",
      };
    }

    let fileUploadResult = null;
    if (file && file.size > 0) {
      const validation = validateFile(file);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error,
        };
      }

      fileUploadResult = await uploadFile(file);
    }

    const orderData = {
      name,
      email,
      phone,
      paperSize: paperSize as "A4" | "A3" | "Letter" | "Legal",
      colorType: colorType as "bw" | "color",
      pageCount,
      binding: binding as "none" | "spiral" | "stapler",
      urgency: urgency as "normal" | "urgent" | "express",
      specialInstructions,
    };

    const estimatedCost = calculateCost(orderData);
    const printOrderData: any = {
      ...orderData,
      estimatedCost,
      status: "pending",
    };

    if (fileUploadResult) {
      printOrderData.fileUrl = fileUploadResult.url;
      printOrderData.fileName = fileUploadResult.fileName;
      printOrderData.fileSize = fileUploadResult.fileSize;
      printOrderData.fileType = fileUploadResult.fileType;
      printOrderData.publicId = fileUploadResult.publicId;
    }

    const printOrder = await PrintOrder.create(printOrderData);

    revalidatePath("/admin/print-orders");

    const serializedOrder = {
      ...printOrder.toObject(),
      _id: printOrder._id.toString(),
      createdAt: printOrder.createdAt.toISOString(),
      updatedAt: printOrder.updatedAt.toISOString(),
    };

    return {
      success: true,
      data: serializedOrder,
    };
  } catch (error) {
    console.error("Error creating print order:", error);
    return {
      success: false,
      error: "Failed to create print order",
    };
  }
}

export async function getPrintOrders() {
  await dbConnect();

  try {
    const orders = await PrintOrder.find().sort({ createdAt: -1 });
    return { success: true, data: JSON.parse(JSON.stringify(orders)) as PrintOrderType[] };
  } catch (error) {
    return { success: false, data: [], error: 'Failed to fetch print orders' };
  }
}


export async function updatePrintOrderStatus(id: string, status: string, finalCost?: number) {
  await dbConnect();

  try {
    const updateData: any = { status };
    if (finalCost) updateData.finalCost = finalCost;

    const order = (await PrintOrder.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).lean()) as PrintOrderType | null;

    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    revalidatePath('/admin/print-orders');

    const serializedOrder = {
      ...order,
      _id: order._id.toString(),
      createdAt: new Date(order.createdAt).toISOString(),
      updatedAt: new Date(order.updatedAt).toISOString(),
    };

    return { success: true, data: serializedOrder };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: 'Failed to update order status' };
  }
}


export async function deletePrintOrder(id: string) {
  await dbConnect();

  try {
    const order = await PrintOrder.findById(id);

    if (!order) {
      return {
        success: false,
        error: "Order not found",
      };
    }

    if (order.publicId) {
      await deleteFile(order.publicId);
    }

    await PrintOrder.findByIdAndDelete(id);

    revalidatePath("/admin/print-orders");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting print order:", error);
    return {
      success: false,
      error: "Failed to delete print order",
    };
  }
}

function calculateCost(order: any): number {
  let cost = 0;
  const pageCount = order.pageCount || 1;

  if (order.paperSize === "A4") {
    cost += order.colorType === "color" ? 10 * pageCount : 2 * pageCount;
  } else if (order.paperSize === "A3") {
    cost += order.colorType === "color" ? 20 * pageCount : 5 * pageCount;
  } else if (order.paperSize === "Letter" || order.paperSize === "Legal") {
    cost += order.colorType === "color" ? 15 * pageCount : 4 * pageCount;
  }

  if (order.binding === "spiral") {
    cost += order.pageCount <= 50 ? 50 : 100;
  } else if (order.binding === "stapler") {
    cost += 10;
  }

  if (order.urgency === "urgent") {
    cost += cost * 0.3;
  } else if (order.urgency === "express") {
    cost += cost * 0.5;
  }

  return Math.round(cost);
}
