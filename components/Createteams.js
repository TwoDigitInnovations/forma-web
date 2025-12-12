import React, { useContext, useEffect, useState } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { userContext } from "@/pages/_app";
import InputField from "./UI/InputField";

const CreateTeamMember = ({ onclose, getAllMembers, editData }) => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    AssignProject:""
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData?.name,
        email: editData?.email,
        phone: editData?.phone,
      });
    }
  }, [editData]);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      role: "TeamsMember",
    };

    try {
      const res = await Api("post", "auth/register", payload, router);
      setLoading(false);

      if (res?.status) {
        toast.success("Team member created successfully!");
        setIsOpen(false);
        getAllMembers(); // refresh list
      } else {
        toast.error(res?.message || "Failed to create member");
      }
    } catch (err) {
      setLoading(false);
      toast.error(err?.message || "An error occurred");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-custom-black text-white rounded-[38px] p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-1">
          {editData?._id ? "Update" : "Add"} Team Member
        </h2>
        <p className="text-sm text-gray-300 mb-4">
          Fill in the details to create a new team member.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
            required
          />
          <InputField
            label="Phone no."
            name="phone"
            type="number"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter Phone no."
            required
          />

          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="member@example.com"
            required
          />
          {!editData?.password && (
            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min 6 characters"
              required
            />
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onclose}
              className="px-5 py-2 rounded-xl cursor-pointer bg-gray-800 hover:bg-gray-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 cursor-pointer bg-custom-yellow text-black rounded-xl  hover:scale-105 transition"
            >
              {editData?._id ? "Update" : "Create"} Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeamMember;
