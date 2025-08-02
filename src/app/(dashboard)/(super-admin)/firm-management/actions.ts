"use server";

import { databases } from "@/lib/appwrite-server";
import { ID } from "appwrite";
import { revalidatePath } from "next/cache";

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const collectionId = process.env.NEXT_PUBLIC_APPWRITE_FIRMS_COLLECTION_ID!;

// CREATE a new firm
export async function createFirm(data: {
  name: string;
  industry: string;
  contactEmail: string;
  phoneNumber: string;
  address: string;
}) {
  try {
    await databases.createDocument(databaseId, collectionId, ID.unique(), data);
    revalidatePath("/dashboard/super-admin/firm-management");
    return { success: "Firm created successfully." };
  } catch (error) {
    console.error("Failed to create firm:", error);
    return { error: "Failed to create firm." };
  }
}

// UPDATE an existing firm
export async function updateFirm(
  id: string,
  data: {
    name: string;
    industry: string;
    contactEmail: string;
    phoneNumber: string;
    address: string;
  }
) {
  try {
    await databases.updateDocument(databaseId, collectionId, id, data);
    revalidatePath("/dashboard/super-admin/firm-management");
    return { success: "Firm updated successfully." };
  } catch (error) {
    console.error("Failed to update firm:", error);
    return { error: "Failed to update firm." };
  }
}

// DELETE a firm
export async function deleteFirm(id: string) {
  try {
    await databases.deleteDocument(databaseId, collectionId, id);
    revalidatePath("/dashboard/super-admin/firm-management");
    return { success: "Firm deleted successfully." };
  } catch (error) {
    console.error("Failed to delete firm:", error);
    return { error: "Failed to delete firm." };
  }
}
