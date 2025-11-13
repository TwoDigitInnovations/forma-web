import React, { useEffect, useState } from 'react';
import { ChevronLeft, MapPin, Clock, ChevronDown, Image, FolderPlus, Volleyball, BookText, NotebookPen, Clock1, CircleAlert, TriangleAlert } from 'lucide-react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { Api } from '@/services/service';
import { useContext } from 'react';
import { ProjectDetailsContext } from "../_app"
import isAuth from '../../../components/isAuth';


const ProjectDetailsPage = (props) => {

  const router = useRouter()
  const [projectDetails, setProjectdetails] = useContext(ProjectDetailsContext)
  const [projectData, setProjectData] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem("projectDetails");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed._id === router.query.id) {
        setProjectdetails(parsed);
        setProjectData(parsed);
      }
    }
  }, [router.query.id]);

  useEffect(() => {
    if (!router.isReady) return;
    const id = router.query.id;
    if (id && !projectDetails?._id) {
      getProjectbyId(id);
    }
  }, [router.isReady, router.query.id, projectDetails]);


  const getProjectbyId = async (id) => {
    props.loader(true);
    Api("get", `project/getProjectById/${id}`, "", router)
      .then((res) => {
        props.loader(false);
        if (res?.status === true) {
          setProjectData(res.data?.data);
          setProjectdetails(res.data?.data);
          // update localStorage also
          localStorage.setItem("projectDetails", JSON.stringify(res.data?.data));
        }
      })
      .catch((err) => {
        props.loader(false);
        toast.error(err?.message || "An error occurred");
      });
  };

  function formatTodayDate(d) {
    const date = new Date(d);
    if (isNaN(date)) return "Invalid Date";

    const day = date.getDate(), year = date.getFullYear();
    const month = date.toLocaleString("en-US", { month: "long" });
    const suffix = (n) => (n > 3 && n < 21) ? "th" : ["st", "nd", "rd"][n % 10 - 1] || "th";

    return `${day}${suffix(day)} ${month}, ${year}`;
  }


  const formatSimpleDate = d => {
    const date = new Date(d);
    return isNaN(date) ? "Invalid Date" :
      `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
  };

  function getTotalDuration(start, end) {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate) || isNaN(endDate)) return 0;

    const diffTime = endDate - startDate; // milliseconds
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // convert to days
    return diffDays;
  }


  return (
    <div className="h-screen bg-black text-white ">
      <div className="max-w-7xl mx-auto w-full h-full md:h-[85vh] overflow-y-scroll  scrollbar-hide overflow-scroll pb-28 p-3 md:p-6">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="md:text-2xl text-[20px] font-bold text-[#e0f349]">Project overview</h1>
            <button
              onClick={() => router.push(`/project`)}
              className="py-2 flex underline text-sm cursor-pointer rounded-lg transition-colors"
            >
              <ChevronLeft size={20} /> Go back
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="flex bg-custom-gold text-black items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm md:text-md hover:opacity-80 transition-opacity"
              onClick={() => router.push(`/ProjectDetails/EditProject`)}
            >
              <FolderPlus size={28} />
              Edit Project
            </button>
          </div>
        </div>

        <div className=" mb-6 relative overflow-hidden grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-custom-green p-6 flex flex-col  justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">{projectDetails.projectName}</h2>
              <div className="flex  items-center gap-6 text-gray-300">
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span className='text-xs'>{projectDetails.projectName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span className='text-xs'>Last Updated: {formatSimpleDate(projectDetails?.updatedAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className='text-xs'>💰 Budget: ${projectDetails.projectBudget}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 w-full flex justify-start items-start gap-4">
              <div className="bg-[#5AC6AE] text-white px-3 py-1 rounded-full text-xs font-medium mb-2">
                {projectDetails?.status}
              </div>
              <div className="text-right flex-1">

                <div className="w-full bg-gray-700 rounded-full h-5 overflow-hidden">

                  <div
                    className="bg-[#e0f349] h-5 rounded-full transition-all duration-500"
                    style={{ width: `${80}%` }}
                  ></div>
                </div>


                <span className="text-2xl font-bold text-[#e0f349] mt-2 inline-block">
                  80%
                </span>
              </div>

            </div>
          </div>
          <div className="rounded-2xl bg-custom-black p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Actions</h2>
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-2 bg-[#DFF349] text-black px-4 py-1.5 rounded-lg font-medium hover:opacity-80 cursor-pointer text-[15px]"
                onClick={() => router.push(`/ProjectDetails/ManagePhotos`)}
              >
                Manage Photos
                <Image size={18} />
              </button>

              <button className="flex items-center gap-2 bg-[#DFF349] text-black px-4 py-1.5 rounded-lg font-medium hover:opacity-80 cursor-pointer text-[15px]"
                onClick={() => router.push("/ProjectDetails/work-plan")}
              >
                Work Plan
                <NotebookPen size={18} />
              </button>
            </div>
          </div>
        </div>


        <div className="bg-[#2a2a2a] rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">Project Statistics</h3>
          <div className="grid grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">0</div>
              <div className="text-gray-400">Total Task</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">0</div>
              <div className="text-gray-400">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">0</div>
              <div className="text-gray-400">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">0</div>
              <div className="text-gray-400">High Priority</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[250px]">

          <div className="lg:col-span-2 bg-[#2a2a2a] rounded-2xl ">
            <div className="flex items-center justify-between mb-6 rounded-tl-2xl rounded-tr-2xl bg-custom-green px-4 py-4">
              <h3 className="text-xl font-semibold text-white">Project Scope</h3>
              <button className="flex items-center gap-2 text-white underline cursor-pointer"
                onClick={() => router.push("/ProjectDetails/EditProjectSocpe")}
              >
                <span>View More</span>
                <ChevronDown size={16} />
              </button>
            </div>

            <div className="space-y-6 px-6 pb-6">
              <div
                className="text-white prose max-w-none"
                dangerouslySetInnerHTML={{ __html: projectDetails?.ProjectScope || '<p class="text-gray-500">No content to preview...</p>' }}
              />
            </div>
          </div>

          <div className="bg-[#2a2a2a] rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Recent Tasks</h3>
            <div className="text-center text-gray-400 mt-20">
              <div className="text-sm">No tasks found on this project</div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6'>
          <div className=' bg-[#2a2a2a] rounded-2xl min-h-[250px] p-4'>
            <div className='flex flex-col justify-start items-start'>
              <div className='flex justify-start items-start gap-2 space-y-2'>
                <Clock1 className='text-custom-yellow' />
                <p className='text-white text-md'> Milestones</p>
              </div>
              <p className='text-white text-sm'>Upcoming and overdue</p>
            </div>

            <div className='min-h-[170px] flex justify-center items-center'>
              <p className='text-white text-md'> No milestones due soon</p>
            </div>
          </div>
          <div className=' bg-[#2a2a2a] rounded-2xl min-h-[250px] p-4'>
            <div className='flex flex-col justify-start items-start'>
              <div className='flex justify-start items-start gap-2 space-y-2'>
                <TriangleAlert className='text-custom-yellow' />
                <p className='text-white text-md'> Overdue Action Points</p>
              </div>
              <p className='text-white text-sm'>Missed deadlines</p>
            </div>

            <div className='min-h-[170px] flex justify-center items-center'>
              <p className='text-white text-md'>No overdue action points</p>
            </div>
          </div>
          <div className=' bg-[#2a2a2a] rounded-2xl min-h-[250px] p-4'>
            <div className='flex flex-col justify-start items-start'>
              <div className='flex justify-start items-start gap-2 space-y-2'>
                <CircleAlert className='text-custom-yellow' />
                <p className='text-white text-md'>Critical Safety Issues</p>
              </div>
              <p className='text-white text-sm'>Open high-priority</p>
            </div>

            <div className='min-h-[170px] flex justify-center items-center'>
              <p className='text-white text-md'> No critical issues</p>
            </div>
          </div>
        </div>

        <div className="bg-custom-black rounded-2xl  mt-6">
          <div className='bg-custom-green p-6 rounded-tl-2xl rounded-tr-2xl'>
            <h3 className="text-xl font-semibold text-white ">Project Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">

            <div>
              <h4 className="text-white font-semibold mb-4">Contract Details</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white">Contract Amount</span>
                  <span className="text-white">$ {projectDetails?.clientInfo?.contactAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">Duration</span>
                  <span className="text-white"> {getTotalDuration(projectDetails?.startDate, projectDetails?.endDate)} Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">Start Date</span>
                  <span className="text-white">{formatTodayDate(projectDetails?.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">End Date</span>
                  <span className="text-white">{formatTodayDate(projectDetails?.endDate)}</span>
                </div>
              </div>
            </div>

            {/* Contractor Details */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contractor Details</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-white">Name</div>
                  <div className="text-white"> {projectDetails?.contractorInfo?.contractorName}</div>
                </div>
                <div>
                  <div className="text-white">Email</div>
                  <div className="text-white">{projectDetails?.contractorInfo?.Email}</div>
                </div>
                <div>
                  <div className="text-white">Phone</div>
                  <div className="text-white">{projectDetails?.contractorInfo?.phone}</div>
                </div>
              </div>
            </div>

            {/* Employer Details */}
            <div>
              <h4 className="text-white font-semibold mb-4">Clients Details</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-white">Name</div>
                  <div className="text-white">{projectDetails?.clientInfo?.ClientName}</div>
                </div>
                <div>
                  <div className="text-white">Address</div>
                  <div className="text-white">{projectDetails?.clientInfo?.Address}</div>
                </div>
                <div>
                  <div className="text-white">Phone</div>
                  <div className="text-white">{projectDetails?.clientInfo?.phone}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default isAuth(ProjectDetailsPage);