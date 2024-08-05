"use client";
import AdminNotificationBar from "@/app/ui/admin-notification-bar";
import axiosInstance from "@/app/utils/axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";

import { CiExport } from "react-icons/ci";

export default function Page() {
  const [users, setUsers] = useState([]);
  const [sortOrder, setSortOrder] = useState("oldest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axiosInstance.get("/api/users/");
        setUsers(response.data);
      } catch (error) {
        setError("Failed to fecth users");
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <div>
          <p className="text-indigo-900 text-2xl md:text-4xl font-bold">User List</p>
        </div>
        <AdminNotificationBar />
      </div>

      <div className="relative w-full rounded-3xl bg-white p-8 mt-12 h-[75vh]">
        <div className="flex justify-between mb-4">
          <div>
            <p className="font-semibold text-slate-600 text-sm sm:text-xl">All Users</p>
          </div>
          <div className="flex ">
            <SortOptions sortOrder={sortOrder} setSortOrder={setSortOrder}/>
            <CSVLink
              data={sortUsers(users, sortOrder)}
              filename={"MG Users List.csv"}
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md 
            hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 
              transition duration-200"
              target="_blank"
            >
              <CiExport className="inline-block mr-2" size={24} />
              Export
            </CSVLink>
          </div>
        </div>
        <UserTable users={users} sortOrder={sortOrder} error={error} loading={loading} />
      </div>
    </div>
  );
}

const SortOptions = ({ sortOrder, setSortOrder }) => {
  return (
    <div className="flex mr-2">
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className="p-1 rounded bg-gray-200"
      >
        <option value="oldest">Earliest</option>
        <option value="newest">Latest</option>
      </select>
    </div>
  );
};

const sortUsers = (users, sortOrder) => {
  if (sortOrder === "newest") {
    return [...users].reverse();
  }
  return users;
};

export function UserTable({ users, sortOrder, error, loading }) {
  const sortedUsers = sortUsers(users, sortOrder);
  // const [error, setError]= useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const currentUsers = sortedUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Date Joined</th>
          </tr>
        </thead>
        {loading ? (
          <tbody>
            <td colSpan="5">
              <div className="flex justify-center items-center py-20">
                <span className="loading loading-dots loading-lg"></span>
              </div>
            </td>  
        </tbody>
      ) : (
        
        <tbody>
          {currentUsers.map((user, index) => (
            <tr className="hover:bg-gray-50" key={user.id}>
              <th>{(currentPage - 1) * usersPerPage + index + 1}</th>
              <td>{user.email}</td>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>
                {format(new Date(user.date_joined), "MMMM dd, yyyy h:mm a")}
              </td>
            </tr>
          ))}
        </tbody>
      )}
      </table>
      <div className="mt-4 flex justify-end absolute bottom-5 right-5">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 bg-gray-200 rounded"
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 mx-1 ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
