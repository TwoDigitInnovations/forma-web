import React, { useState, useEffect, useMemo } from 'react';
import { NotebookPen, MapPin, Search, Filter, FileCode2, Eye, Edit, DeleteIcon, Delete, Trash2, X } from 'lucide-react';
import { Api } from '@/services/service';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { ProjectDetailsContext, userContext } from "../_app"
import Table from '../../../components/table';
import ConfirmModal from '../../../components/confirmModel';

const BOQ = (props) => {
  const [projectDetails, setProjectdetails] = useContext(ProjectDetailsContext)
  const [user] = useContext(userContext)
  const router = useRouter();
  const [allBoq, setAllBoq] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [grandTotal, setGrandTotal] = useState("");
  const [checked, setChecked] = useState(false);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 10,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [popUpData, setPopUpData] = useState([])
  const [projectId, SetProjectId] = useState([])
  const [popUpDataTrue, setPopUpDataTrue] = useState(false)
  const [boqId, setBoqId] = useState("")

  useEffect(() => {
    const stored = localStorage.getItem("projectDetails")
    if (stored) {
      const project = JSON.parse(stored)
      setProjectdetails(project)
      getAllBOQ(project._id)
      SetProjectId(project._id)
    }
  }, [])


  const getAllBOQ = async (projectId) => {
    props.loader(true);
    Api("get", `boq/getBoqsByProject/${projectId}`, "", router)
      .then((res) => {
        props.loader(false);
        if (res?.status === true) {
          const withInclude = res.data?.data.map(item => ({
            ...item,
            include: true
          }));
          setAllBoq(withInclude);

        } else {
          toast.error(res?.message || "Failed to created status")
        }
      })
      .catch((err) => {
        props.loader(false);
        toast.error(err?.message || "An error occurred")
      });
  };

  const deleteBoq = async (id) => {
    props.loader(true);
    Api("delete", `boq/deleteBoq/${id}`, "", router)
      .then((res) => {
        props.loader(false);
        if (res?.status === true) {
          toast.success(res?.data?.message || "Boq Deleted Sucessfully")
          getAllBOQ(projectId)
        } else {
          toast.error(res?.message || "Failed to created status")
        }
      })
      .catch((err) => {
        props.loader(false);
        toast.error(err?.message || "An error occurred")
      });
  }

  useEffect(() => {
    if (allBoq && allBoq.length > 0) {
      const grand = allBoq.reduce(
        (sum, item) =>
          item.include && item.quantity && item.rate
            ? sum + item.quantity * item.rate
            : sum,
        0
      );
      setGrandTotal(grand);
    }
  }, [allBoq]);


  const BoqName = ({ value }) => (
    <div className=" flex  justify-center items-center">
      <p className="text-gray-800 text-[16px] font-medium">{value}</p>
    </div>
  );

  const Quantity = ({ value }) => (
    <div className=" flex justify-center items-center">
      <p className="text-gray-800 text-[16px] ">{value}</p>
    </div>
  );

  const rate = ({ value }) => (
    <div className="flex items-center justify-center">
      <p className="text-gray-800 text-[16px] ">{value}</p>
    </div>
  );

  const Include = ({ row }) => (
    <div className="flex items-center justify-center">
      <input
        type="checkbox"
        checked={row.original.include}
        onChange={() => {
          setAllBoq(prev =>
            prev.map(item =>
              item._id === row.original._id
                ? { ...item, include: !item.include }
                : item
            )
          );
        }}
        className={`
        w-5 h-5 rounded-full border-2 cursor-pointer transition-colors
        appearance-none
        ${row.original.include ? "bg-custom-yellow border-custom-yellow" : "border-gray-400 bg-white"}
      `}
      />
    </div>
  );


  const Total = ({ row }) => {
    const total = (row.original?.quantity || 0) * (row.original?.rate || 0);

    return (
      <div className="flex items-center justify-center">
        {total.toFixed(2)}
      </div>
    );
  };



  const renderActions = ({ row }) => (
    <div className="flex items-center justify-center">
      <button
        className="flex items-center px-2 py-2 bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-all cursor-pointer hover:text-[#e0f349]"
        onClick={() => router.push(`/ProjectDetails/Boq/BoqEditor?id=${row.original._id}`)}
      >
        <Edit />
      </button>
      <button
        className="flex items-center px-2 py-2 bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-all cursor-pointer hover:text-[#b2f349]"
        onClick={() => {
          setPopUpData(row.original)
          setPopUpDataTrue(true)
        }}
      >
        <Eye />
      </button>
      <button
        className="flex items-center px-2 py-2 bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-all cursor-pointer hover:text-red-500"
        onClick={() => {
          setIsConfirmModalOpen(true)
          setBoqId(row.original._id)
        }}
      >
        <Trash2 />
      </button>
    </div>
  );

  const columns = useMemo(
    () => [
      {
        Header: "Include",
        Cell: Include,
        width: 20
      },
      {
        Header: "NAME",
        accessor: 'boqName',
        Cell: BoqName,

      },
      {
        Header: "Quantity",
        accessor: 'quantity',
        Cell: Quantity
      },
      {
        Header: "Rate",
        accessor: 'rate',
        Cell: rate,
      },
      {
        Header: "Grand Total",
        // accessor: 'createdAt',
        Cell: Total,
      },

      {
        Header: "ACTIONS",
        Cell: renderActions,
        width: 120
      },
    ],
    []
  );

  return (
    <div className="h-screen bg-black text-white ">
      <div className=" w-full h-full overflow-y-scroll  scrollbar-hide overflow-scroll pb-28 md:p-6 p-4 md:px-8  mx-auto">
        <div className="bg-[#DFF34940] py-6 px-6 flex flex-col rounded-[16px] md:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="md:text-[14px] text-[13px] font-bold text-white  flex items-center gap-2">
                {projectDetails.projectName}
                <span className='ms-4 md:text-[11px] text-[11px] flex justify-center items-center gap-1 '> <MapPin size={15} /> {projectDetails.location}</span>

              </h1>
              <div className='flex items-center-safe gap-3'>
                <p className="md:text-[32px] text-[24px] text-white mt-1">BOQs Document</p>
                <p className="md:text-[14px] text-[13px] text-white mt-1">Total BOQ: {allBoq.length}  Document</p>
              </div>
            </div>

          </div>
          <button className='bg-custom-yellow py-1.5 px-3 text-black gap-1 cursor-pointer rounded-[12px] flex items-center'
            onClick={() => router.push("/ProjectDetails/Boq/BoqEditor")}
          >
            <NotebookPen size={18} />Create New BOQ</button>
        </div>

        <div className="flex items-center gap-3 w-full">
          <div className="relative ">
            <input
              className="ps-10 md:w-[28rem] w-full bg-[#5F5F5F] border-black border text-white rounded-3xl px-4 py-2"
              placeholder="Search"
            />
            <Search className="absolute top-3 left-4 text-gray-300" size={18} />
          </div>
        </div>
        <div>


          <div className="bg-custom-black rounded-xl shadow-sm mt-6">
            {allBoq.length === 0 ? (
              <div className="flex flex-col justify-center items-center min-h-[450px] text-center space-y-2">
                <FileCode2 size={68} />
                <h3 className="text-xl font-medium text-white ">
                  No BOQ Document found
                </h3>
                <p className="text-gray-300">
                  Try adjusting your filters or search terms
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto px-3 md:px-4 pb-10 md:mb-20 mb-10">
                <p className='md:mt-6 mt-4 md:text-2xl text-[20px]'> Project Summary </p>
                <Table
                  columns={columns}
                  data={allBoq}
                  pagination={pagination}
                  onPageChange={(page) => setCurrentPage(page)}
                  currentPage={currentPage}
                  itemsPerPage={pagination.itemsPerPage}
                />
                <div className="flex justify-between items-center">
                  <p className="md:text-[20px] text-[18px]"> Project Grand Total </p>
                  <p className="text-[20px]">
                    ${!isNaN(parseFloat(grandTotal)) ? parseFloat(grandTotal).toFixed(2) : "0.00"}
                  </p>
                </div>

              </div>
            )}
          </div>

          <ConfirmModal
            isOpen={isConfirmModalOpen}
            setIsOpen={setIsConfirmModalOpen}
            title="Delete Boq Document"
            message="Are you sure you want to delete ?"
            onConfirm={() => deleteBoq(boqId)}
            yesText="Yes, Delete"
            noText="Cancel"
          />

          {popUpDataTrue && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
              <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg animate-slideUp relative">
                {/* Close Button */}
                <button
                  onClick={() => setPopUpDataTrue(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-black cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                  {popUpData?.boqName || "BOQ Details"}
                </h2>

                {/* Details in a card format */}
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span className="font-medium">Items:</span>
                    <span>{popUpData?.items?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Created At:</span>
                    <span>{new Date(popUpData?.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Updated At:</span>
                    <span>{new Date(popUpData?.updatedAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Rate:</span>
                    <span>{popUpData?.rate || "-"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default BOQ;


