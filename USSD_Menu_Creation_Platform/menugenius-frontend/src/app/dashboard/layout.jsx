"use client";

import { HiOutlineUsers } from "react-icons/hi2";
import { BiCategory } from "react-icons/bi";
import { TiFlowChildren, TiFlowSwitch } from "react-icons/ti";
import { GoStack } from "react-icons/go";
import { CiSettings } from "react-icons/ci";
import { RiLogoutCircleRLine } from "react-icons/ri";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import Link from "next/link";
import clsx from "clsx";
import { HiMenuAlt2 } from "react-icons/hi";

export default function Layout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileSideNavOpen, setIsMobileSideNavOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("userAccessToken");
        const response = await axiosInstance.post("/user/token/verify/", {
          token: token,
        });
        if (response.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        const refreshToken = localStorage.getItem("userRefreshToken");
        if (refreshToken) {
          try {
            const response = await axiosInstance.post("/user/token/refresh/", {
              refresh: refreshToken,
            });
            const { access } = response.data;
            localStorage.setItem("userAccessToken", access);
            axiosInstance.defaults.headers["Authorization"] =
              "Bearer " + access;
            setIsAuthenticated(true);
          } catch (refreshError) {
            console.log("Refresh token failed", refreshError);
            router.push("/auth/login");
          }
        } else {
          router.push("/auth/login");
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
      <div className="h-scree hidden lg:flex justify-center overflow-hidden p-8 -mt-6 border border-b-2">
        <SideNav />
      </div>

      {/* Mobile SideNav */}
      <MobileSideNav 
        isOpen={isMobileSideNavOpen} 
        onClose={() => setIsMobileSideNavOpen(false)}
      />

      {/* Main content */}
      <div className="h-screen w-full lg:w-full p-8 overflow-auto">
        {/* Hamburger menu for mobile */}
        <button 
          className="lg:hidden"
          onClick={() => setIsMobileSideNavOpen(true)}
        >
          <HiMenuAlt2 size={24}/>
        </button>
        {children}
      </div>
    </div>
  );
}

export function SideNav() {
  const router = useRouter();
  const handleClick = () => {
    localStorage.removeItem('userAccessToken');
    localStorage.removeItem('userRefreshToken');
    router.push('/auth/login')
  }

  return (
    <div className="relative">
      <Link href='/dashboard'>
      <div className="flex-col items-center inline-flex p-8 gap-2 bg-indigo-950 rounded-xl mt-2 text-slate-200">
        <p className="text-2xl font-bold">MENUGENIUS</p>
        <p className="text-xs font-medium">USER DASHBOARD</p>
      </div>
      </Link>
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
    name: "USSD flows",
    href: "/dashboard",
    icon: TiFlowSwitch,
  },
  {
    name: "Responses",
    href: "/dashboard/responses",
    icon: HiOutlineUsers,
  },

  // { name: "Templates", href: "/j", icon: GoStack },
  { name: "Settings", href: "/dashboard/settings/general", icon: CiSettings },
];

export function NavLinks() {
  const pathname = usePathname();

  const isActiveLink = (href) => {
    if (href === '/dashboard' && pathname === '/dashboard') {
      return true;
    }
    else if (href === '/dashboard' && pathname.startsWith('/dashboard/flow/')) {
      return true;
    }
    else if (href === '/dashboard/settings/general' && pathname === '/dashboard/settings/billing') {
      return true;
    }
    return pathname.startsWith(href) && href !== '/dashboard';
  };
  
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link key={link.name} href={link.href}
          
          className={clsx(
            'rounded-md p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600',
            {
              'bg-sky-100 text-blue-600': isActiveLink(link.href),
              'text-slate-500': !isActiveLink(link.href),
            }
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
    localStorage.removeItem('userAccessToken');
    localStorage.removeItem('userRefreshToken');
    router.push('/auth/login');
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={onClose}>
      <div className="relative w-3/4 max-w-sm h-full bg-white shadow-xl p-6" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-gray-600" onClick={onClose}>
          X
        </button>

        <Link href='/dashboard'>
          <div className="flex-col items-center inline-flex p-8 gap-2 bg-indigo-950 rounded-xl mt-2 text-slate-200">
            <p className="text-2xl font-bold">MENUGENIUS</p>
            <p className="text-xs font-medium">USER DASHBOARD</p>
          </div>
        </Link>
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