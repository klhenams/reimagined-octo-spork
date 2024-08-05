/** component imports */
import { Sidebar, SidebarItem } from "@/components/general/sidebar";
import Navbar from "../_components/navbar";

/** icon imports */
import { LayoutDashboardIcon } from "lucide-react";
import { GraduationCapIcon } from "lucide-react";
import { BookUserIcon } from "lucide-react";
import { LogOutIcon } from "lucide-react";

/** server action imports */
import { signOut } from "@/auth";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="h-screen flex">
      <Sidebar>
        <SidebarItem href="/school_admin/dashboard">
          <LayoutDashboardIcon className="w-4 h-4" /> Dashboard
        </SidebarItem>
        <SidebarItem href="/school_admin/students">
          <BookUserIcon className="w-4 h-4" /> Students
        </SidebarItem>
        <SidebarItem href="/school_admin/teachers">
          <GraduationCapIcon className="w-4 h-4" /> Teachers
        </SidebarItem>
      </Sidebar>
      <div className="h-full flex-grow flex flex-col">
        <Navbar />
        <div className="p-4 flex-grow overflow-auto pb-8">{children}</div>
      </div>
    </section>
  );
}
