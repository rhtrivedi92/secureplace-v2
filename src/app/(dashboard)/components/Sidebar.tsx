"use client";

import Link from "next/link";
import Image from "next/image";
// NEW: Import usePathname
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { account } from "@/lib/appwrite";
import {
  LayoutDashboard,
  Building,
  Users,
  MapPin,
  UserSquare,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  Siren,
  BellRing,
  BookOpen,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Define the structure for a navigation item
interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

// Define navigation items for Super Admin
const superAdminNavItems: NavItem[] = [
  { href: "/super-admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/firm-management", label: "Firms", icon: Building },
  { href: "/dashboard/firm-admins", label: "Firm Admins", icon: UserCog },
  { href: "/dashboard/locations", label: "Locations", icon: MapPin },
  { href: "/dashboard/employees", label: "Employees", icon: Users },
  { href: "/dashboard/emergencies", label: "Emergencies", icon: Siren },
  { href: "/dashboard/alerts", label: "Alerts", icon: BellRing },
  { href: "/dashboard/drills", label: "Drills", icon: UserSquare },
  { href: "/dashboard/training", label: "Training", icon: BookOpen },
];

// Define navigation items for Firm Admin
const firmAdminNavItems: NavItem[] = [
  { href: "/firm-admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/firm-profile", label: "Firm Profile", icon: Building },
  { href: "/dashboard/employees", label: "Employees", icon: Users },
  { href: "/dashboard/locations", label: "Locations", icon: MapPin },
  { href: "/dashboard/training", label: "Training", icon: BookOpen },
  { href: "/dashboard/emergencies", label: "Emergencies", icon: Siren },
  { href: "/dashboard/alerts", label: "Alerts", icon: BellRing },
  { href: "/dashboard/drills", label: "Drills", icon: UserSquare },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const { user } = useUser();
  const router = useRouter();
  // NEW: Get the current URL pathname
  const pathname = usePathname();

  useEffect(() => {
    if (user?.role === "super_admin") {
      setNavItems(superAdminNavItems);
    } else if (user?.role === "firm_admin") {
      setNavItems(firmAdminNavItems);
    }
  }, [user]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      router.push("/");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <aside
      className={`relative hidden lg:flex flex-col bg-white border-r transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex items-center justify-center h-20 px-4 border-b">
        {isOpen ? (
          <Image
            src="/images/logo-2.png"
            alt="Secure Place Logo"
            width={150}
            height={40}
            priority
          />
        ) : (
          <Image
            src="/images/logo-3.png"
            alt="Secure Place Icon"
            width={40}
            height={40}
            priority
          />
        )}
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          // NEW: Check if the current link is active
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              // UPDATED: Apply styles conditionally
              className={`flex items-center p-2 rounded-md ${
                isActive
                  ? "bg-brand-blue text-white" // Style for the active link
                  : "text-slate-700 hover:bg-brand-blue hover:text-white" // Style for inactive links
              }`}
            >
              <Icon className="h-6 w-6" />
              {isOpen && <span className="ml-3">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4 space-y-2">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-md"
        >
          <LogOut className="h-6 w-6" />
          {isOpen && <span className="ml-3 font-semibold">Logout</span>}
        </button>
        <Button
          variant="outline"
          size="icon"
          className="w-full"
          onClick={toggleSidebar}
        >
          {isOpen ? (
            <ChevronsLeft className="h-6 w-6" />
          ) : (
            <ChevronsRight className="h-6 w-6" />
          )}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
