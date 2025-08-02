import { databases, users } from "@/lib/appwrite-server";
import { Query, Client, Users as AppwriteUsers } from "node-appwrite";
import { FirmAdmins, columns } from "./columns";
import { DataTable } from "./data-table";
import { Firm } from "../firm-management/columns";

async function getFirmAdmins(): Promise<FirmAdmins[]> {
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const profilesCollectionId =
    process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;
  const firmsCollectionId =
    process.env.NEXT_PUBLIC_APPWRITE_FIRMS_COLLECTION_ID!;
  const apiKey = process.env.APPWRITE_API_KEY;

  if (!apiKey) {
    console.error(
      "FATAL ERROR: The APPWRITE_API_KEY was not found in the server environment."
    );
    return [];
  }

  console.log("API Key is present. Initializing a special debug client.");

  try {
    // Create a new client right here for this specific task
    const debugClient = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setKey(apiKey);

    const debugUsers = new AppwriteUsers(debugClient);

    console.log("Attempting to list users with debug client...");
    const usersResponse = await debugUsers.list();
    console.log(`Success! Found ${usersResponse.total} users.`);

    // The rest of the logic remains the same
    const profileResponse = await databases.listDocuments(
      databaseId,
      profilesCollectionId,
      [Query.equal("role", "firm_admin")]
    );

    const firmsResponse = await databases.listDocuments(
      databaseId,
      firmsCollectionId
    );
    const firmsMap = new Map(
      firmsResponse.documents.map((f) => [f.$id, f.name])
    );

    const firmAdmins = profileResponse.documents.map((profile) => {
      const authUser = usersResponse.users.find(
        (u) => u.$id === profile.userId
      );
      const firmName = firmsMap.get(profile.firmId) || "N/A";

      return {
        ...profile,
        name: authUser?.name || profile.fullName,
        email: authUser?.email || "N/A",
        firmName: firmName,
      } as FirmAdmins;
    });

    return firmAdmins;
  } catch (error) {
    console.error("Failed to fetch firm admins:", error);
    return [];
  }
}

// Helper to fetch firms for the 'Add Admin' dropdown
async function getFirms(): Promise<Firm[]> {
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const collectionId = process.env.NEXT_PUBLIC_APPWRITE_FIRMS_COLLECTION_ID!;
  try {
    const response = await databases.listDocuments(databaseId, collectionId);
    return response.documents as unknown as Firm[];
  } catch (error) {
    return [];
  }
}

export default async function FirmAdminsPage() {
  const data = await getFirmAdmins();
  const firms = await getFirms();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-brand-blue mb-6">
        Firm Admin Management
      </h1>
      <DataTable columns={columns} data={data} firms={firms} />
    </div>
  );
}
