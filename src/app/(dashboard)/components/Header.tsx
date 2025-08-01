"use client";

import { Bell, Mail, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { user } = useUser();

  return (
    <header className="flex items-center justify-between h-20 px-6 bg-white border-b">
      {/* Left side of Header */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden mr-4"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold text-brand-blue">Dashboard</h1>
      </div>

      {/* Right side of Header */}
      <div className="flex items-center space-x-6">
        <button className="text-slate-500 hover:text-brand-orange">
          <Bell className="h-6 w-6" />
        </button>
        <button className="text-slate-500 hover:text-brand-orange">
          <Mail className="h-6 w-6" />
        </button>
        <div className="flex items-center">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>SA</AvatarFallback>
          </Avatar>
          <div className="ml-3 text-left">
            <p className="text-sm font-semibold text-brand-blue">
              {user?.fullName || "Super Admin"}
            </p>
            <p className="text-xs text-slate-500">
              {user?.role || "super_admin"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
