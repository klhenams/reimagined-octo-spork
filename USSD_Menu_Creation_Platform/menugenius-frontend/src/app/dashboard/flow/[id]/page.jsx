"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosInstance from "@/app/utils/axios";
import TopNavBar from "@/app/ui/user/flow/top-nav";
import ErrorModal from "@/app/ui/error/ErrorModal";
import USSDPreview from "@/app/ui/user/flow/USSD-Preview";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Flow() {
  const router = useRouter();
  const { id: menuId } = useParams();
  const [menuOptions, setMenuOptions] = useState([]);
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newOption, setNewOption] = useState({
    name: "",
    value: "",
    expects_input: false,
  });
  const [editingOption, setEditingOption] = useState(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  useEffect(() => {
    fetchMenuData();
    fetchMenuOptions();
  }, [menuId]);

  const fetchMenuData = async () => {
    try {
      const response = await axiosInstance.get(`/api/menu/${parseInt(menuId)}`);
      setMenuData(response.data);
    } catch (error) {
      setError(`Error fetching menu data`);
    }
  };

  const fetchMenuOptions = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/menu-options/${parseInt(menuId)}`
      );
      setMenuOptions(response.data);
    } catch (error) {
      setError(`Error fetching menu options`);
    } finally {
      setLoading(false);
    }
  };

  const createMenuOption = async (parentId = null) => {
    if (!newOption.name.trim()) {
      setError("Menu option name is required");
      return;
    }
    try {
      await axiosInstance.post(`/api/create-menu-option/${menuId}/`, {
        ...newOption,
        parent_option: parentId,
        menu: menuId,
      });
      fetchMenuOptions();
      setNewOption({ name: "", value: "", expects_input: false });
    } catch (error) {
      setError(`Error creating menu option`);
    }
  };

  const updateMenuOption = async (optionId) => {
    try {
      await axiosInstance.put(
        `/api/edit-menu-option/${menuId}/${optionId}/`,
        editingOption
      );
      fetchMenuOptions();
      setEditingOption(null);
    } catch (error) {
      setError(`Error updating menu option`);
    }
  };

  const deleteMenuOption = async (optionId) => {
    try {
      await axiosInstance.delete(
        `/api/delete-menu-option/${menuId}/${optionId}/`
      );
      fetchMenuOptions();
    } catch (error) {
      setError(`Error deleting menu option`);
    }
  };

  const renderMenuOptions = (options, parentId = null, level = 0) => {
    return options
      .filter((option) => option.parent_option === parentId)
      .map((option) => (
        <div
          key={option.id}
          className={`mb-4 ${level > 0 ? "ml-2 sm:ml-6" : ""}`}
        >
          <div className="bg-white shadow-md rounded-lg p-3 sm:p-4 border-l-4 border-blue-500">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
              <div className="mb-2 sm:mb-0">
                <span className="font-semibold text-base sm:text-lg">
                  {option.name}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  ({option.value})
                </span>
              </div>
              <div className="flex flex-wrap items-center">
                {option.expects_input && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                    Expects Input
                  </span>
                )}
                <button
                  onClick={() => setEditingOption(option)}
                  className="text-blue-500 hover:text-blue-700 mr-2 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteMenuOption(option.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
            {renderMenuOptions(options, option.id, level + 1)}
            <button
              onClick={() => createMenuOption(option.id)}
              className="mt-2 bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded transition duration-300"
            >
              Add Sub-Option
            </button>
          </div>
        </div>
      ));
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <TopNavBar menuId={menuId} menuName={menuData?.name || "Loading..."} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:mt-12 mt-24">
        <div className="lg:col-span-2">
          <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Add New Option
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex-grow sm:flex sm:space-x-4 space-y-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={newOption.name}
                  onChange={(e) =>
                    setNewOption({ ...newOption, name: e.target.value })
                  }
                  className="border rounded p-2 w-full sm:flex-1"
                  required
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={newOption.value}
                  onChange={(e) =>
                    setNewOption({ ...newOption, value: e.target.value })
                  }
                  className="border rounded p-2 w-full sm:flex-1"
                />
              </div>
              <div className="flex items-center justify-between sm:justify-end space-x-4">
                <label className="flex items-center whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={newOption.expects_input}
                    onChange={(e) =>
                      setNewOption({
                        ...newOption,
                        expects_input: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">Expects Input</span>
                </label>
                <button
                  onClick={() => createMenuOption()}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded transition duration-300 w-full sm:w-auto"
                >
                  Add Option
                </button>
              </div>
            </div>
          </div>

          {editingOption && (
            <div className="bg-yellow-50 shadow-md rounded-lg p-4 sm:p-6 mb-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">
                Edit Option
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <input
                  type="text"
                  value={editingOption.name}
                  onChange={(e) =>
                    setEditingOption({ ...editingOption, name: e.target.value })
                  }
                  className="border rounded p-2 w-full sm:w-auto"
                />
                <input
                  type="text"
                  value={editingOption.value}
                  onChange={(e) =>
                    setEditingOption({
                      ...editingOption,
                      value: e.target.value,
                    })
                  }
                  className="border rounded p-2 w-full sm:w-auto"
                />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingOption.expects_input}
                    onChange={(e) =>
                      setEditingOption({
                        ...editingOption,
                        expects_input: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">Expects Input</span>
                </label>
                <button
                  onClick={() => updateMenuOption(editingOption.id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition duration-300 w-full sm:w-auto"
                >
                  Update Option
                </button>
              </div>
            </div>
          )}

          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              Menu Flow
            </h2>
            {renderMenuOptions(menuOptions)}
          </div>
        </div>

        <div className={`lg:col-span-1 transition-all duration-300 ease-in-out ${
    isPreviewVisible ? 'translate-x-0' : 'translate-x-full'
  } fixed top-2 right-0 bottom-0 w-full max-w-sm z-50 lg:sticky lg:top-4 lg:h-[calc(100vh-6rem)] lg:translate-x-0 overflow-y-auto`}>
    <div className="h-full flex items-center justify-center">
      <div className="mockup-phone sticky">
        <div className="camera"></div>
        <div className="display">
          <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 artboard artboard-demo phone-1">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              USSD Preview
            </h2>
            <USSDPreview menuOptions={menuOptions} menuData={menuData} />
          </div>
        </div>
      </div>
    </div>
  </div>

  <button
    className="fixed top-1/2 right-0 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-l-md shadow-md z-50 lg:hidden h-32 flex items-center"
    onClick={() => setIsPreviewVisible(!isPreviewVisible)}
  >
    {isPreviewVisible ? (
      <FaChevronRight className="text-xl" />
    ) : (
      <FaChevronLeft className="text-xl" />
    )}
  </button>
      </div>

      <ErrorModal
        isOpen={!!error}
        onClose={() => setError(null)}
        title="Ooops...😐 An Error occurred"
        message={error}
        actionText="Back to dashboard"
        actionLink="/dashboard"
      />
    </div>
  );
}
