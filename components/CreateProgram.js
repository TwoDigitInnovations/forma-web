import React, { useEffect, useState } from "react";
import { Api } from "@/services/service";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const CreateProgram = ({
  setIsOpen,
  refreshList,
  loader,
  programDetails,
  editId,
}) => {
  const [name, setName] = useState("");
  const router = useRouter();
  console.log(editId);

  useEffect(() => {
    console.log(programDetails);
    if (programDetails) {
      setName(programDetails.name);
    }
  }, [programDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Program name is required");
      return;
    }

    loader(true);
    const url = editId ? `program/update/${editId}` : `program/create`;
    Api(
      "post",
      url,
      {
        name: name,
      },
      router,
    )
      .then((res) => {
        loader(false);
        if (res?.status === true) {
          toast.success("Program created successfully");
          setName("");
          setIsOpen(false);
          refreshList(); // parent list refresh
        } else {
          toast.error(res?.message || "Failed to create program");
        }
      })
      .catch((err) => {
        loader(false);
        toast.error(err?.message || "Something went wrong");
      });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#2a2a2a] rounded-2xl w-[400px] p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-white">
          {editId ? "Update" : "Create"} Program
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-300">Program Name</label>
            <input
              type="text"
              placeholder="Enter program name"
              className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white outline-none focus:border-[#e0f349]"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg font-medium"
              style={{ backgroundColor: "#e0f349", color: "#1e1e1e" }}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProgram;
