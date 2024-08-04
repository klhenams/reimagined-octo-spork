'use client'
import axiosInstance from "@/app/utils/axios";
import { useEffect, useState } from "react";
import { HiUsers } from "react-icons/hi2";
import { CardSkeleton } from "./stat-skeletons";

export default function NewUsersCard() {
    const [newUsers, setNewUsers] = useState(0);
    const [percentageChange, setPercentageChange] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await axiosInstance.get("/api/users/");
                const users = response.data;
                
                // Get current date and date one month ago
                const now = new Date();
                const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());

                // Filter users joined this month and last month
                const thisMonthUsers = users.filter(user => new Date(user.date_joined) >= oneMonthAgo);
                const lastMonthUsers = users.filter(user => new Date(user.date_joined) >= twoMonthsAgo && new Date(user.date_joined) < oneMonthAgo);

                // Calculate new users this month
                const newUsersCount = thisMonthUsers.length;

                // Calculate percentage change
                const percentChange = lastMonthUsers.length !== 0
                    ? ((newUsersCount - lastMonthUsers.length) / lastMonthUsers.length) * 100
                    : 100; // If there were no users last month, consider it as 100% increase

                setNewUsers(newUsersCount);
                setPercentageChange(percentChange);
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to fetch users", error);
                setIsLoading(false);
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
                <HiUsers size={30}/>
            </div>
            <div>
                <p className="text-slate-400 text-sm font-medium">New Users</p>
                <p className="text-indigo-900 text-2xl font-bold">{newUsers}</p>
                <p className="text-slate-400 text-xs font-normal">
                    <span className={`${percentageChange >= 0 ? 'text-teal-500' : 'text-red-500'} text-xs font-bold`}>
                        {percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(0)}%
                    </span> since last month
                </p>
            </div>
        </div>
      )}
      </>
    );
}