"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Play, Clock, Users, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddSafetyClassForm from "./AddSafetyClassForm";

type SafetyClass = {
  id: string;
  title: string;
  description: string;
  duration: number;
  videoUrl: string;
  thumbnailUrl: string;
  category: string;
  isRemote: boolean;
  createdAt: string;
  firmId: string | null;
};

const CATEGORIES = [
  "all",
  "General Safety",
  "Emergency Response",
  "Medical",
  "Chemical Safety",
  "Ergonomics",
  "Cybersecurity",
];

function setParams(
  router: ReturnType<typeof useRouter>,
  pathname: string,
  searchParams: URLSearchParams,
  updates: Record<string, string | null>
) {
  const sp = new URLSearchParams(searchParams.toString());
  Object.entries(updates).forEach(([k, v]) => {
    if (v === null || v === "") sp.delete(k);
    else sp.set(k, v);
  });
  router.replace(`${pathname}?${sp.toString()}`);
}

export default function SafetyClassesClient({
  safetyClasses,
  initialCategory,
  initialType,
  isSuperAdmin,
}: {
  safetyClasses: SafetyClass[];
  initialCategory: string;
  initialType: string;
  isSuperAdmin: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const category = sp.get("category") ?? initialCategory ?? "all";
  const type = sp.get("type") ?? initialType ?? "in-person";

  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const handleCategoryChange = (newCategory: string) => {
    setParams(router, pathname, sp, { category: newCategory });
  };

  const handleTypeChange = (newType: string) => {
    setParams(router, pathname, sp, { type: newType });
  };

  const handleExploreWorkshop = (safetyClass: SafetyClass) => {
    router.push(`/safety-classes/${safetyClass.id}`);
  };

  const handleAddSafetyClass = (data: any) => {
    // In a real implementation, this would save to the database
    console.log("Adding new safety class:", data);
    // You would typically call an API endpoint here
  };

  return (
    <div className="">
      {/* Filters and Toggle Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          {/* <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Category:</span>
          </div>
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}
          <div className="mb-6">
            <nav className="text-sm text-gray-500 mb-2">
              Home &gt; Safety Classes
            </nav>
            <span className="text-3xl font-bold text-brand-blue">Safety Classes</span>
            <span className="text-gray-600 mt-1 ml-2">(Plan before 2 weeks)</span>
          </div>
        </div>

        <div className="flex w-48 bg-gray-100 rounded-lg overflow-hidden border border-[#D8D8D8]">
          <button
            className={`flex-1 py-2 text-sm font-medium transition-colors ${type === "remote"
                ? "bg-brand-orange text-white"
                : "text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() => handleTypeChange("remote")}
          >
            Remote
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium transition-colors ${type === "in-person"
                ? "bg-brand-orange text-white"
                : "text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() => handleTypeChange("in-person")}
          >
            In-person
          </button>
        </div>
      </div>

      {/* Video Cards Grid */}
      {safetyClasses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No safety classes found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters or check back later for new content.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safetyClasses.map((safetyClass, index) => (
            <Card key={safetyClass.id} className="py-0 overflow-hidden hover:shadow-lg transition-shadow gap-3">
              <div className="relative aspect-video bg-gray-100 h-40">
                {/* Placeholder for video thumbnail */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center mx-auto mb-2">
                      <Play className="h-8 w-8 text-white ml-1" />
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Safety Training</p>
                  </div>
                </div>

                {/* Duration badge */}
                <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {safetyClass.duration} min
                </div>

                {/* Remote/In-person badge */}
                <div className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-medium ${safetyClass.isRemote
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
                  }`}>
                  {safetyClass.isRemote ? "Remote" : "In-person"}
                </div>
              </div>

              <CardContent className="">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {safetyClass.title}
                </h3>
                {/* s */}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <span>{safetyClass.duration} min</span>
                  </div>
                  {/* <span className="bg-gray-100 px-2 py-1 rounded">
                    {safetyClass.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>All Employees</span>
                  </div> */}
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button
                  onClick={() => handleExploreWorkshop(safetyClass)}
                  variant="outline"
                  className="w-full border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white transition-colors"
                >
                  Explore Workshop
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Add New Safety Class Button (for admins) */}
      {isSuperAdmin && (
        <div className="flex justify-center pt-6">
          <Button
            className="bg-brand-blue hover:bg-brand-blue/90"
            onClick={() => setIsAddFormOpen(true)}
          >
            Add New Safety Class
          </Button>
        </div>
      )}

      {/* Add Safety Class Form */}
      <AddSafetyClassForm
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onSubmit={handleAddSafetyClass}
      />


    </div>
  );
}
