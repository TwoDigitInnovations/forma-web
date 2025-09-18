import React, { useState, useEffect } from 'react';
import { NotebookPen, MapPin, Search, Filter, FileCode2 } from 'lucide-react';
import { Api } from '@/services/service';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { ProjectDetailsContext, userContext } from "../_app"

const BOQ = (props) => {
  const [projectDetails, setProjectdetails] = useContext(ProjectDetailsContext)
  const [user] = useContext(userContext)
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [allBoq, setAllBoq] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("projectDetails")
    if (stored) {
      const project = JSON.parse(stored)
      setProjectdetails(project)
      getAllBOQ(project._id)
    }
  }, [])


  const getAllBOQ = async (projectId) => {
    props.loader(true);
    Api("get", `boq/getBoqsByProject/${projectId}`, "", router)
      .then((res) => {
        props.loader(false);
        if (res?.status === true) {
          // setAllBoq(res.data?.data)
          console.log(res.data?.data)
        } else {
          toast.error(res?.message || "Failed to created status")
        }
      })
      .catch((err) => {
        props.loader(false);
        toast.error(err?.message || "An error occurred")
      });
  };


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
                <p className="md:text-[14px] text-[13px] text-white mt-1">Total BOQ: 3 Document</p>
              </div>
            </div>

          </div>
          <button className='bg-custom-yellow py-1.5 px-3 text-black gap-1 cursor-pointer rounded-[12px] flex items-center'
            onClick={() => router.push("/ProjectDetails/Boq/BoqEditor")}
          >
            <NotebookPen size={18} />Create New BOQ</button>
        </div>

        <div className="flex items-center gap-3 w-full">
          {/* Search Box */}
          <div className="relative ">
            <input
              className="ps-10 md:w-[22rem] w-full bg-[#5F5F5F] border-black border text-white rounded-3xl px-4 py-2"
              placeholder="Search"
            />
            <Search className="absolute top-3 left-4 text-gray-300" size={18} />
          </div>

          {/* Filter Button */}
          <button className="bg-[#5F5F5F] text-white rounded-[50px] px-10 py-2 text-[14px] flex justify-center items-center gap-1">
            Filter <Filter size={18} />
          </button>
        </div>
        <div>

         
            <div className="bg-custom-black rounded-xl shadow-sm  mt-6">
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
                <div className="overflow-x-auto px-6">
                  {/* <Table
                    // columns={columns}
                    data={allBoq}
                  // pagination={pagination}
                  // onPageChange={(page) => setCurrentPage(page)}
                  // currentPage={currentPage}
                  // itemsPerPage={pagination.itemsPerPage}
                  /> */}
                </div>
              )}
            </div>
         
        </div>
      </div>
    </div>
  );
};

export default BOQ;


