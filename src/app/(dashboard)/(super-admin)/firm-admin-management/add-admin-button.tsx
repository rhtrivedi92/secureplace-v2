"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { createFirmAdmin } from "./actions";
import { Firm } from "../firm-management/columns";

export function AddAdminButton({ firms }: { firms: Firm[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      firmId: formData.get("firmId") as string,
    };

    if (!data.firmId) {
      setError("Please assign a firm.");
      return;
    }

    const result = await createFirmAdmin(data);
    if (result.success) {
      setIsOpen(false);
    } else {
      setError(result.error || "An unknown error occurred.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add New Admin</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Firm Admin</DialogTitle>
          <DialogDescription>
            Create a new user and assign them as an admin to a firm.
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
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firmId" className="text-right">
              Assign Firm
            </Label>
            <Select name="firmId">
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a firm" />
              </SelectTrigger>
              <SelectContent>
                {firms.map((firm) => (
                  <SelectItem key={firm.$id} value={firm.$id}>
                    {firm.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && (
            <p className="col-span-4 text-center text-sm text-red-600">
              {error}
            </p>
          )}
          <div className="flex justify-end mt-4">
            <Button type="submit">Create Admin</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
