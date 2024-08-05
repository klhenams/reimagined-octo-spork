import axiosInstance from "@/app/utils/axios";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaFolderPlus } from "react-icons/fa6";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi2";

export default function UserResponseMenuTable() {
  const [userMenus, setUserMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const pathname = usePathname();

  const getHref = (id) => {
    if (pathname === '/dashboard') {
      return `/dashboard/flow/${id}`;
    } else if (pathname === '/dashboard/responses') {
      return `/dashboard/responses/${id}`;
    }
  };

  useEffect(() => {
    const fetchUserMenus = async () => {
      try {
        const response = await axiosInstance.get("/api/user-menus/");
        setUserMenus(response.data);
      } catch (error) {
        setError("Failed to fetch menus, Try again later");
      } finally {
        setLoading(false);
      }
    };

    fetchUserMenus();
  }, []);

  if (loading) return <div className="flex justify-center items-center py-20"><span className="loading loading-dots loading-lg"></span></div>;
  if (error) return <div className="text-red-500">{error}</div>;

  if (userMenus.length === 0) {
    return (
      <div className="mt-20 flex justify-center">
        <div className="h-80 w-80 bg-blue-50 rounded-full text-slate-500 flex flex-col justify-center items-center p-4">
          <FaFolderPlus size={72} />
          <div className="text-center">
            <p className="text-md font-bold ">No menus to show yet</p>
            <p className="text-xs font-semibold">
              Use the <span className="text-blue-700">&apos;Create +&apos;</span> button
              to add a new menu
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto mt-4 mb-2">
      <table className="table">
        {/* head */}
        <thead className="bg-blue-50">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th className="w-3/6">Description</th>
          </tr>
        </thead>

        <tbody>
          {userMenus.map((userMenu, index) => (
            <tr className="hover:bg-gray-100" key={userMenu.id}>
              <th>{index + 1}</th>
              <td>
                <Link href={getHref(userMenu.id)}>
                  <div className="block">{userMenu.name}</div>
                </Link>
              </td>
              <td>
                <Link href={getHref(userMenu.id)}>
                  <div className="block">{userMenu.description}</div>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
