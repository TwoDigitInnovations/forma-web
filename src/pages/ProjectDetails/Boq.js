import React, { useState, useEffect, useMemo } from 'react';
import { NotebookPen, MapPin, Search, Filter, FileCode2, Eye, Edit, DeleteIcon, Delete, Trash2, X } from 'lucide-react';
import ConfirmModal from '../../../components/confirmModel';
import { Api } from '@/services/service';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { ProjectDetailsContext, userContext } from "../_app"

const BOQ = (props) => {
  const [allBoq, setAllBoq] = useState([]);
  const [projectDetails, setProjectdetails] = useContext(ProjectDetailsContext)
  const [user] = useContext(userContext)
  const router = useRouter();
  const [showTax, setShowTax] = useState(false);
  const [showContingency, setShowContingency] = useState(false);
  const [showSubtotal, setShowSubtotal] = useState(false);
  const [showGrandTotal, setShowGrandTotal] = useState(false);
  const [taxRate, setTaxRate] = useState(15);
  const [contingencyRate, setContingencyRate] = useState(15);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [popUpData, setPopUpData] = useState([]);
  const [projectId, SetProjectId] = useState([]);
  const [popUpDataTrue, setPopUpDataTrue] = useState(false);
  const [boqId, setBoqId] = useState("");

  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 10,
  });

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


  const subtotal = useMemo(() => {
    return allBoq.reduce(
      (sum, item) =>
        item.include && item.quantity && item.rate
          ? sum + item.quantity * item.rate
          : sum,
      0
    );
  }, [allBoq]);


  const taxAmount = showTax ? (subtotal * taxRate) / 100 : 0;
  const contingencyAmount = showContingency ? (subtotal * contingencyRate) / 100 : 0;
  const subtotalWithAdditions = subtotal + taxAmount + contingencyAmount;
  const finalGrandTotal = subtotalWithAdditions;

  const formatCurrency = (num) =>
    num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const onToggleTax = () => setShowTax(!showTax);
  const onToggleContingency = () => setShowContingency(!showContingency);
  const onToggleSubtotal = () => setShowSubtotal(!showSubtotal);


  const BoqName = ({ value }) => (
    <div className="flex justify-center items-center">
      <p className="text-white text-[16px] font-medium">{value}</p>
    </div>
  );

  const Quantity = ({ value }) => (
    <div className="flex justify-center items-center">
      <p className="text-white text-[16px]">{value}</p>
    </div>
  );

  const Rate = ({ value }) => (
    <div className="flex items-center justify-center">
      <p className="text-white text-[16px]">${value}</p>
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
          ${row.original.include ? "bg-yellow-400 border-yellow-400" : "border-gray-400 bg-white"}
        `}
      />
    </div>
  );

  const Total = ({ row }) => {
    const total = (row.original?.quantity || 0) * (row.original?.rate || 0);
    return (
      <div className="flex items-center justify-center">
        ${total.toFixed(2)}
      </div>
    );
  };

  const renderActions = ({ row }) => (
    <div className="flex items-center justify-center gap-1">
      <button
        className="flex items-center px-2 py-2 rounded-lg hover:bg-yellow-50 transition-all cursor-pointer hover:text-yellow-600"
        onClick={() => router.push(`/ProjectDetails/Boq/BoqEditor?id=${row.original._id}`)}
      >
        <Edit size={18} />
      </button>
      <button
        className="flex items-center px-2 py-2 rounded-lg hover:bg-green-50 transition-all cursor-pointer hover:text-green-600"
        onClick={() => {
          setPopUpData(row.original);
          setPopUpDataTrue(true);
        }}
      >
        <Eye size={18} />
      </button>
      <button
        className="flex items-center px-2 py-2 rounded-lg hover:bg-red-50 transition-all cursor-pointer hover:text-red-500"
        onClick={() => {
          setIsConfirmModalOpen(true);
          setBoqId(row.original._id);
        }}
      >
        <Trash2 size={18} />
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
        Cell: Rate,
      },
      {
        Header: "Total",
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
    <div className="h-full bg-black text-white p-3 md:p-6">
      <div className="max-w-7xl w-full h-full overflow-y-scroll  scrollbar-hide overflow-scroll pb-28 mx-auto">
        {/* Header */}
        <div className="bg-custom-green md:p-6 p-4 flex flex-col rounded-[16px] md:flex-row gap-4 items-center justify-between mb-6">
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

        {/* Search */}
        <div className="mb-6 ">
          <div className="relative">
            <input
              className="ps-10 w-full md:w-96 bg-gray-700 border-gray-600 text-white rounded-full px-4 py-2"
              placeholder="Search"
            />
            <Search className="absolute top-3 left-4 text-gray-300" size={18} />
          </div>
        </div>

        <div className='md:p-6 p-3 rounded-xl bg-custom-black '>
          <div className="flex flex-col md:flex-row md:justify-between ">
            <p className="md:text-2xl text-xl mb-2">Project Summary</p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Add Subtotal', toggle: onToggleSubtotal, active: showSubtotal },
                { label: 'Add Tax', toggle: onToggleTax, active: showTax },
                { label: 'Add Contingency', toggle: onToggleContingency, active: showContingency },
              ].map((btn, i) => (
                <button
                  key={i}
                  onClick={btn.toggle}
                  className={`px-4 py-2 text-sm md:text-md rounded-lg font-medium transition-colors ${btn.active
                    ? 'bg-custom-yellow text-gray-900'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                  + {btn.label}
                </button>
              ))}
              <button className="px-6 py-2 text-sm md:text-md bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors">
                Download PDF
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto ">
            {allBoq.length === 0 ? (
              <div className="flex flex-col justify-center items-center min-h-[450px] text-center space-y-2">
                <FileCode2 size={68} />
                <h3 className="text-xl font-medium text-white">No BOQ Document found</h3>
                <p className="text-gray-300">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="mt-4 ">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      {columns.map((col, i) => (
                        <th key={i} className="px-4 py-3 text-left text-white font-semibold">
                          {col.Header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>

                    {allBoq.map((row, rowIndex) => (
                      <tr key={row._id} className="border-b border-gray-700 text-white">
                        {columns.map((col, colIndex) => (
                          <td key={colIndex} className="py-3 text-white md:pr-22 pr-10">
                            {col.Cell ? (
                              <col.Cell value={row[col.accessor]} row={{ original: row }} />
                            ) : (
                              row[col.accessor]
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}

                    {/* Summary Rows */}
                    {showTax && (
                      <tr className=" border-b border-gray-600">

                        <td className="px-4 py-3" colSpan="3">
                          <span className="font-bold text-blue-400">TAX</span>
                        </td>


                        <td className="px-4 py-3 text-white">${formatCurrency(subtotal)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={taxRate}
                              onChange={(e) => setTaxRate(Number(e.target.value))}
                              className="w-16 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-center text-white"
                            />
                            <span className="text-white">%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-semibold text-white" colSpan="1">
                          ${formatCurrency(taxAmount)}
                        </td>
                      </tr>
                    )}

                    {showContingency && (
                      <tr className=" border-b border-gray-600">
                        <td className="px-4 py-3" colSpan="3">
                          <span className="font-bold text-blue-400">CONTINGENCY</span>
                        </td>
                       
                        <td className="px-4 py-3 text-white">${formatCurrency(subtotal)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={contingencyRate}
                              onChange={(e) => setContingencyRate(Number(e.target.value))}
                              className="w-16 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-center text-white"
                            />
                            <span className="text-white">%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-semibold text-white" colSpan="1">
                          ${formatCurrency(contingencyAmount)}
                        </td>
                      </tr>
                    )}

                    {showSubtotal && (
                      <tr className="bg-blue-900/30 border-b border-blue-700">
                        <td className="px-4 py-3" colSpan="5">
                          <span className="font-bold text-blue-300 text-lg">SUBTOTAL</span>
                        </td>
                        <td className="px-4 py-3 font-bold text-blue-300 text-lg" colSpan="1">
                          ${formatCurrency(subtotalWithAdditions)}
                        </td>
                      </tr>
                    )}

                  </tbody>
                </table>

                <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-700">
                  <p className="md:text-xl text-md font-semibold">Project Grand Total</p>
                  <p className="text-xl font-bold text-yellow-400">
                    ${formatCurrency(finalGrandTotal)}
                  </p>
                </div>
              </div>
            )}
          </div>
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg relative">
              <button
                onClick={() => setPopUpDataTrue(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                {popUpData?.boqName || "BOQ Details"}
              </h2>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span className="font-medium">Quantity:</span>
                  <span>{popUpData?.quantity || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">items:</span>
                  <span>{popUpData?.items?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Rate:</span>
                  <span>${popUpData?.rate || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Total:</span>
                  <span>${((popUpData?.quantity || 0) * (popUpData?.rate || 0)).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BOQ;