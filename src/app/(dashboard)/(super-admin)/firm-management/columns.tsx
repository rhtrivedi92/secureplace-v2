"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Models } from "appwrite";
import { deleteFirm } from "./actions";
import { EditFirmButton } from "./edit-firm-button";

export interface Firm extends Models.Document {
  name: string;
  industry: string;
  contactEmail: string;
  phoneNumber: string;
  address?: string; // Make address optional to match schema
}

export const columns: ColumnDef<Firm>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Firm Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  { accessorKey: "industry", header: "Industry" },
  { accessorKey: "contactEmail", header: "Contact Email" },
  { accessorKey: "phoneNumber", header: "Phone Number" },
  {
    id: "actions",
    cell: ({ row }) => {
      const firm = row.original;

      return (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              {/* Edit Firm action triggers the EditFirmButton component */}
              <EditFirmButton firm={firm}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Edit Firm
                </DropdownMenuItem>
              </EditFirmButton>

              <DropdownMenuSeparator />

              {/* Delete Firm action triggers the AlertDialog */}
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-red-500 hover:!text-red-500 hover:!bg-red-100">
                  Delete Firm
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* This is the content for the Delete confirmation dialog */}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                firm and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => await deleteFirm(firm.$id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
