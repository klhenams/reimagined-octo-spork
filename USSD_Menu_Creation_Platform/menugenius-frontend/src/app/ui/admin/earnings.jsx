'use client'
import { useState } from "react";
import { IoBarChart } from "react-icons/io5";

export default function EarningsCard(){
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    return(
    <div className="flex items-center w-full h-24 bg-white rounded-2xl p-4 gap-4">
        <div className="bg-blue-50 h-14 w-14 rounded-full text-blue-600 flex justify-center items-center">
            <IoBarChart size={30}/>
        </div>
        <div>
            <p className="text-slate-400 text-sm font-medium ">Earnings</p>
            <p className="text-indigo-900 text-2xl font-bold">₵128.50</p>
        </div>
    </div>
)
}