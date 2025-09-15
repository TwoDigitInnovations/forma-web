import React, { useState, useEffect } from 'react';
import { Upload, X, Edit, ChevronLeft } from 'lucide-react';
import { Api } from '@/services/service';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { ProjectDetailsContext, userContext } from "../_app"


const EditProject = (props) => {
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    location: '',
    projectType: 'Commercial',
    status: 'Planning',
    contractAmount: '',
    projectBudget: '',
    startDate: '',
    endDate: '',
    clientInfo: {
      contactAmount: '',
      projectBudget: '',
      clientLogo: ''
    },
    contractorInfo: {
      contractorName: '',
      contractorAddress: '',
      contractorLogo: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [projectId, setProjectId] = useState(null);
  const [projectDetails, setProjectdetails] = useContext(ProjectDetailsContext)
  const [user] = useContext(userContext)
  const router = useRouter();

  // useEffect(() => {
  //   if (!router.isReady) return;
  //   const id = router.query.id;
  //   if (id) {
  //     setProjectId(id);
  //   }
  // }, [router.isReady, router.query.id]);

  useEffect(() => {
    const stored = localStorage.getItem("projectDetails")
    if (stored) {
      const project = JSON.parse(stored)
      setProjectdetails(project)
      setProjectId(project._id)
      setFormData({
        projectName: project?.projectName || '',
        description: project?.description || '',
        location: project?.location || '',
        projectType: project?.projectType || 'Commercial',
        status: project?.status || 'Planning',
        contractAmount: project?.contractAmount || '',
        projectBudget: project?.projectBudget || '',
        startDate: project?.startDate || '',
        endDate: project?.endDate || '',
        clientInfo: {
          contactAmount: project?.clientInfo?.contactAmount || '',
          projectBudget: project?.clientInfo?.projectBudget || '',
          clientLogo: project?.clientInfo?.clientLogo || ''
        },
        contractorInfo: {
          contractorName: project?.contractorInfo?.contractorName || '',
          contractorAddress: project?.contractorInfo?.contractorAddress || '',
          contractorLogo: project?.contractorInfo?.contractorLogo || ''
        }
      });
    }
  }, [])

  console.log("projectDetails", projectDetails)
  console.log("formData", formData)

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (type === 'client') {
          setFormData(prev => ({
            ...prev,
            clientInfo: {
              ...prev.clientInfo,
              clientLogo: event.target.result
            }
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            contractorInfo: {
              ...prev.contractorInfo,
              contractorLogo: event.target.result
            }
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStatusUpdate = (status) => {
    setFormData(prev => ({
      ...prev,
      status: status
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.projectName) newErrors.projectName = 'Project name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.contractAmount) newErrors.contractAmount = 'Contract amount is required';
    if (!formData.projectBudget) newErrors.projectBudget = 'Project budget is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.clientInfo.contactAmount) newErrors['clientInfo.contactAmount'] = 'Client contact amount is required';
    if (!formData.clientInfo.projectBudget) newErrors['clientInfo.projectBudget'] = 'Client project budget is required';
    if (!formData.contractorInfo.contractorName) newErrors['contractorInfo.contractorName'] = 'Contractor name is required';
    if (!formData.contractorInfo.contractorAddress) newErrors['contractorInfo.contractorAddress'] = 'Contractor address is required';

    // Validate dates
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (startDate >= endDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!projectId) {
      toast.error("Project ID not found");
      return;
    }

    setLoading(true);
    props.loader(true);

    const data = {
      ...formData,
      userId: user._id,
    };

    Api("put", `project/updateProject/${projectId}`, data, router)
      .then((res) => {
        setLoading(false);
        props.loader(false);

        if (res?.status === true) {
          toast.success("Project updated successfully");

          const updatedProject = res?.data?.data;

          if (updatedProject) {
            localStorage.setItem("projectDetails", JSON.stringify(updatedProject));
          }

          router.push(`/ProjectDetails/overview`);
        } else {
          toast.error(res?.message || "Failed to update project");
        }
      })
      .catch((err) => {
        setLoading(false);
        props.loader(false);
        toast.error(err?.message || "An error occurred");
      });
  };


  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      router.push(`/ProjectDetails/overview`);
    }
  };

  return (
    <div className="h-screen bg-black text-white ">
      <div className=" w-full h-full overflow-y-scroll  scrollbar-hide overflow-scroll pb-28 md:p-6 p-4 md:px-8  mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between ">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="md:text-2xl text-[20px] font-bold text-custom-yellow flex items-center gap-2">
                <Edit size={24} />
                Edit Project Information
              </h1>
              <p className="text-gray-400 mt-1">Update project details, contract information, and stakeholder details</p>
            </div>
          </div>

          <div className="flex flex-wrap  items-center gap-2">
            <span className="text-sm text-gray-400">Quick Status:</span>
            {['Planning', 'In Progress', 'On Hold', 'Completed'].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusUpdate(status)}
                disabled={loading || formData.status === status}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${formData.status === status
                  ? 'bg-custom-yellow text-black'
                  : 'bg-[#5F5F5F] text-gray-300 hover:bg-gray-600'
                  } disabled:cursor-not-allowed`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => router.push(`/ProjectDetails/overview`)}
          className="py-2 md:mt-0 mt-4 flex underline text-sm cursor-pointer rounded-lg transition-colors mb-4 md:mb-8"
        >
          <ChevronLeft size={20} /> Go back
        </button>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-custom-black rounded-[38px] p-6">
            <h2 className="text-xl font-semibold mb-6">Basic Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Project Name</label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  placeholder="Enter your project name"
                  className={`w-full text-[14px] px-4 py-2 bg-[#5F5F5F] rounded-lg border ${errors.projectName ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:border-green-400`}
                />
                {errors.projectName && <p className="text-red-400 text-sm mt-1">{errors.projectName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter your project description"
                  rows="4"
                  className={`w-full text-[14px] px-4 py-2 bg-[#5F5F5F] rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:border-green-400`}
                />
                {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter project location"
                    className={`w-full text-[14px] px-4 py-2 bg-[#5F5F5F] rounded-lg border ${errors.location ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:border-green-400`}
                  />
                  {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Project Type</label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 text-[14px] bg-[#5F5F5F] rounded-lg border border-gray-600 focus:outline-none focus:border-green-400"
                  >
                    <option value="Commercial">Commercial</option>
                    <option value="Residential">Residential</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Infrastructure">Infrastructure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 text-[14px] bg-[#5F5F5F] rounded-lg border border-gray-600 focus:outline-none focus:border-green-400"
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Contract Information */}
          <div className="bg-custom-black rounded-[38px] p-6">
            <h2 className="text-xl font-semibold mb-6">Contract Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Contract Amount ($)</label>
                <input
                  type="number"
                  name="contractAmount"
                  value={formData.contractAmount}
                  onChange={handleInputChange}
                  placeholder="100000"
                  className={`w-full px-4 py-2 bg-[#5F5F5F] rounded-lg border ${errors.contractAmount ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:border-green-400`}
                />
                {errors.contractAmount && <p className="text-red-400 text-sm mt-1">{errors.contractAmount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Project Budget ($)</label>
                <input
                  type="number"
                  name="projectBudget"
                  value={formData.projectBudget}
                  onChange={handleInputChange}
                  placeholder="120000"
                  className={`w-full px-4 py-2 bg-[#5F5F5F] rounded-lg border ${errors.projectBudget ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:border-green-400`}
                />
                {errors.projectBudget && <p className="text-red-400 text-sm mt-1">{errors.projectBudget}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-[#5F5F5F] rounded-lg border ${errors.startDate ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:border-green-400`}
                />
                {errors.startDate && <p className="text-red-400 text-sm mt-1">{errors.startDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-[#5F5F5F] rounded-lg border ${errors.endDate ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:border-green-400`}
                />
                {errors.endDate && <p className="text-red-400 text-sm mt-1">{errors.endDate}</p>}
              </div>
            </div>
          </div>

          {/* Stakeholder Information */}
          <div className="bg-custom-black rounded-[38px] p-6">
            <h2 className="text-xl font-semibold mb-6">Stakeholder Information</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Client Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Client Information</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Contact Amount ($)</label>
                    <input
                      type="number"
                      name="clientInfo.contactAmount"
                      value={formData.clientInfo.contactAmount}
                      onChange={handleInputChange}
                      placeholder="50000"
                      className={`w-full px-4 py-2 bg-[#5F5F5F] rounded-lg border ${errors['clientInfo.contactAmount'] ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:border-green-400`}
                    />
                    {errors['clientInfo.contactAmount'] && <p className="text-red-400 text-sm mt-1">{errors['clientInfo.contactAmount']}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Project Budget ($)</label>
                    <input
                      type="number"
                      name="clientInfo.projectBudget"
                      value={formData.clientInfo.projectBudget}
                      onChange={handleInputChange}
                      placeholder="100000"
                      className={`w-full px-4 py-2 bg-[#5F5F5F] rounded-lg border ${errors['clientInfo.projectBudget'] ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:border-green-400`}
                    />
                    {errors['clientInfo.projectBudget'] && <p className="text-red-400 text-sm mt-1">{errors['clientInfo.projectBudget']}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Client Logo</label>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-[#5F5F5F] border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                        {formData.clientInfo.clientLogo ? (
                          <img src={formData.clientInfo.clientLogo} alt="Client Logo" className="w-full h-full object-cover" />
                        ) : (
                          <Upload size={24} className="text-gray-400" />
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'client')}
                          className="w-full"
                          id="clientLogo"
                        />

                        {formData.clientInfo.clientLogo && (
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              clientInfo: { ...prev.clientInfo, clientLogo: '' }
                            }))}
                            className="ml-2 p-1 text-red-400 hover:text-red-300"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contractor Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Contractor Information</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Contractor Name</label>
                    <input
                      type="text"
                      name="contractorInfo.contractorName"
                      value={formData.contractorInfo.contractorName}
                      onChange={handleInputChange}
                      placeholder="ABC Construction Co."
                      className={`w-full px-4 py-2 bg-[#5F5F5F] rounded-lg border ${errors['contractorInfo.contractorName'] ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:border-green-400`}
                    />
                    {errors['contractorInfo.contractorName'] && <p className="text-red-400 text-sm mt-1">{errors['contractorInfo.contractorName']}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Contractor Address</label>
                    <textarea
                      name="contractorInfo.contractorAddress"
                      value={formData.contractorInfo.contractorAddress}
                      onChange={handleInputChange}
                      placeholder="Some Street, Any Road, Pincode - 123456"
                      rows="3"
                      className={`w-full px-4 py-2 bg-[#5F5F5F] rounded-lg border ${errors['contractorInfo.contractorAddress'] ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:border-green-400`}
                    />
                    {errors['contractorInfo.contractorAddress'] && <p className="text-red-400 text-sm mt-1">{errors['contractorInfo.contractorAddress']}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Contractor Logo</label>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-[#5F5F5F] border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                        {formData.contractorInfo.contractorLogo ? (
                          <img src={formData.contractorInfo.contractorLogo} alt="Contractor Logo" className="w-full h-full object-cover" />
                        ) : (
                          <Upload size={24} className="text-gray-400" />
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'contractor')}
                          className="w-full"
                          id="contractorLogo"
                        />

                        {formData.contractorInfo.contractorLogo && (
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              contractorInfo: { ...prev.contractorInfo, contractorLogo: '' }
                            }))}
                            className="ml-2 p-1 text-red-400 hover:text-red-300"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-center gap-4 items-center pt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-[14px] bg-custom-yellow text-black cursor-pointer  disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 cursor-pointer py-2 text-[14px] bg-gray-600 hover:bg-[#5F5F5F] rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProject;