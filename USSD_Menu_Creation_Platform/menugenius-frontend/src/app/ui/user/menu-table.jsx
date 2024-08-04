import axiosInstance from "@/app/utils/axios";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaFolderPlus } from "react-icons/fa6";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi2";
import MenuEditForm from "./menu-edit-form";

export default function UserMenuTable() {
  const [userMenus, setUserMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuToDelete, setMenuToDelete] = useState(null);
  const [menuToEdit, setMenuToEdit] = useState(null);
  const pathname = usePathname();

  const handleDelete = async () => {
    if (menuToDelete) {
      try {
        // Perform the deletion API call
        await axiosInstance.delete(`/api/delete-menu/${menuToDelete.id}/`);
        
        // Update the userMenus state
        setUserMenus(prevMenus => prevMenus.filter(menu => menu.id !== menuToDelete.id));
        
        // Close the modal
        document.getElementById(`modal_${menuToDelete.id}`).close();
        setMenuToDelete(null);
      } catch (error) {
        console.error("Error deleting menu:", error);
        // Handle error (e.g., show an error message to the user)
      }
    }
  };

  const handleEditClick = (menu) => {
    setMenuToEdit(menu);
    document.getElementById('edit-drawer').checked = true;
  };

  const handleEditSuccess = (updatedMenu) => {
    setUserMenus(prevMenus => 
      prevMenus.map(menu => menu.id === updatedMenu.id ? updatedMenu : menu)
    );
    document.getElementById('edit-drawer').checked = false;
    setMenuToEdit(null);
  };

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
    <>
    <div className="overflow-x-auto mt-4 mb-2">
      <table className="table">
        {/* head */}
        <thead className="bg-blue-50">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
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
              <td>
                <div className="flex gap-2 text-slate-700">
                <button className="btn" onClick={() => handleEditClick(userMenu)}>
                      <HiOutlinePencil size={20} />
                    </button>
                  <div>
                    <button
                      className="btn"
                      onClick={() => {
                        setMenuToDelete(userMenu);
                        document.getElementById(`modal_${userMenu.id}`).showModal();
                      }}
                    >
                      <HiOutlineTrash size={20} className="text-red-500"/>
                    </button>
                    <dialog id={`modal_${userMenu.id}`} className="modal">
                      <div className="modal-box">
                        <h3 className="font-bold text-lg">Are you sure you want to delete {userMenu.name}?</h3>
                        <p className="py-4">
                          Deleting this menu will erase all data associated with it. This process cannot be undone.
                        </p>
                        <div className="modal-action">
                          <form method="dialog">
                            <button className="btn">Cancel</button>
                          </form>
                          <button className="btn bg-red-500" onClick={handleDelete}>Delete</button>
                        </div>
                      </div>
                    </dialog>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {/* Edit Drawer */}
    <div className="drawer drawer-end z-10">
    <input id="edit-drawer" type="checkbox" className="drawer-toggle" />
    <div className="drawer-side">
      <label htmlFor="edit-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
      <div className="menu bg-white text-base-content min-h-full w-4/6 sm:w-3/6 p-4">
        {menuToEdit && (
          <MenuEditForm 
            menu={menuToEdit} 
            onSuccess={handleEditSuccess} 
            onCancel={() => {
              document.getElementById('edit-drawer').checked = false;
              setMenuToEdit(null);
            }}
          />
        )}
      </div>
    </div>
  </div>
  </>
  );
}
