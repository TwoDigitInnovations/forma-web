import React, { useContext, useEffect, useState, useMemo } from "react";
import moment from "moment";
import { FileCode2, MapPin, NotebookPen, Edit, Trash2 } from "lucide-react";
import { ProjectDetailsContext } from "../_app";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import AddChecklistForm from "../../../components/CreateItem";
import { toast } from "react-toastify";
import Table from "../../../components/table";
import { ConfirmModal } from "../../../components/AllComponents";

function PreConstruction(props) {
  const router = useRouter();
  const [projectDetails, setProjectdetails] = useContext(ProjectDetailsContext);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [allCheckListItem, setAllCheckListItem] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState("");

  const [stats, setStats] = useState({
    total: 0,
    submitted: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    if (!allCheckListItem || allCheckListItem.length === 0) return;

    const total = allCheckListItem.length;

    const submitted = allCheckListItem.filter(
      (item) => item.status === "Submitted"
    ).length;
    const pending = allCheckListItem.filter(
      (item) => item.status === "Pending"
    ).length;
    const approved = allCheckListItem.filter(
      (item) => item.status === "Approved"
    ).length;
    const rejected = allCheckListItem.filter(
      (item) => item.status === "Rejected" || item.status === "Expired"
    ).length;

    setStats({
      total,
      submitted,
      pending,
      approved,
      rejected,
    });
  }, [allCheckListItem]);

  useEffect(() => {
    const stored = localStorage.getItem("projectDetails");
    if (stored) {
      const project = JSON.parse(stored);
      setProjectdetails(project);
      setProjectId(project._id);
    }
  }, []);

  const getAllChecklist = async () => {
    if (!projectId) return;

    Api("get", `checklist/getAllByProject/${projectId}`)
      .then((res) => {
        if (res?.status === true) {
          setAllCheckListItem(res?.data.data || []);
        }
      })
      .catch(() => toast.error("Failed to fetch checklist items"));
  };

  useEffect(() => {
    if (projectId) getAllChecklist();
  }, [projectId]);

  const handleDelete = () => {
    props.loader(true);
    Api("delete", `checklist/delete/${deleteId}`)
      .then((res) => {
        if (res?.status === true) {
          toast.success("Item deleted");
          getAllChecklist();
        } else {
          toast.error("Failed to delete item");
        }
        props.loader(false);
      })
      .catch(() => {
        props.loader(false);
        toast.error("Error deleting item");
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Item Name",
        accessor: "itemName",
        Cell: ({ value }) => (
          <p className="text-black text-[15px] font-semibold text-center truncate">
            {value || "—"}
          </p>
        ),
      },
      {
        Header: "Deadline",
        accessor: "deadline",
        Cell: ({ value }) => (
          <p className="text-gray-700 text-center text-[14px] font-medium">
            {value ? moment(value).format("DD MMM YYYY") : "—"}
          </p>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span
            className={`min-w-[120px] px-4 py-1 rounded-full text-sm font-semibold text-center inline-block 
            ${
              value === "Approved"
                ? "bg-green-100 text-green-700"
                : value === "Submitted"
                ? "bg-blue-100 text-blue-700"
                : value === "Rejected"
                ? "bg-red-100 text-red-700"
                : value === "Expired"
                ? "bg-gray-300 text-gray-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Responsible Party",
        accessor: "responsibleParty",
        Cell: ({ value }) => (
          <p className="text-center text-[15px] text-gray-800">
            {value || "—"}
          </p>
        ),
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex items-center justify-center gap-3">
            {/* EDIT */}
            <button
              onClick={() => {
                setEditItem(row.original);
                setIsOpen(true);
              }}
              className="p-2 cursor-pointer rounded-md hover:bg-yellow-100 hover:text-yellow-700"
            >
              <Edit size={18} />
            </button>

            {/* DELETE */}
            <button
              className="p-2 rounded-md cursor-pointer hover:bg-red-100 hover:text-red-500"
              onClick={() => {
                setIsConfirmOpen(true);
                setDeleteId(row.original._id);
              }}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const StatsCard = ({ label, value, color }) => {
    return (
      <div className="bg-custom-black rounded-xl shadow-sm p-5 flex flex-col items-start w-full">
        <p className="text-gray-100 text-sm">{label}</p>
        <p
          className={`text-2xl font-semibold mt-1`}
          style={{ color: color || "#fff" }}
        >
          {value}
        </p>
      </div>
    );
  };
  return (
    <div className="h-screen bg-black text-white">
      <div className="w-full h-[90vh] overflow-y-scroll scrollbar-hide pb-28 md:p-6 p-4 md:px-8">
        {/* HEADER */}
        <div className="bg-[#DFF34940] py-4 px-6 flex md:flex-row flex-col gap-4 rounded-[16px] justify-between items-center">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-2xl">Documents Checklist</p>

            <h1 className="text-[14px] font-bold flex items-center gap-2">
              {projectDetails?.projectName}
              <span className="text-[11px] flex items-center gap-1">
                <MapPin size={15} /> {projectDetails?.location}
              </span>
            </h1>
          </div>

          <button
            onClick={() => {
              setEditItem(null);
              setIsOpen(true);
            }}
            className="bg-custom-yellow py-1.5 px-4 rounded-[12px] flex items-center gap-1 text-black hover:bg-yellow-400 cursor-pointer"
          >
            <NotebookPen size={18} />
            Create Item
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-5">
          <StatsCard label="Total Items" value={stats.total} />

          <StatsCard label="Pending" value={stats.pending} color="#fff" />

          <StatsCard
            label="Submitted"
            value={stats.submitted}
            color="#c28807"
          />

          <StatsCard label="Approved" value={stats.approved} color="#1aa34a" />

          <StatsCard
            label="Rejected/Expired"
            value={stats.rejected}
            color="#d11a1a"
          />
        </div>
        
        <div className="bg-custom-black py-5 mt-5 rounded-2xl px-5">
          <p className="text-md font-medium">
            Track required documents and approvals before project commencement{" "}
          </p>
          {allCheckListItem.length === 0 ? (
            <div className="flex flex-col justify-center items-center min-h-[400px] text-center">
              <FileCode2 size={68} />
              <h3 className="text-xl font-medium mt-2">
                No Checklist Items Found
              </h3>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table columns={columns} data={allCheckListItem} />
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <AddChecklistForm
          setIsOpen={setIsOpen}
          projectId={projectId}
          loader={props.loader}
          getAllChecklist={getAllChecklist}
          editItem={editItem} // <-- FOR EDIT MODE
        />
      )}
      <ConfirmModal
        isOpen={isConfirmOpen}
        setIsOpen={setIsConfirmOpen}
        title="Delete Item"
        message={`Are you sure you want to delete this item`}
        onConfirm={handleDelete}
        yesText="Delete"
        noText="Cancel"
      />
    </div>
  );
}

export default PreConstruction;
