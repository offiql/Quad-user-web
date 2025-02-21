"use client";
import { Home, Search, LayoutGrid, FileText, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MdFamilyRestroom } from "react-icons/md";
import { FaHospitalUser } from "react-icons/fa6";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutGrid,
  },
  {
    name: "Records",
    href: "/records",
    icon: FileText,
  },
  {
    name: "Upload Documents",
    href: "/upload-documents",
    icon: Upload,
  },
  {
    name: "My Relations",
    href: "/my-relations",
    icon: MdFamilyRestroom,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: FaHospitalUser,
  },
];

export default function Header() {
  const pathname = usePathname();

  const currentPage =
    navigation.find((item) => pathname.startsWith(item.href))?.name ||
    "Dashboard";

  return (
    <header className="sticky top-0 bg-white">
      <div className="flex items-center justify-between px-8 pt-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Home className="text-black pb-0.5" size={18} />
          <span>/ {currentPage}</span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search" className="pl-8 w-64" />
        </div>
      </div>
    </header>
  );
}
