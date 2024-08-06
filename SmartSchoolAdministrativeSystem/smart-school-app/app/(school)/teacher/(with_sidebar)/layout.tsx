/** component imports */
import { Sidebar, SidebarItem } from "@/components/general/sidebar";
import Navbar from "../../school_admin/_components/navbar";
import LogoutSidebarItem from "../../school_admin/_components/logoutSidebarItem";

/** icon imports */
import { FilesIcon, LayoutDashboardIcon } from "lucide-react";
import { BookUserIcon } from "lucide-react";

/** server action imports */
import { signOut } from "@/auth";

export default function TeacherLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="h-screen flex">
      <Sidebar>
        {/* <SidebarItem href="/school_admin/dashboard">
          <LayoutDashboardIcon /> Dashboard
        </SidebarItem> */}
        <SidebarItem href="/teacher/students">
          <BookUserIcon /> Students
        </SidebarItem>
        <SidebarItem href="/teacher/students/scores">
          <FilesIcon /> Scores
        </SidebarItem>
      </Sidebar>
      <div className="h-full flex-grow flex flex-col">
        <Navbar />
        <div className="p-4 flex-grow overflow-auto pb-8">{children}</div>
      </div>
    </section>
  );
}
