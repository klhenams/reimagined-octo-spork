"use client";

import { HiOutlineUsers } from "react-icons/hi2";
import { BiCategory } from "react-icons/bi";
import { TiFlowChildren } from "react-icons/ti";
import { GoStack } from "react-icons/go";
import { CiSettings } from "react-icons/ci";
import { RiLogoutCircleRLine } from "react-icons/ri";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import { HiMenuAlt2 } from "react-icons/hi";

export default function Layout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileSideNavOpen, setIsMobileSideNavOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("adminAccessToken");
        const response = await axiosInstance.post("/user/token/verify/admin/", {
          token: token,
        });
        if (response.status === 200){
          setIsAuthenticated(true)
        }
      } catch (error) {
        const refreshToken = localStorage.getItem("adminRefreshToken");
        if (refreshToken) {
          try {
            const response = await axiosInstance.post("/user/token/refresh/", {
              refresh: refreshToken,
            });
            const { access } = response.data;
            localStorage.setItem("adminAccessToken", access);
            axiosInstance.defaults.headers["Authorization"] =
              "Bearer " + access;
            setIsAuthenticated(true);
          } catch (refreshError) {
            console.log("Refresh token failed", refreshError);
            router.push("/auth/admin");
          }
        } else {
          router.push("/auth/admin");
        }
      }
    };

    checkAuth();
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex">
      {/* Desktop SideNav */}
      <div className="hidden lg:flex justify-center overflow-hidden bg-gray-50 p-8 -mt-6">
        <SideNav />
      </div>

      {/* Mobile SideNav */}
      <MobileSideNav 
        isOpen={isMobileSideNavOpen} 
        onClose={() => setIsMobileSideNavOpen(false)}
      />

      {/* Main content */}
      <div className="h-screen w-full lg:w-full p-8 bg-blue-50 overflow-auto">
        {/* Hamburger menu for mobile */}
        <button 
          className="lg:hidden mb-4"
          onClick={() => setIsMobileSideNavOpen(true)}
        >
          <HiMenuAlt2 size={24} />
        </button>
        {children}
      </div>
    </div>
  );
}

export function SideNav() {
  const router = useRouter();
  const handleClick = () => {
    localStorage.removeItem('adminAccessToken');
    localStorage.removeItem('adminRefreshToken');
    router.push('/auth/admin')

  }
  return (
    <div className="">
      <div className="flex-col items-center inline-flex p-8 gap-2 bg-indigo-950 rounded-xl mt-2 text-slate-200">
        <p className="text-2xl font-bold">MENUGENIUS</p>
        <p className="text-xs font-medium">ADMIN | DASHBOARD</p>
      </div>
      <div className=" border border-indigo-100 mt-2 "></div>

      
        <div className="flex flex-col mt-8 gap-4">
          <NavLinks />
        </div>
        <div className="flex gap-2 p-4 fixed bottom-0">
        <button className="w-full rounded-md p-3" onClick={handleClick}>
          <div className="flex gap-4 text-slate-500 text-sm font-medium">
            <RiLogoutCircleRLine size={22} />
            <p>Logout</p>
          </div>
        </button>
        </div>
    </div>
  );
}

const links = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: BiCategory,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: HiOutlineUsers,
  },
  {
    name: "USSD Menus",
    href: "/admin/menus",
    icon: TiFlowChildren,
  },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link key={link.name} href={link.href}
          
          className={clsx(
            'rounded-md p-3 text-sm font-medium text-slate-500 hover:bg-sky-100 hover:text-blue-600',
            {
              'bg-sky-100 text-blue-600': pathname === link.href,
            },
          )}
          >
            <div className="flex gap-4 items-center">
            <LinkIcon size={24} className={clsx({'text-blue-700': pathname === link.href,})}/>
            <p >{link.name}</p>
            </div>
          </Link>
        );
      })}
    </>
  );
}

export function MobileSideNav({ isOpen, onClose }) {
  const router = useRouter();

  const handleClick = () => {
    localStorage.removeItem('adminAccessToken');
    localStorage.removeItem('adminRefreshToken');
    router.push('/auth/admin');
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={onClose}>
      <div className="relative w-3/4 max-w-sm h-full bg-white shadow-xl p-6" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-gray-600" onClick={onClose}>
          X
        </button>

        <div className="flex-col items-center inline-flex p-8 gap-2 bg-indigo-950 rounded-xl mt-2 text-slate-200">
          <p className="text-2xl font-bold">MENUGENIUS</p>
          <p className="text-xs font-medium">ADMIN | DASHBOARD</p>
        </div>
        <div className="border border-indigo-100 mt-2"></div>

        <div className="flex flex-col mt-8 gap-4">
          <NavLinks />
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <button className="w-full rounded-md p-3" onClick={handleClick}>
            <div className="flex gap-4 text-slate-500 text-sm font-medium">
              <RiLogoutCircleRLine size={22} />
              <p>Logout</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}