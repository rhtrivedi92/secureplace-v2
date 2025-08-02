"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Models } from "appwrite";

// Define the shape of our combined data
export interface FirmAdmins extends Models.Document {
  name: string;
  email: string;
  firmName: string;
  // This includes other properties from your user_profiles collection
}

export const columns: ColumnDef<FirmAdmins>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "firmName", header: "Assigned Firm" },
  // We will add an Actions column later for Edit/Delete
];
