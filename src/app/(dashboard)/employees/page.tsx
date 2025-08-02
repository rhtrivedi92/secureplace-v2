"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/UserContext";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import { Employee, columns } from "./columns";
import { DataTable } from "./data-table";

export default function EmployeesPage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = useCallback(async () => {
    if (user && user.firmId) {
      setLoading(true);
      try {
        const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
        const collectionId =
          process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;

        const response = await databases.listDocuments(
          databaseId,
          collectionId,
          [
            Query.equal("firmId", user.firmId), // Fetch employees ONLY for this admin's firm
          ]
        );
        setEmployees(response.documents as unknown as Employee[]);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-brand-blue mb-6">
        Employee Management
      </h1>
      <DataTable
        columns={columns}
        data={employees}
        onActionComplete={fetchEmployees}
      />
    </div>
  );
}
