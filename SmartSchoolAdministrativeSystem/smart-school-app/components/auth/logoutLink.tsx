"use client"
import { logOut } from "@/app/(auth)/_actions/authentication";

export default function LogoutLink() {
  return (
    <span
      className="text-ssGray-300 text-lg cursor-pointer hover:text-ssPrimary-100"
      onClick={async () => await logOut()}
    >
      Log Out
    </span>
  );
}
