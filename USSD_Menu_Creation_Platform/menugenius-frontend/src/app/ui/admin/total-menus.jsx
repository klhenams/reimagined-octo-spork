"use client";
import axiosInstance from "@/app/utils/axios";
import { useEffect, useState } from "react";
import { TiFlowSwitch } from "react-icons/ti";
import { CardSkeleton } from "./stat-skeletons";

export default function TotaMenusCard() {
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const totalMenus = menus.length;

  useEffect(() => {
    const getMenus = async () => {
      try {
        const response = await axiosInstance.get("/api/menus/");
        setMenus(response.data);
        setIsLoading(false);
      } catch (error) {
        setError("Failed to fecth users");
      }
    };
    getMenus();
  }, []);

  return (
    <>
      {isLoading ? (
        <CardSkeleton />
      ) : (
        <div className="flex items-center w-full h-24 bg-white rounded-2xl p-4 gap-4">
          <div className="bg-blue-50 h-14 w-14 rounded-full text-blue-600 flex justify-center items-center">
            <TiFlowSwitch size={30} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium ">Total Menus</p>
            <p className="text-indigo-900 text-2xl font-bold">{totalMenus}</p>
          </div>
        </div>
      )}
    </>
  );
}
