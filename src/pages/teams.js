import React, { useState } from 'react';
import { Search, Eye, Edit } from 'lucide-react';
import isAuth from '../../components/isAuth';
const TeamMembers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const teamMembersData = [
    {
      id: 1,
      name: "John Doe",
      email: "johndoe@gmail.com",
      role: "Project Manager",
      avatar: "/api/placeholder/60/60",
      roleColor: "#4ade80"
    },
    {
      id: 2,
      name: "Selena Martinez",
      email: "selenamartinez@gmail.com",
      role: "Site Supervisor",
      avatar: "/api/placeholder/60/60",
      roleColor: "#06b6d4"
    },
    {
      id: 3,
      name: "Josh",
      email: "josh@gmail.com",
      role: "Lead Architect",
      avatar: "/api/placeholder/60/60",
      roleColor: "#06b6d4"
    },
    {
      id: 4,
      name: "Lisa Rodriguez",
      email: "lisarodriguez@gmail.com",
      role: "Electrical Engineer",
      avatar: "/api/placeholder/60/60",
      roleColor: "#06b6d4"
    },
    {
      id: 5,
      name: "David Kim",
      email: "davidkim@gmail.com",
      role: "Engineer",
      avatar: "/api/placeholder/60/60",
      roleColor: "#06b6d4"
    },
    {
      id: 6,
      name: "Emily Watson",
      email: "emilywatson@gmail.com",
      role: "Safety Coordinator",
      avatar: "/api/placeholder/60/60",
      roleColor: "#06b6d4"
    }
  ];

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Project Manager':
        return '#4ade80';
      case 'Site Supervisor':
        return '#06b6d4';
      case 'Lead Architect':
        return '#06b6d4';
      case 'Electrical Engineer':
        return '#06b6d4';
      case 'Engineer':
        return '#06b6d4';
      case 'Safety Coordinator':
        return '#06b6d4';
      default:
        return '#6b7280';
    }
  };

  const generateAvatar = (name) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    const colors = ['#4ade80', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];
    const color = colors[name.length % colors.length];

    return (
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
        style={{ backgroundColor: color }}
      >
        {initials}
      </div>
    );
  };

  return (
    <div className="min-h-screen p-3 md:p-6 bg-black text-white" >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#e0f349' }}>
            Team Members
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your construction team and roles.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search team members"
            className="w-full pl-12 pr-4 py-2 rounded-[30px] border border-gray-600 focus:border-gray-500 focus:outline-none"
            style={{ backgroundColor: '#2a2a2a', color: 'white' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembersData.map((member) => (
            <div
              key={member.id}
              className="rounded-[12px] border border-gray-700 p-6 hover:border-gray-600 transition-colors"
              style={{ backgroundColor: '#1E1E1E' }}
            >

              <div className="flex items-start gap-4 mb-4">
                {generateAvatar(member.name)}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    {member.email}
                  </p>
                </div>
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium text-white"
                  style={{
                    backgroundColor: "#5AC6AE80",
                  }}
                >
                  {member.role}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors flex-1"
                  style={{ backgroundColor: '#333333' }}
                >
                  <Eye size={16} />
                  <span className="text-sm">View</span>
                </button>
                <button
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors flex-1"
                  style={{ backgroundColor: '#333333' }}
                >
                  <Edit size={16} />
                  <span className="text-sm">Edit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default isAuth(TeamMembers);