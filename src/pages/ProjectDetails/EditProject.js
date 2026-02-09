import React, { useState, useEffect } from "react";
import { Upload, X, Edit, ChevronLeft } from "lucide-react";
import { Api } from "@/services/service";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useContext } from "react";
import { ProjectDetailsContext, userContext } from "../_app";
import InputField from "../../../components/UI/InputField";
import SelectField from "../../../components/UI/SelectField";
import ClientProjectInfo from "../../../components/ClientProjectInfo";
import ContractorProjectInfo from "../../../components/ContractorProjectInfo";
import IntroductionInfo from "../../../components/IntroductionInfo";
import moment from "moment";

const EditProject = (props) => {
  const [formData, setFormData] = useState({
    projectName: "",
    projectNo: "",
    description: "",
    location: "",
    projectType: "Road",
    status: "Planning",
    contractAmount: "",
    startDate: "",
    endDate: "",
    LiabilityPeriod: "",
    Duration: "",
    ProjectScope: "",
    ExcuetiveSummary: "",
    LocationSummary: "",
  });
  const [clientDetails, setClientDetails] = useState({
    ClientName: "",
    Email: "",
    phone: "",
    contactPerson: "",
    Address: "",
    ClientLogo: "",
    teamMembers: [],
  });
  const [contractorDetails, setContractorDetails] = useState({
    contractorName: "",
    Email: "",
    phone: "",
    contactPerson: "",
    contractorLogo: "",
    teamMembers: [],
    equipment: [],
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showCancelBox, setShowCancelBox] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentTab, setCurrentTab] = useState("basicInfo");
  const [projectId, setProjectId] = useState(null);
  const [projectDetails, setProjectdetails] = useContext(ProjectDetailsContext);
  const [user] = useContext(userContext);

  useEffect(() => {
    const stored = localStorage.getItem("projectDetails");
    if (stored) {
      const project = JSON.parse(stored);
      setProjectId(project._id);
      getProjectbyId(project._id);
    }
  }, []);

  function dateFormet(date) {
    if (!date) return "";
    return moment(date).format("YYYY-MM-DD");
  }

  useEffect(() => {
    if (formData.startDate && formData.Duration) {
      const calculatedEnd = moment(formData.startDate)
        .add(Number(formData.Duration), "months")
        .format("YYYY-MM-DD");
      setFormData((prev) => ({ ...prev, endDate: calculatedEnd }));
    }
  }, [formData.startDate, formData.Duration]);

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const durationMonths = moment(formData.endDate).diff(
        moment(formData.startDate),
        "months",
        true,
      );
      setFormData((prev) => ({
        ...prev,
        Duration: Math.max(1, Math.ceil(durationMonths)),
      }));
    }
  }, [formData.endDate]);

  const getProjectbyId = async (id) => {
    props.loader(true);
    Api("get", `project/getProjectById/${id}`, "", router)
      .then((res) => {
        props.loader(false);
        if (res?.status === true) {
          const project = res.data?.data;
          setProjectdetails(project);
          setFormData({
            projectName: project?.projectName || "",
            description: project?.description || "",
            location: project?.location || "",
            projectType: project?.projectType || "",
            status: project?.status || "Planning",
            contractAmount: project?.contractAmount || "",
            startDate: project?.startDate || "",
            endDate: project?.endDate || "",
            projectNo: project?.projectNo || "",
            Duration: project?.Duration || "",
            LiabilityPeriod: project?.LiabilityPeriod || "",
            LocationSummary: project?.LocationSummary || "",
            ProjectScope: project?.ProjectScope || "",
            ExcuetiveSummary: project?.ExcuetiveSummary || "",
          });
          const contracter = project?.contractorInfo;
          setContractorDetails({
            contractorName: contracter?.contractorName,
            Email: contracter?.Email,
            phone: contracter?.phone,
            contactPerson: contracter?.contactPerson,
            contractorLogo: contracter?.contractorLogo,
            teamMembers: contracter?.teamMembers,
            equipment: contracter?.equipment,
          });
          const clients = project?.clientInfo;
          setClientDetails({
            ClientName: clients?.ClientName,
            Email: clients?.Email,
            phone: clients?.phone,
            contactPerson: clients?.contactPerson,
            Address: clients?.Address,
            ClientLogo: clients?.ClientLogo,
            teamMembers: clients?.teamMembers,
          });

          localStorage.setItem("projectDetails", JSON.stringify(project));
        }
      })
      .catch((err) => {
        props.loader(false);
        toast.error(err?.message || "An error occurred");
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleStatusUpdate = (status) => {
    setFormData((prev) => ({
      ...prev,
      status: status,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.projectName)
      newErrors.projectName = "Project name is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.contractAmount)
      newErrors.contractAmount = "Contract amount is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (startDate >= endDate) {
        newErrors.endDate = "End date must be after start date";
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
      clientInfo: clientDetails,
      contractorInfo: contractorDetails,
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
            localStorage.setItem(
              "projectDetails",
              JSON.stringify(updatedProject),
            );
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

  const handleConfirmCancel = () => {
    setShowCancelBox(false);
    router.push("/ProjectDetails/overview");
  };

  return (
    <div className="h-full bg-black text-white ">
      <div className="w-full h-[90vh] overflow-y-scroll scrollbar-hide overflow-scroll pb-28 md:p-6 p-4 md:px-0  mx-auto ">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between ">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="md:text-2xl text-[20px] font-bold text-custom-yellow flex items-center gap-2">
                <Edit size={24} />
                Edit Project Information
              </h1>
              <p className="text-gray-400 mt-1">
                Update project details, contract information, and details
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push(`/ProjectDetails/overview`)}
          className="py-2 md:mt-0 mt-4 flex underline text-sm cursor-pointer rounded-lg transition-colors mb-4 "
        >
          <ChevronLeft size={20} /> Go back
        </button>

        <div onSubmit={handleSubmit} className="space-y-8 ">
          <div className="bg-custom-black rounded-[38px] md:px-6 px-3 pt-4 pb-6 min-h-[600px]">
            <div className="flex gap-4 overflow-x-auto no-scrollbar whitespace-nowrap">
              {["basicInfo", "client", "contractor", "introduction"].map(
                (tab) => (
                  <p
                    key={tab}
                    onClick={() => setCurrentTab(tab)}
                    className={`relative cursor-pointer flex-shrink-0 px-4 py-2 text-md md:text-lg font-semibold transition-all duration-300
        ${
          currentTab === tab
            ? "text-custom-yellow after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#e0f349]"
            : "text-gray-400 hover:text-[#e0f349]"
        }`}
                  >
                    {tab === "basicInfo"
                      ? "Basic Info"
                      : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </p>
                ),
              )}
            </div>

            {currentTab === "basicInfo" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 mt-8">
                <InputField
                  label="Project Name"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  placeholder="Enter your project name"
                  error={errors.projectName}
                />

                <InputField
                  label="Project Number"
                  name="projectNo"
                  value={formData.projectNo}
                  onChange={handleInputChange}
                  placeholder="e.g., RFC-2013-21"
                  error={errors.projectNo}
                />

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Project Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter your project description"
                    rows="4"
                    className={`w-full text-[14px] px-4 py-2 bg-[#5F5F5F] rounded-lg border ${
                      errors.description ? "border-red-500" : "border-gray-600"
                    } focus:outline-none focus:border-green-400`}
                  />
                  {errors.description && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                <InputField
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter project location"
                  error={errors.location}
                />

                <SelectField
                  label="Project Type"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  options={[
                    "Road",
                    "Bridge",
                    "Building",
                    "Infrastructure",
                    "Other",
                  ]}
                />

                <SelectField
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  options={[
                    "Planning",
                    "In Progress",
                    "On Hold",
                    "Completed",
                    "Cancelled",
                  ]}
                />

                <InputField
                  label="Contract Amount ($)"
                  type="number"
                  name="contractAmount"
                  value={formData.contractAmount}
                  onChange={handleInputChange}
                  placeholder="100000"
                  error={errors.contractAmount}
                />

                <InputField
                  label="Start Date"
                  type="date"
                  name="startDate"
                  value={dateFormet(formData.startDate || "")}
                  onChange={handleInputChange}
                  error={errors.startDate}
                />

                <InputField
                  label="Expected Completion"
                  type="date"
                  name="endDate"
                  value={dateFormet(formData.endDate || "")}
                  onChange={handleInputChange}
                  error={errors.endDate}
                />

                <InputField
                  label="Duration (Months)"
                  type="number"
                  name="Duration"
                  placeholder="e.g., 6"
                  value={formData.Duration || ""}
                  onChange={handleInputChange}
                  error={errors.Duration}
                />

                <InputField
                  label="Defects Liability Period (Months)"
                  type="number"
                  name="LiabilityPeriod"
                  placeholder="e.g., 12"
                  value={formData.LiabilityPeriod}
                  onChange={handleInputChange}
                  error={errors.LiabilityPeriod}
                />
              </div>
            )}

            {currentTab === "client" && (
              <ClientProjectInfo
                clientDetails={clientDetails}
                setClientDetails={setClientDetails}
                loader={props.loader}
              />
            )}

            {currentTab === "contractor" && (
              <ContractorProjectInfo
                contractorDetails={contractorDetails}
                setContractorDetails={setContractorDetails}
                loader={props.loader}
              />
            )}

            {currentTab === "introduction" && (
              <IntroductionInfo
                formData={formData}
                setFormData={setFormData}
                handleInputChange={handleInputChange}
              />
            )}
          </div>

          <div className="flex justify-center gap-4 items-center pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={handleSubmit}
              className="px-4 py-2.5 text-[14px] bg-custom-yellow text-black cursor-pointer  disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleConfirmCancel}
              className="px-4 cursor-pointer py-2.5 text-[14px] bg-gray-600 hover:bg-[#5F5F5F] rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>

          {showCancelBox && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
                <div className="flex flex-col items-center">
                  <XCircle className="w-14 h-14 text-red-500 mb-3" />
                  <h2 className="text-lg font-semibold text-gray-800 mb-1">
                    Cancel Changes?
                  </h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Are you sure you want to cancel? All unsaved changes will be
                    lost.
                  </p>

                  <div className="flex justify-center gap-4">
                    <button
                      onClick={onConfirm}
                      className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition-all duration-200 shadow-sm"
                    >
                      Yes, Cancel
                    </button>
                    <button
                      onClick={() => setShowCancelBox(false)}
                      className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-5 py-2 rounded-lg transition-all duration-200"
                    >
                      No, Go Back
                    </button>
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

export default EditProject;
