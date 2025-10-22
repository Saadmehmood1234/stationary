"use server";

import dbConnect from "@/lib/dbConnect";
import logData from "@/lib/log-function/logData";
import Contact, { IContact } from "@/models/Contact";
import {
  ContactFormData,
  ContactDocument,
  PaginatedContactsResponse,
  ContactFilters,
} from "@/types";
import { revalidatePath } from "next/cache";

export const contactForm = async (data: ContactFormData) => {
  console.log("Contact form submission:", data);

  const { name, email, message, subject } = data;

  if (!name || !email || !message || !subject) {
    return {
      status: 400,
      success: false,
      message: "Please provide all the required fields",
    };
  }

  try {
    await dbConnect();

    // Use countDocuments for better performance with large datasets
    const contactCount = await Contact.countDocuments();
    if (contactCount > 100) {
      return {
        status: 400,
        success: false,
        message: "Contact form submissions limit reached. Please try again later.",
      };
    }

    const contactEntry = await Contact.create({
      name,
      email,
      message,
      subject,
    });

    // Return minimal data for better performance
    return {
      status: 201,
      success: true,
      message: "Thank you for your message! We will get back to you soon.",
      data: {
        _id: contactEntry._id,
        name: contactEntry.name,
        email: contactEntry.email,
        subject: contactEntry.subject,
      },
    };
  } catch (error) {
    console.error("Server error in contact form:", error);
    logData(error);

    return {
      status: 500,
      success: false,
      message: "Internal server error. Please try again later.",
    };
  }
};

// Optimized server action with search, filters, and pagination
export const getPaginatedContacts = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  filters: ContactFilters = {}
): Promise<{
  status: number;
  success: boolean;
  data?: PaginatedContactsResponse;
  message: string;
}> => {
  try {
    await dbConnect();

    const skip = (page - 1) * limit;
    
    // Build query for search and filters
    const query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    if (filters.dateRange) {
      query.createdAt = {
        $gte: new Date(filters.dateRange.from),
        $lte: new Date(filters.dateRange.to),
      };
    }

    if (filters.subject) {
      query.subject = { $regex: filters.subject, $options: 'i' };
    }

    // Use Promise.all for parallel execution
    const [contacts, totalContacts] = await Promise.all([
      Contact.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("name email subject message createdAt")
        .lean()
        .exec(),
      Contact.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalContacts / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    const transformedContacts: ContactDocument[] = contacts.map((contact) => ({
      _id: contact._id.toString(),
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      message: contact.message,
      createdAt: contact.createdAt.toISOString(),
      updatedAt: contact.updatedAt?.toISOString() || contact.createdAt.toISOString(),
    }));

    return {
      status: 200,
      success: true,
      data: {
        contacts: transformedContacts,
        pagination: {
          currentPage: page,
          totalPages,
          totalContacts,
          hasNextPage,
          hasPrevPage,
          limit,
        },
      },
      message: "Contact data retrieved successfully",
    };
  } catch (error) {
    console.error("Error fetching paginated contact data:", error);
    logData(error);

    return {
      status: 500,
      success: false,
      message: "Failed to fetch contact data",
    };
  }
};

// Delete contact action
export const deleteContact = async (id: string): Promise<{
  status: number;
  success: boolean;
  message: string;
}> => {
  try {
    await dbConnect();

    const result = await Contact.findByIdAndDelete(id);
    
    if (!result) {
      return {
        status: 404,
        success: false,
        message: "Contact not found",
      };
    }

    revalidatePath("/admin/contacts");
    
    return {
      status: 200,
      success: true,
      message: "Contact deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting contact:", error);
    logData(error);

    return {
      status: 500,
      success: false,
      message: "Failed to delete contact",
    };
  }
};

// Update contact action
export const updateContact = async (
  id: string, 
  updates: Partial<ContactDocument>
): Promise<{
  status: number;
  success: boolean;
  data?: ContactDocument;
  message: string;
}> => {
  try {
    await dbConnect();

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).lean();

    if (!updatedContact) {
      return {
        status: 404,
        success: false,
        message: "Contact not found",
      };
    }

    const transformedContact: ContactDocument = {
      _id: updatedContact._id.toString(),
      name: updatedContact.name,
      email: updatedContact.email,
      subject: updatedContact.subject,
      message: updatedContact.message,
      createdAt: updatedContact.createdAt.toISOString(),
      updatedAt: updatedContact.updatedAt?.toISOString() || updatedContact.createdAt.toISOString(),
    };

    revalidatePath("/admin/contacts");

    return {
      status: 200,
      success: true,
      data: transformedContact,
      message: "Contact updated successfully",
    };
  } catch (error) {
    console.error("Error updating contact:", error);
    logData(error);

    return {
      status: 500,
      success: false,
      message: "Failed to update contact",
    };
  }
};

// Get unique subjects for filter dropdown
export const getUniqueSubjects = async (): Promise<{
  status: number;
  success: boolean;
  data?: string[];
  message: string;
}> => {
  try {
    await dbConnect();

    const subjects = await Contact.distinct("subject");
    
    return {
      status: 200,
      success: true,
      data: subjects,
      message: "Subjects retrieved successfully",
    };
  } catch (error) {
    console.error("Error fetching subjects:", error);
    logData(error);

    return {
      status: 500,
      success: false,
      message: "Failed to fetch subjects",
    };
  }
};