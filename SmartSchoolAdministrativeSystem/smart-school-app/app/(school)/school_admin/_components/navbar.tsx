/** component imports */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import db from "@/db/db";
import { USER_ROLE } from "@prisma/client";
import LogoutLink from "@/components/auth/logoutLink";

export default async function Navbar() {
  const session = await auth();
  if (!session || !session.user) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  let userDetails: { first_name: string; last_name: string } = {
    first_name: "First",
    last_name: "Last",
  };

  if (user!.role === USER_ROLE.teacher) {
    userDetails = (await db.teacher.findUnique({
      where: { id: user!.id },
      select: { first_name: true, last_name: true },
    }))!;
  } else if (user!.role === USER_ROLE.schoolAdmin) {
    userDetails = (await db.schoolAdministrator.findUnique({
      where: { id: user!.id },
      select: { first_name: true, last_name: true },
    }))!;
  }

  return (
    <div className="flex justify-between items-center px-8 py-6">
      <div className="flex items-center gap-1">
        <Avatar className="w-12 h-12">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className="text-sm">
          {userDetails.first_name} {userDetails.last_name}
        </span>
      </div>
      <div>
        <LogoutLink />
      </div>
    </div>
  );
}
