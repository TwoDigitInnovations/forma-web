import React, { useState, useEffect } from 'react';
import { Upload, X, Edit, ChevronLeft, NotebookPen, LocateFixedIcon, MapPin, Puzzle } from 'lucide-react';
import { Api } from '@/services/service';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { ProjectDetailsContext, userContext } from "../_app"
import isAuth from '../../../components/isAuth';


const budget = (props) => {
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
      <div className=" w-full md:h-[90vh] overflow-y-scroll  scrollbar-hide overflow-scroll pb-28 md:p-6 p-4 md:px-8  mx-auto">

        <div className="bg-[#DFF34940] py-4 px-6 flex flex-col rounded-[16px] md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap items-center md:gap-4 gap-1">
            <p className="md:text-[32px] text-[24px] text-white mt-1">Budget</p>
            <h1 className="md:text-[14px] text-[13px] font-bold text-white flex items-center gap-2">
              {projectDetails.projectName}
              <span className="ms-4 md:text-[11px] text-[11px] flex justify-center items-center gap-1">
                <MapPin size={15} /> {projectDetails.location}
              </span>
            </h1>
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 mt-8">
          {/* Total Budget Card */}
          <div className="bg-[#27272a] rounded-lg p-6 border border-[#3f3f46]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Total Budget</p>
              <NotebookPen size={20} className="text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-1">$0.00</h2>
            <p className="text-xs text-gray-500">Allocated for project</p>
          </div>

          {/* Spent Amount Card */}
          <div className="bg-[#27272a] rounded-lg p-6 border border-[#3f3f46]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Spent Amount</p>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-1">$0.00</h2>
            <p className="text-xs text-gray-500">0.0% of total budget</p>
          </div>

          {/* Remaining Budget Card */}
          <div className="bg-[#27272a] rounded-lg p-6 border border-[#3f3f46]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Remaining Budget</p>
              <span className="text-gray-400">$</span>
            </div>
            <h2 className="text-3xl font-bold text-green-500 mb-1">$0.00</h2>
            <p className="text-xs text-gray-500">Available to spend</p>
          </div>
        </div>


        <div className="bg-[#27272a] rounded-lg p-6 border border-[#3f3f46] mb-8">
          <h3 className="text-xl font-semibold text-white mb-2">Budget Utilization</h3>
          <p className="text-sm text-gray-400 mb-6">Visual representation of budget usage</p>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Utilization</span>
              <span className="text-sm font-semibold text-green-500">0.0%</span>
            </div>
            <div className="w-full bg-[#3f3f46] rounded-full h-3 overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: '0%' }}></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Spent</p>
              <p className="text-2xl font-bold text-white">$0.00</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Remaining</p>
              <p className="text-2xl font-bold text-white">$0.00</p>
            </div>
          </div>
        </div>


        <div className="bg-[#27272a] rounded-lg p-6 border border-[#3f3f46]">
          <h3 className="text-xl font-semibold text-white mb-2">Expense Tracking</h3>
          <p className="text-sm text-gray-400 mb-8">Detailed expense records and tracking</p>

          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-gray-600 mb-4">
              <span className="text-6xl">$</span>
            </div>
            <h4 className="text-lg font-medium text-gray-400 mb-2">Expense tracking coming soon</h4>
            <p className="text-sm text-gray-500 text-center">
              This section will display detailed expense records and categories
            </p>
          </div>
        </div>


      </div>
    </div>
  );
};

export default isAuth(budget);