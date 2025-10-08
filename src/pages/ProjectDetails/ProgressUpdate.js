import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { ProjectDetailsContext, userContext } from "../_app"
import isAuth from '../../../components/isAuth';

const ProgressUpdate = (props) => {
  const [projectDetails, setProjectdetails] = useContext(ProjectDetailsContext)

  useEffect(() => {
    const stored = localStorage.getItem("projectDetails")
    if (stored) {
      const project = JSON.parse(stored)
      setProjectdetails(project)
    }
  }, [])

  return (
    <div className="h-screen bg-black text-white ">
      <div className=" w-full h-full overflow-y-scroll  scrollbar-hide overflow-scroll pb-28 md:p-6 p-4 md:px-8  mx-auto">

        <div className="bg-[#DFF34940] py-6 px-6 flex flex-col rounded-[16px] md:flex-row gap-4 items-center justify-between ">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="md:text-[14px] text-[13px] font-bold text-white  flex items-center gap-2">
                {projectDetails.projectName}
                <span className='ms-4 md:text-[11px] text-[11px] flex justify-center items-center gap-1 '> <MapPin size={15} /> {projectDetails.location}</span>

              </h1>
              <p className="md:text-[32px] text-[24px] text-white mt-1">Progress Update</p>
            </div>

          </div>
          {/* <button className='bg-custom-yellow py-1.5 px-3 text-black gap-1 rounded-[12px] flex items-center'> 
            <NotebookPen size={18}/>Create New Work Plan</button> */}
        </div>
      </div>
    </div>
  );
};

export default isAuth(ProgressUpdate);