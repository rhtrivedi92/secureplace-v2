"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/context/UserContext";
import { account, databases } from "@/lib/appwrite";
import { ID, Permission, Role } from "appwrite";

interface AddEmployeeButtonProps {
  onEmployeeAdded: () => void;
}

export function AddEmployeeButton({ onEmployeeAdded }: AddEmployeeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (!user || !user.firmId) {
      setError("Could not identify your firm. Please try again.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const password = "Password@123";
    const email = formData.get("officialEmail") as string;
    const fullName = formData.get("fullName") as string;

    try {
      // CORRECTED: The account.create method takes 4 arguments, not 5.
      const newUser = await account.create(
        ID.unique(),
        email,
        password,
        fullName
      );

      const profileData = {
        userId: newUser.$id,
        firmId: user.firmId,
        role: "employee",
        fullName: fullName,
        officialEmail: email,
        employeeCode: formData.get("employeeCode") as string,
        contactNumber: formData.get("contactNumber") as string,
        emergencyContactNumber: formData.get(
          "emergencyContactNumber"
        ) as string,
        bloodGroup: formData.get("bloodGroup") as string,
      };

      const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
      const collectionId =
        process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;

      const permissions = [
        Permission.update(Role.team(user.firmId)),
        Permission.delete(Role.team(user.firmId)),
      ];

      await databases.createDocument(
        databaseId,
        collectionId,
        ID.unique(),
        profileData,
        permissions
      );

      setIsOpen(false);
      onEmployeeAdded();
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fullName" className="text-right">
              Full Name
            </Label>
            <Input
              id="fullName"
              name="fullName"
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="officialEmail" className="text-right">
              Email
            </Label>
            <Input
              id="officialEmail"
              name="officialEmail"
              type="email"
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employeeCode" className="text-right">
              Emp Code
            </Label>
            <Input
              id="employeeCode"
              name="employeeCode"
              className="col-span-3"
              required
            />
          </div>
          {error && (
            <p className="col-span-4 text-center text-sm text-red-600">
              {error}
            </p>
          )}
          <div className="flex justify-end mt-4">
            <Button type="submit">Create Employee</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
