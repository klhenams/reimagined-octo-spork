import { HiSearch } from "react-icons/hi";
import { BiBell } from "react-icons/bi";
import { FaMoon } from "react-icons/fa6";
import { IoMdInformationCircleOutline } from "react-icons/io";
import Link from "next/link";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import { useRouter } from "next/navigation";

function SmallNotificationBar({ userInitial, handleClick }) {
  return (
    <div className=" bg-white rounded-3xl shadow">
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="m-1">
          <div className="avatar online placeholder">
            <div className="bg-neutral text-neutral-content w-10 rounded-full">
              <span className="text-xl">{userInitial}</span>
            </div>
          </div>
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[20] w-52 p-2 shadow"
        >
          <li>
            <Link href="/dashboard/settings/general">Settings</Link>
          </li>
          <li>
            <button onClick={handleClick}>Logout</button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function NotificationBar() {
  const [user, setUser] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get('/api/user/');
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const userInitial = user && user.first_name ? user.first_name[0].toUpperCase() : '';
  const handleClick = () => {
    localStorage.removeItem('userAccessToken');
    localStorage.removeItem('userRefreshToken');
    router.push('/auth/login')
  }

  return (
    <>
      <div className="md:hidden">
        <SmallNotificationBar userInitial={userInitial} handleClick={handleClick} />
      </div>
      <div className="hidden md:flex w-96 h-12 bg-white rounded-3xl shadow items-center px-4 justify-between">
        <div className="w-52 h-8 bg-blue-50 rounded-3xl flex justify-start items-center px-4 gap-2">
          <HiSearch />
          <input
            type="search"
            placeholder="Search"
            className="w-full text-slate-400 text-sm font-normal bg-blue-50 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-1">
          <BiBell size={24} className="text-slate-400" />
          <FaMoon size={24} className="text-slate-400" />
          <IoMdInformationCircleOutline size={24} className="text-slate-400" />
        </div>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="m-1">
            <div className="avatar online placeholder">
              <div className="bg-neutral text-neutral-content w-10 rounded-full">
                <span className="text-xl">{userInitial}</span>
              </div>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[20] w-52 p-2 shadow"
          >
            <li>
              <Link href="/dashboard/settings/general">Settings</Link>
            </li>
            <li>
              <button onClick={handleClick}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}