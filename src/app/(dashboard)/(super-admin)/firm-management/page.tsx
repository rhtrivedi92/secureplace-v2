import { databases } from "@/lib/appwrite-server";
import { Firm, columns } from "./columns";
import { DataTable } from "./data-table";

async function getFirms(): Promise<Firm[]> {
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const collectionId = process.env.NEXT_PUBLIC_APPWRITE_FIRMS_COLLECTION_ID!;

  // Log to make sure the correct ID is being used
  console.log(`Fetching firms from collection: ${collectionId}`);

  try {
    const response = await databases.listDocuments(databaseId, collectionId);

    // Log the entire response from Appwrite to see what we're getting
    console.log("Appwrite response:", response);

    // The 'unknown' cast fixes the TypeScript error by telling it to trust our 'Firm' type.
    return response.documents as unknown as Firm[];
  } catch (error) {
    console.error("Failed to fetch firms:", error);
    return []; // Return empty array on error
  }
}

export default async function FirmManagementPage() {
  const data = await getFirms();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-brand-blue mb-6">
        Firm Management
      </h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
