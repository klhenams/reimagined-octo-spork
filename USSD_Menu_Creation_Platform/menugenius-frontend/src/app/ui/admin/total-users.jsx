"use client";
import axiosInstance from "@/app/utils/axios";
import { useEffect, useState } from "react";
import { HiUsers } from "react-icons/hi2";
import { CardSkeleton } from "./stat-skeletons";

export default function TotalUsersCard() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const totalUsers = users.length;

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axiosInstance.get("/api/users/");
        setUsers(response.data);
        setIsLoading(false);
      } catch (error) {
        setError("Failed to fecth users");
      }
    };
    getUsers();
  }, []);

  return (
    <>
      {isLoading ? (
        <CardSkeleton />
      ) : (
        <div className="flex items-center w-full h-24 bg-white rounded-2xl p-4 gap-4">
          <div className="bg-blue-50 h-14 w-14 rounded-full text-blue-600 flex justify-center items-center">
            <HiUsers size={30} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium ">Total Users</p>
            <p className="text-indigo-900 text-2xl font-bold">{totalUsers}</p>
          </div>
        </div>
      )}
    </>
  );
}
