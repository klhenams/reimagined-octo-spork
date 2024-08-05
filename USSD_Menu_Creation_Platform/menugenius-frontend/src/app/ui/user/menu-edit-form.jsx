import { useState, useEffect } from 'react';
import axiosInstance from "@/app/utils/axios";

export default function MenuEditForm({ menu, onSuccess, onCancel }) {
  const [name, setName] = useState(menu.name);
  const [description, setDescription] = useState(menu.description);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setName(menu.name);
    setDescription(menu.description);
  }, [menu]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await axiosInstance.put(`/api/edit-menu/${menu.id}/`, {
        name: name,
        description: description,
      });
      if (response.status === 200) {
        setSuccess("Menu updated successfully");
        onSuccess(response.data);
      }
    } catch (error) {
      setError("Error updating menu. Please try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="h-12 font-semibold text-lg mb-4">Edit Menu: {name}</div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <label className="text-slate-600 space-y-1">
        <p className="font-semibold">Name</p>
        <p className="font-normal">A memorable menu name</p>
      </label>
      <div className="mb-4 mt-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-12 border border-stone-500/30 rounded-sm px-4 focus:outline-none focus:border-blue-700/45"
          required
        />
      </div>
      <label className="text-slate-600 space-y-1">
        <p className="font-semibold">Description</p>
        <p className="font-normal">A summary of flow objective</p>
      </label>
      <div className="mb-2 mt-2">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-36 border border-stone-500/30 rounded-sm px-4 focus:outline-none focus:border-blue-700/45"
          required
        />
      </div>

      <div className="w-full flex justify-between gap-3 fixed bottom-5">
        <button
          type="button"
          onClick={onCancel}
          className="w-1/2 h-8 bg-red-600 rounded-sm text-white text-md font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-1/2 h-8 bg-blue-700 rounded-sm text-white text-md font-medium"
        >
          Save
        </button>
      </div>
    </form>
  );
}