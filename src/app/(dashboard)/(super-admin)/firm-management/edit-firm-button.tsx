"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { updateFirm } from "./actions";
import { Firm } from "./columns"; // Import the Firm type

interface EditFirmButtonProps {
  firm: Firm;
  children: React.ReactNode; // To accept the trigger element
}

export function EditFirmButton({ firm, children }: EditFirmButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name") as string,
      industry: formData.get("industry") as string,
      contactEmail: formData.get("contactEmail") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      address: formData.get("address") as string,
    };

    const result = await updateFirm(firm.$id, data);
    if (result.success) {
      setIsOpen(false);
    } else {
      alert(result.error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* The trigger is passed as a child */}
      <div onClick={() => setIsOpen(true)} className="w-full">
        {children}
      </div>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Firm</DialogTitle>
          <DialogDescription>
            Update the details for {firm.name}. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              defaultValue={firm.name}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="industry" className="text-right">
              Industry
            </Label>
            <Input
              id="industry"
              name="industry"
              defaultValue={firm.industry}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contactEmail" className="text-right">
              Email
            </Label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              defaultValue={firm.contactEmail}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phoneNumber" className="text-right">
              Phone
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              defaultValue={firm.phoneNumber}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Address
            </Label>
            <Input
              id="address"
              name="address"
              defaultValue={firm.address || ""}
              className="col-span-3"
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
