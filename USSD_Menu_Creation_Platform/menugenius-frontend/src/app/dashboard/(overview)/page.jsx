'use client'
import NotificationBar from "@/app/ui/notification-bar";
import MenuCreateForm from "@/app/ui/user/menu-create-form";
import UserMenuTable from "@/app/ui/user/menu-table";
import axiosInstance from "@/app/utils/axios";
import { useEffect, useState } from "react";
import { CiSquarePlus } from "react-icons/ci";


export default function Page() {
  const[user, setUser] = useState([]);

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
            const response = await axiosInstance.get('/api/user/');
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user details:', error);
            // Handle the error (e.g., redirect to login)
        }
    };

    fetchUserDetails();
}, []);

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <p className="text-slate-500 text-sm font-bold">Hi {user.first_name} 👋,</p>
          <p className="text-indigo-900 text-2xl md:text-4xl font-bold">{getGreeting()}!</p>
        </div>
        <NotificationBar />
      </div>
      <div className="text-slate-600 text-xl font-semibold mt-4">
        My Flows
      </div>

      <div className="w-full flex justify-between items-center">
        <select className="select select-xs select-bordered w-2/6 max-w-xs">
          <option value>View All</option>
          <option>Live</option>
          <option>Production</option>
        </select>
        <div>

        <div className="drawer drawer-end z-10">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* Page content here */}
            <label
              htmlFor="my-drawer-4"
              className="drawer-button btn btn-primary bg-blue-700 text-white"
            >
              Create new<CiSquarePlus size={24} />
            </label>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer-4"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <div className="menu bg-white text-base-content min-h-full w-4/6 p-4 sm:w-3/6">
              {/* Sidebar content here */}
              <MenuCreateForm />
            </div>
          </div>
        </div>

        </div>
      </div>

      <UserMenuTable />
    </div>
  );
}
