"use client";
import SessionTable from "@/app/ui/user/session-table";
import axiosInstance from "@/app/utils/axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import {
  startOfDay,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  parseISO,
} from "date-fns";
import NotificationBar from "@/app/ui/notification-bar";
import { CiExport } from "react-icons/ci";

export default function Page() {
  const [user, setUser] = useState([]);
  const { id: menuId } = useParams();

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
      } catch (error) {
        console.error("Failed to fetch user details:", error);
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
      {/* <MenuName menuId={menuId}/> */}
      <SessionResponseTable />
    </div>
  );
}

export function SessionResponseTable() {
  const { id: menuId } = useParams();
  const [sessionData, setSessionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/sessions/${parseInt(menuId)}`
        );
        setSessionData(response.data);
        console.log(response.data);
      } catch (error) {
        setError(`Error fetching sessions: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (menuId) {
      fetchMenu();
    } else {
      setLoading(false);
    }
  }, [menuId]);

  return (
    <div>
      <ExportCSV sessionData={sessionData} menuId={menuId} />
      <div className="relative h-[65vh]">
        <SessionTable sessionData={sessionData} error={error} loading={loading}/>
      </div>
    </div>
  );
}

export function ExportCSV({ sessionData, menuId }) {
  const [filterOption, setFilterOption] = useState("all");

  const filterData = () => {
    const now = new Date();
    let filteredData = sessionData;

    if (filterOption === "today") {
      const start = startOfDay(now);
      const end = new Date();
      filteredData = sessionData.filter((item) =>
        isWithinInterval(parseISO(item.date), { start, end })
      );
    } else if (filterOption === "this_week") {
      const start = startOfWeek(now, { weekStartsOn: 1 });
      const end = endOfWeek(now, { weekStartsOn: 1 });
      filteredData = sessionData.filter((item) =>
        isWithinInterval(parseISO(item.date), { start, end })
      );
    }

    return filteredData;
  };
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 space-y-2 sm:space-y-0">
  <MenuName menuId={menuId} />
  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
    <select
      onChange={(e) => setFilterOption(e.target.value)}
      value={filterOption}
      className="bg-gray-200 rounded-md p-1 text-sm sm:text-base w-full sm:w-auto"
    >
      <option value="all">All Sessions</option>
      <option value="today">Today</option>
      <option value="this_week">This Week</option>
    </select>
    <CSVLink
      data={filterData()}
      filename={`sessiondata_${filterOption}.csv`}
      className="inline-block px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white font-medium text-sm sm:text-base rounded-md 
    hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 
    transition duration-200 w-full sm:w-auto text-center"
      target="_blank"
    >
      <CiExport className="inline-block mr-1 sm:mr-2" size={16} />
      <span className="hidden sm:inline">Export</span>
      <span className="sm:hidden">Export</span>
    </CSVLink>
  </div>
</div>
  );
}

export function MenuName({ menuId }) {
  const [menu, setMenu] = useState({});

  useEffect(() => {
    const fetchMenuDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/menu/${parseInt(menuId)}/`
        );
        setMenu(response.data);
      } catch (error) {
        console.error("Failed to fetch Menu details:", error);
      }
    };

    fetchMenuDetails();
  }, []);

  return (
    <div className="text-slate-600 text-sm sm:text-xl font-semibold mt-4 mb-4">
      Session Response for {menu.name}
    </div>
  );
}
