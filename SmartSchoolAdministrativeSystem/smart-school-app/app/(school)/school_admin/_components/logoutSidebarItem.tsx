"use client";
/** react imports */
import { useTransition } from "react";
/** component imports */
import { SidebarItem } from "@/components/general/sidebar";
import { Button } from "@/components/ui/button";

/** icon imports */
import { LogOutIcon } from "lucide-react";

/** server action imports */
import { logOut } from "@/app/(auth)/_actions/authentication";

export default function LogoutSidebarItem() {
  const [isPending, startTransition] = useTransition();
  return (
    <Button  className="text-red-500 bg-transparent hover:bg-transparent" onClick={async () => await logOut()}>
      <LogOutIcon /> Logout
    </Button>
  );
}
