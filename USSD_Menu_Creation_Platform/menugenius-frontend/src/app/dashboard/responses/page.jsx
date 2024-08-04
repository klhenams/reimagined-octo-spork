'use client'
import NotificationBar from "@/app/ui/notification-bar";
import UserMenuTable from "@/app/ui/user/menu-table";
import UserResponseMenuTable from "@/app/ui/user/response-menu-table";
import axiosInstance from "@/app/utils/axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Responses() {
  const [user, setUser] = useState([]);

  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return "Good Morning";
    } else if (currentHour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get("/api/user/");
        setUser(response.data);
        // setGreeting(getGreeting());
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        // Handle the error (e.g., redirect to login)
      }
    };

    fetchUserDetails();
  }, []);
  return (
    <div>
      <div className="flex justify-between">
        <div>
          <p className="text-slate-500 text-sm font-bold">
            Hi {user.first_name} 👋,
          </p>
          <p className="text-indigo-900 text-2xl md:text-4xl font-bold">{getGreeting()}!</p>
        </div>
        <NotificationBar />
      </div>
      <div className="text-slate-600 text-xl font-semibold mt-4">Session Responses</div>

      <div className="w-full flex justify-between mt-3">
        <select className="select select-xs select-bordered w-2/6 max-w-xs">
          <option value>View All</option>
          <option>Live</option>
          <option>Production</option>
        </select>
      </div>

      <UserResponseMenuTable />
    </div>
  );
}
