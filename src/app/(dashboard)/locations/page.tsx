"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/UserContext";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import { Location } from "./columns";
import LocationCard from "./LocationCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AddLocationButton } from "./add-location-button";

export default function LocationsPage() {
  const { user } = useAuth(); // Get the logged-in user from our global context
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLocations = useCallback(async () => {
    if (user && user.firmId) {
      setLoading(true);
      try {
        const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
        const collectionId =
          process.env.NEXT_PUBLIC_APPWRITE_LOCATIONS_COLLECTION_ID!;

        const response = await databases.listDocuments(
          databaseId,
          collectionId,
          [Query.equal("firmId", user.firmId)]
        );
        setLocations(response.documents as unknown as Location[]);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      } finally {
        setLoading(false);
      }
    } else if (user) {
      setLoading(false);
      setLocations([]);
    }
  }, [user]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  // Display a loading state while fetching data
  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-blue">
          Location Management
        </h1>
        <AddLocationButton onLocationAdded={fetchLocations} />
      </div>

      {locations.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <LocationCard
              key={location.$id}
              location={location}
              onActionComplete={fetchLocations} // <-- Pass the refetch function
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-dashed border-2 rounded-lg">
          <h2 className="text-xl font-semibold">No locations found.</h2>
          <p className="text-slate-500 mt-2">
            Get started by adding your first location.
          </p>
        </div>
      )}
    </div>
  );
}
