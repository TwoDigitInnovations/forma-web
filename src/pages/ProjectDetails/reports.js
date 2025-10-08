import React, { useState, useEffect } from 'react';
import { Upload, X, Edit, ChevronLeft, NotebookPen, LocateFixedIcon, MapPin, Puzzle, ChartNoAxesCombined } from 'lucide-react';
import { Api } from '@/services/service';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { ProjectDetailsContext, userContext } from "../_app"
import isAuth from '../../../components/isAuth';


const reports = (props) => {
  const [projectDetails, setProjectdetails] = useContext(ProjectDetailsContext)
  const [user] = useContext(userContext)
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("projectDetails")
    if (stored) {
      const project = JSON.parse(stored)
      setProjectdetails(project)
    }
  }, [])

  console.log("projectDetails", projectDetails)

  return (
    <div className="h-screen bg-black text-white ">
      <div className="w-full h-full overflow-y-scroll  scrollbar-hide overflow-scroll pb-28 md:p-6 p-4 md:px-8  mx-auto">

        <div className="bg-[#DFF34940] py-6 px-6 flex flex-col rounded-[16px] md:flex-row gap-4 items-center justify-between ">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="md:text-[14px] text-[13px] font-bold text-white  flex items-center gap-2">
                {projectDetails.projectName}
                <span className='ms-4 md:text-[11px] text-[11px] flex justify-center items-center gap-1 '> <MapPin size={15} /> {projectDetails.location}</span>

              </h1>
              <p className="md:text-[32px] text-[24px] text-white mt-1">Reports</p>
            </div>

          </div>
          <button className='bg-custom-yellow py-1.5 px-3 text-black gap-1 rounded-[12px] flex items-center'>
            <NotebookPen size={18} />Create Reports</button>
        </div>

   
        <div className='min-h-[500px] flex flex-col items-center justify-center bg-[#18181b] rounded-xl mt-8 shadow-lg'>
          <div className="bg-custom-yellow rounded-full p-4 mb-4">
            <ChartNoAxesCombined size={48} className="text-black" />
          </div>
          <p className="text-[14px] font-semibold text-white ">No Reports created yet.</p>
          <p className="text-[14px] text-custom-yellow mb-1">Create your first Reports to get started.</p>
          <button className="bg-custom-yellow hover:bg-yellow-400 text-black font-bold py-2 px-6 rounded-lg mt-2 flex items-center gap-2 shadow">
            <NotebookPen size={20} /> Create Reports
          </button>
        </div>

      </div>
    </div>
  );
};

export default isAuth(reports);