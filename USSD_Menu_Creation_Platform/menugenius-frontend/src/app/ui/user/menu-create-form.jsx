"use client";
import axiosInstance from "@/app/utils/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MenuCreateForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  // const [menuId, setMenuId] = useState(0);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await axiosInstance.post("/api/create-menu/", {
        name: name,
        description: description,
      });
      if (response.status === 201) {
        setSuccess("Menu created succesfully");
        const menuId = response.data.id;
        console.log(menuId);
        router.push(`dashboard/flow/${menuId}/`);
      }
    } catch (error) {
      if (error.response.status === 401) {
        setError("Error creating menu, Try again Later");
      }
    }
  };

  const handleCancel = () => {
    setName("");
    setDescription("");
    setError("")
    setSuccess("")
    document.getElementById('my-drawer-4').checked = false;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="h-12 font-semibold text-lg mb-4">{name}</div>
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
          placeholder="New Flow"
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
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="This flow helps users to..."
          className="w-full h-36 border border-stone-500/30 rounded-sm px-4 focus:outline-none focus:border-blue-700/45"
          required
        />
      </div>

      <div className="w-full flex justify-between gap-3 fixed bottom-5">
        <button
          type="button"
          onClick={handleCancel}
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
