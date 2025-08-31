import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import SafetyClassDetails from "./SafetyClassDetails";

type SafetyClass = {
  id: string;
  title: string;
  description: string;
  duration: number;
  videoUrl: string;
  category: string;
  isRemote: boolean;
  createdAt: string;
  firmId: string | null;
  thumbnailUrl: string | null;
};

async function requireAdmin() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: me } = await supabase
    .from("profiles")
    .select("role, firm_id")
    .eq("id", user.id)
    .single();

  if (me?.role !== "super_admin" && me?.role !== "firm_admin") redirect("/");
  return {
    role: me!.role as "super_admin" | "firm_admin",
    firmId: me!.firm_id as string | null,
  };
}

async function getSafetyClass(id: string, firmId: string | null): Promise<SafetyClass | null> {
  // Mock data - in real implementation, query the database
  const mockClasses: SafetyClass[] = [
    {
      id: "1",
      title: "Workplace Safety Training: Proactive Steps for Preventing Accidents",
      description: "Learn essential safety protocols and best practices to prevent workplace accidents and injuries.",
      duration: 15,
      videoUrl: "https://example.com/video1.mp4",
      thumbnailUrl: "/images/safety-class-demo.png",
      category: "General Safety",
      isRemote: false,
      createdAt: "2024-01-15T10:00:00Z",
      firmId: firmId,
    },
    {
      id: "2",
      title: "Fire Safety and Emergency Evacuation Procedures",
      description: "Comprehensive guide to fire safety protocols and emergency evacuation procedures.",
      duration: 20,
      videoUrl: "https://example.com/video2.mp4",
      thumbnailUrl: "/images/safety-class-demo.png",
      category: "Emergency Response",
      isRemote: false,
      createdAt: "2024-01-10T14:30:00Z",
      firmId: firmId,
    },
    {
      id: "3",
      title: "First Aid and Medical Emergency Response",
      description: "Essential first aid training for workplace medical emergencies.",
      duration: 25,
      videoUrl: "https://example.com/video3.mp4",
      thumbnailUrl: "/images/safety-class-demo.png",
      category: "Medical",
      isRemote: false,
      createdAt: "2024-01-08T09:15:00Z",
      firmId: firmId,
    },
    {
      id: "4",
      title: "Chemical Safety and Hazardous Material Handling",
      description: "Safe handling procedures for chemicals and hazardous materials in the workplace.",
      duration: 18,
      videoUrl: "https://example.com/video4.mp4",
      thumbnailUrl: "/images/safety-class-demo.png",
      category: "Chemical Safety",
      isRemote: false,
      createdAt: "2024-01-05T16:45:00Z",
      firmId: firmId,
    },
    {
      id: "5",
      title: "Ergonomic Workplace Design and Injury Prevention",
      description: "Learn how to design ergonomic workspaces to prevent musculoskeletal injuries.",
      duration: 22,
      videoUrl: "https://example.com/video5.mp4",
      thumbnailUrl: "/images/safety-class-demo.png",
      category: "Ergonomics",
      isRemote: false,
      createdAt: "2024-01-03T11:20:00Z",
      firmId: firmId,
    },
    {
      id: "6",
      title: "Cybersecurity Awareness and Data Protection",
      description: "Essential cybersecurity training to protect sensitive company and personal data.",
      duration: 16,
      videoUrl: "https://example.com/video6.mp4",
      thumbnailUrl: "/images/safety-class-demo.png",
      category: "Cybersecurity",
      isRemote: true,
      createdAt: "2024-01-01T13:00:00Z",
      firmId: firmId,
    },
  ];

  return mockClasses.find(cls => cls.id === id) || null;
}

export default async function SafetyClassPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const me = await requireAdmin();
  const { id } = await params;

  const safetyClass = await getSafetyClass(id, me.firmId);

  if (!safetyClass) {
    redirect("/safety-classes");
  }

  return (
    <div className="container mx-auto">
      <SafetyClassDetails
        safetyClass={safetyClass}
        isSuperAdmin={me.role === "super_admin"}
      />
    </div>
  );
}
