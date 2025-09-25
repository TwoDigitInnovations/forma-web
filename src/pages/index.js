import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from "next/router";
import { Api } from '@/services/service';
import { toast } from 'react-toastify';
import { FastForward, Plus, Boxes, DollarSign, Pencil, TrendingUp, Archive, Building, HandCoins, Users, CheckCircle, Activity, Handshake, CircleCheck, Pickaxe } from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  Tooltip as RechartsTooltip
} from "recharts";

import isAuth from '../../components/isAuth';
import { userContext } from './_app';

function Home(props) {
  const router = useRouter();
  const [user, setUser] = useContext(userContext);
  const [AllData, setAllData] = useState({});
  const [salesData, setSalesData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  // Mock data for demo
  const mockActivityData = [
    { title: "Foundation work completed ahead of schedule", status: "3 days ago", type: "completed" },
    { title: "Plumbing installation completed for floors 1-5", status: "5 days ago", type: "completed" },
    { title: "Electrical work completed for floors 1-3", status: "1 week ago", type: "completed" },
    { title: "Structural assessment completed", status: "2 weeks ago", type: "Pending" },
    { title: "Structural assessment completed", status: "2 weeks ago", type: "completed" },
    { title: "Structural assessment completed", status: "2 weeks ago", type: "completed" }
  ];

  const mockUpcomingTasks = [
    { name: "Structural Assessment", progress: 70, priority: "Critical", color: "#22c55e" },
    { name: "Balcony Installation", progress: 45, priority: "High", color: "#eab308" },
    { name: "Electrical Wiring", progress: 60, priority: "Medium", color: "#22c55e" },
    { name: "Roofing Work", progress: 30, priority: "Due Soon", color: "#eab308" },
    { name: "Painting", progress: 20, priority: "Due Soon", color: "#eab308" },
    { name: "Electrical Wiring Phase 2", progress: 5, priority: "On Track", color: "#22c55e" }
  ];

  const mockTeamData = [
    { name: "John Martinez", role: "Project Manager", tasksCompleted: 12, color: "#22c55e" },
    { name: "Sarah Chen", role: "Site Supervisor", tasksCompleted: 9, color: "#22c55e" },
    { name: "Mike Johnson", role: "Lead Architect", tasksCompleted: 6, color: "#22c55e" }
  ];

  const mockRecentProjects = [
    { name: "Project 1", progress: 80 },
    { name: "Project 2", progress: 65 },
    { name: "Project 3", progress: 100 },
    { name: "Project 4", progress: 45 },
    { name: "Project 5", progress: 90 },
    { name: "Project 6", progress: 100 },
    { name: "Project 7", progress: 75 }
  ];

  return (
    <section className=" bg-[#000000] md:p-6 p-3 text-white h-screen">
      <div className="max-w-7xl mx-auto h-full space-y-6 overflow-y-scroll scrollbar-hide overflow-scroll pb-28 ">
        {/* Header */}
        <div className="flex items-center justify-between md:mt-0 mt-4">
          <h1 className='text-3xl font-bold text-custom-yellow'>Dashboard</h1>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DarkStatsCard
            title="Active Projects"
            value="2"
            subtitle="+10% from last month"
            icon={<Building size={55} />}
            accentColor="#22c55e"
          />
          <DarkStatsCard
            title="Team Members"
            value="6"
            subtitle="+8% from last month"
            icon={<Handshake size={55} />}
            accentColor="#22c55e"
          />
          <DarkStatsCard
            title="Completion Rate"
            value="20%"
            subtitle="+3% of engagement"
            icon={<CircleCheck size={55} />}
            accentColor="#22c55e"
          />
          <div className="row-span-2 bg-custom-black rounded-xl p-4 border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-custom-yellow font-semibold">Recent Projects</h3>
              <button className="text-custom-yellow text-sm hover:text-yellow-300">View All</button>
            </div>
            <div className="space-y-3">
              {mockRecentProjects.map((project, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">{project.name}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-400 w-10">{project.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 md:col-span-2 bg-custom-black rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Recent Activity</h3>
              <button className="text-custom-yellow text-sm hover:text-yellow-300">View All</button>
            </div>
            <div className="space-y-4">
              {mockActivityData.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Pickaxe className="text-custom-yellow mt-1" />
                  <div className="flex w-full justify-between items-center">
                    <p className="text-gray-300 text-sm">{activity.title}</p>
                    <p className="text-green-500 text-xs bg-green-500/20 px-2 py-1 rounded">
                      {activity.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>


          <div className=" mt-8 bg-custom-black rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Revenue</h3>
            <div className="flex items-center justify-center h-48">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full border-8 border-gray-700"></div>
                <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-yellow-400 transform rotate-45"></div>
                <div className="absolute inset-4 bg-gray-900 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-bold text-custom-yellow">65%</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-4">
              <p className="text-gray-400 text-sm">Achieved Revenue: $245.7M</p>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className="bg-custom-black rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Upcoming Tasks</h3>
              <button className="text-custom-yellow text-sm hover:text-yellow-300">View All</button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {mockUpcomingTasks.map((task, index) => (
                <div key={index} className="space-y-1.5 flex justify-between">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium">{task.name}</span>
                    {/* <span className="text-xs text-gray-400">{task.progress}%</span> */}
                  </div>
                  <div className="w-[180px] flex flex-col justify-start bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${task.progress}%`,
                        backgroundColor: task.color
                      }}
                    ></div>
                  </div>
                  <span
                    className="text-xs px-2 py-1 rounded text-white"
                    style={{ backgroundColor: task.color + '40', color: task.color }}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-custom-black rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Team Performance</h3>
              <button className="text-custom-yellow text-sm hover:text-yellow-300">View All</button>
            </div>
            <div className="space-y-4">
              {mockTeamData.map((member, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <img src="./man.jpg" className='h-12 w-12 object-cover rounded-full' />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{member.name}</p>
                    <p className="text-gray-400 text-xs">{member.role}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-sm">{member.tasksCompleted}</p>
                    <p className="text-gray-400 text-xs">Tasks Completed</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default isAuth(Home);

const DarkStatsCard = ({ title, value, subtitle, icon }) => {
  return (
    <div className="flex flex-col w-full relative gap-10">
      <div className="bg-custom-black  rounded-2xl p-4 border border-gray-700 hover:border-gray-600 transition-colors mb-3 z-10">
        <div className="flex items-start justify-between p-2 rounded-lg">
          <div >
            {icon}
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">{title}</p>
            <p className="text-3xl font-bold text-white mt-1 text-right">{value}</p>
          </div>
        </div>
      </div>
      <div className=" w-full bg-custom-yellow flex justify-center items-center rounded-2xl p-2 border border-gray-700 z-10 hover:border-gray-600 transition-colors mb-3 absolute top-22 md:top-24 right-1/2 translate-x-1/2">
        <p className="w-[180px] md:text-[12px] text-[14px] text-center mt-1 bg-[#5F5F5F] p-1 rounded-2xl">
          {subtitle}
        </p>
      </div>

    </div>
  );
};