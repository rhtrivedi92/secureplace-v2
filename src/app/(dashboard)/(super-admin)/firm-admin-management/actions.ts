"use server";

import { databases, users } from "@/lib/appwrite-server";
import { ID, Query } from "node-appwrite";
import { revalidatePath } from "next/cache";

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const profilesCollectionId =
  process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;

export async function createFirmAdmin(data: {
  name: string;
  email: string;
  password: string;
  firmId: string;
}) {
  try {
    // 1. Create the user in Appwrite Auth
    const newUser = await users.create(
      ID.unique(),
      data.email,
      undefined, // phone
      data.password,
      data.name
    );

    // 2. Create the user profile document
    await databases.createDocument(
      databaseId,
      profilesCollectionId,
      ID.unique(),
      {
        userId: newUser.$id,
        role: "firm_admin",
        firmId: data.firmId,
        fullName: data.name,
        officialEmail: data.email,
        // Add any other required profile fields here with default values
      }
    );

    revalidatePath("/dashboard/firm-admins");
    return { success: "Firm Admin created successfully." };
  } catch (error: any) {
    // Clean up if profile creation fails
    if (error.code !== 409) {
      // 409 is user already exists
      // await users.delete(newUser.$id); // Implement cleanup if needed
    }
    console.error("Failed to create firm admin:", error);
    return { error: error.message };
  }
}
