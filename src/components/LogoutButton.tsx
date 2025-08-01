"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { account } from "@/lib/appwrite";
import { Button } from "@/components/ui/button";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Deletes the current active session
      await account.deleteSession("current");
      // Redirects the user to the login page
      router.push("/");
    } catch (error) {
      console.error("Failed to log out:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <Button variant="destructive" onClick={handleLogout}>
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
};

export default LogoutButton;
