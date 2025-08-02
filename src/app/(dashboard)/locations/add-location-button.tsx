"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/context/UserContext"; // Import the useAuth hook
import { databases } from "@/lib/appwrite"; // Import the CLIENT-SIDE database client
import { ID } from "appwrite";

interface AddLocationButtonProps {
  onLocationAdded: () => void;
}

export function AddLocationButton({ onLocationAdded }: AddLocationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth(); // Get the logged-in user from the context
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    // Security Check: Make sure the user is a firm admin
    if (user?.role !== "firm_admin" || !user.firmId) {
      setError("Unauthorized: Only firm admins can create locations.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name") as string,
      address: formData.get("address") as string,
      latitude: parseFloat(formData.get("latitude") as string),
      longitude: parseFloat(formData.get("longitude") as string),
      contact: formData.get("contact") as string,
      firmId: user.firmId, // Add the firmId from the logged-in user
    };

    try {
      const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
      const collectionId =
        process.env.NEXT_PUBLIC_APPWRITE_LOCATIONS_COLLECTION_ID!;

      // Use the client-side SDK to create the document
      await databases.createDocument(
        databaseId,
        collectionId,
        ID.unique(),
        data
      );

      setIsOpen(false);
      onLocationAdded(); // Close dialog on success
      router.refresh(); // Refresh the page to show the new location
    } catch (e: any) {
      setError(e.message || "An unknown error occurred.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Location
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] z-[1000]">
        <DialogHeader>
          <DialogTitle>Add New Location</DialogTitle>
          <DialogDescription>
            Enter the details for the new location. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" name="name" className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Address
            </Label>
            <Input
              id="address"
              name="address"
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="latitude" className="text-right">
              Latitude
            </Label>
            <Input
              id="latitude"
              name="latitude"
              type="number"
              step="any"
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="longitude" className="text-right">
              Longitude
            </Label>
            <Input
              id="longitude"
              name="longitude"
              type="number"
              step="any"
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contact" className="text-right">
              Contact
            </Label>
            <Input id="contact" name="contact" className="col-span-3" />
          </div>
          {error && (
            <p className="col-span-4 text-center text-sm text-red-600">
              {error}
            </p>
          )}
          <div className="flex justify-end mt-4">
            <Button type="submit">Save Location</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
