import React, { useContext, useEffect, useRef, useState } from "react";
import { ArrowLeft, X, Save, Download, Upload } from "lucide-react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Api } from "@/services/service";
import { ProjectDetailsContext } from "@/pages/_app";
import MonthlyProgressReportPdf from "../../../../components/documents/MonthlyProgressReportPdf";
import Compressor from "compressorjs";
import { ApiFormData } from "@/services/service";

function MonthlyProgressReport(props) {
  const router = useRouter();
  const [projectId, setProjectId] = useState("");
  const [editId, setEditId] = useState("");
  const [projectDetails, setProjectDetails] = useState({});
  const contentRef = useRef(null);
  const [topLogo, setTopLogo] = useState("");
  const [coverPhoto, setCoverPhoto] = useState("");
  const [leftLogo, setLeftLogo] = useState("");
  const [rightLogo, setRightLogo] = useState("");
  const [editData, setEditData] = useState("");
  const [allItems, setAllItems] = useState([]);
  const [data, setData] = useState({});
  const [Summary, setSummary] = useState({});
  const [allPlanData, setAllPlanData] = useState([]);

  const generateDocumentName = (type) => {
    const formattedType = type
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    const dateStr = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return `${formattedType} - ${dateStr}`;
  };

  useEffect(() => {
    const stored = localStorage.getItem("projectDetails");
    if (stored) {
      const project = JSON.parse(stored);
      getProjectbyId(project._id);
      setProjectId(project._id);
      getAllActionPoints(project._id);
      getAllPlanByProjectId(project._id);
    }
  }, []);

  const getProjectbyId = async (id) => {
    props.loader(true);
    Api("get", `project/getProjectById/${id}`, "", router)
      .then((res) => {
        props.loader(false);
        if (res?.status === true) {
          const project = res.data?.data;
          setProjectDetails(project);
          localStorage.setItem("projectDetails", JSON.stringify(project));
        }
      })
      .catch((err) => {
        props.loader(false);
        toast.error(err?.message || "An error occurred");
      });
  };

  useEffect(() => {
    if (!router.isReady) return;

    const id = router.query.editId;
    if (id) {
      setEditId(id);
      getDetails(id);
    }
  }, [router.isReady, router.query.editId]);

  useEffect(() => {
    if (!projectDetails || !allItems) return;

    const base = {
      clientName: projectDetails?.clientInfo?.ClientName || "BRA",
      coverUrl: coverPhoto || "",
      leftLogo: leftLogo || "",
      rightLogo: rightLogo || "",
      ProjectScope: projectDetails?.ProjectScope || "",
      ProjectSummary: projectDetails?.description || "",
      ExcuetiveSummary: projectDetails?.ExcuetiveSummary || "",
      projectTitle:
        projectDetails?.projectName || "proposed construction of daynille road",
      projectNo: projectDetails?.projectNo || "",
      LogoImage: topLogo || "",
      contractorName:
        projectDetails?.contractorInfo?.contractorName || "Contractor Name",
      contractorContact:
        projectDetails?.contractorInfo?.phone || "Contractor Contact",
      certificateNo: projectDetails?.certificateNo || "TOC-undefined-2025",
      location: projectDetails?.location || "Mogadishu",
      employerName: projectDetails?.clientInfo?.ClientName || "BRA",
      contractAmount: projectDetails?.contractAmount || "0.00",
      advancePayment: projectDetails?.advancePayment || "0.00",
      paidAmount: projectDetails?.paidAmount || "0.00",
      certificates: projectDetails?.certificates || [],
      reportMonth: "DECEMBER",
      reportYear: "2025",
      contractorEquipment: projectDetails?.contractorInfo?.equipment || [],
      contractorPersonnel: projectDetails?.contractorInfo || {},
      clientPersonnel: projectDetails?.clientInfo || {},
      issuesConcern: allItems,
      workplan: allPlanData,
    };

    if (editId && editData) {
      console.log("editData", editData);
      setData({
        ...base,
        ...editData,
      });
    } else {
      console.log("base", base);
      setData(base);
    }
  }, [
    projectDetails,
    allItems,
    topLogo,
    coverPhoto,
    rightLogo,
    leftLogo,
    editId,
    editData,
  ]);

  const downloadPDF = async () => {
    const input = contentRef.current;
    if (!input) return;
    props.loader(true);
    try {
      await new Promise((res) => setTimeout(res, 300));

      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

      const marginTop = 5; // ⭐ TOP MARGIN
      const marginBottom = 5; // ⭐ BOTTOM MARGIN

      const usableHeight = pdfHeight - marginTop - marginBottom;

      const imgWidth = pdfWidth - 0;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = marginTop;

      // ⭐ Page 1
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= usableHeight;

      // ⭐ Next Pages
      while (heightLeft > 0) {
        pdf.addPage();
        position = marginTop - (imgHeight - heightLeft);
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= usableHeight;
      }

      pdf.save("monthly-report.pdf");
      props.loader(false);
    } catch (error) {
      props.loader(false);
      console.error("PDF Error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    props.loader(true);

    try {
      let url = "";
      let method = "post";
      const documentName = generateDocumentName(router.query.type);

      let maindata;

      if (editId) {
        url = `documents/update/${editId}`;
        method = "put";
        maindata = {
          data: { topLogo, coverPhoto, leftLogo, rightLogo, ...data },
        };
      } else {
        url = `documents/create`;
        maindata = {
          type: router.query.type,
          projectId: projectId,
          data: { topLogo, coverPhoto, leftLogo, rightLogo, ...data },
          name: documentName,
        };
      }

      const res = await Api(method, url, maindata, router);

      props.loader(false);

      if (res?.status) {
        toast.success(editId ? "Documents updated!" : "Documents created!");
        router.push(`/ProjectDetails/Documents`);
        const data = res.data?.data?.data;
        setEditData(data);
      } else {
        toast.error(res?.message || "Something went wrong");
      }
    } catch (err) {
      props.loader(false);
      toast.error(err?.message || "Error occurred");
    }
  };

  const getDetails = async (editId) => {
    props.loader(true);

    Api("get", `documents/getOne/${editId}`, "", router)
      .then((res) => {
        props.loader(false);
        if (res?.status) {
          const d = res.data.data.data;

          setCoverPhoto(d.coverPhoto);
          setLeftLogo(d.leftLogo);
          setRightLogo(d.rightLogo);
          setTopLogo(d.topLogo);

          setEditData(d);
        }
      })
      .catch((err) => {
        props.loader(false);
        toast.error(err?.message || "An error occurred");
      });
  };

  const handleUpload = (event, setState) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileSizeInMb = file.size / (1024 * 1024);
    if (fileSizeInMb > 1) {
      toast.error("File too large. Please upload an image under 1MB.");
      return;
    }

    new Compressor(file, {
      quality: 0.6,
      success: (compressedResult) => {
        const data = new FormData();
        data.append("file", compressedResult);
        props.loader(true);
        ApiFormData("post", "user/fileUpload", data, router).then(
          (res) => {
            const fileURL = res.data.fileUrl;
            props.loader(false);
            if (res.status) {
              setState(fileURL); // <-- Set the uploaded image URL
              toast.success("Image uploaded successfully");
            }
          },
          (err) => {
            console.log(err);
            props.loader(false);
            toast.error(err?.message || "Upload failed");
          }
        );
      },
    });
  };

  const getAllActionPoints = async (id) => {
    const projectId = id;
    props.loader(true);
    Api("get", `action-Point/getAlllist/${projectId}`)
      .then((res) => {
        if (res?.status === true) {
          console.log(res?.data.data);
          setAllItems(res?.data.data);
          props.loader(false);
        }
      })
      .catch(() => {
        props.loader(false);
        toast.error("Failed to fetch action points");
      });
  };

  const getAllPlanByProjectId = async (id) => {
    props.loader(true);

    let url = `workplan/getAllPlans?projectId=${id}`;

    Api("get", url, "", router)
      .then((res) => {
        props.loader(false);
        if (res?.status === true) {
          setAllPlanData(res?.data?.data || []);
        } else {
          toast.error(res?.message || "Failed to fetch work plans");
        }
      })
      .catch((err) => {
        props.loader(false);
        toast.error(err?.message || "An error occurred");
      });
  };

  return (
    <div className="bg-black md:p-6 p-3 overflow-x-auto scrollbar-hide overflow-scroll md:h-[90vh] h-[95vh] pb-28">
      <div className="w-full bg-custom-green rounded-[16px] px-4 py-4 flex-wrap gap-4">
        <button
          className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-medium mb-1 cursor-pointer"
          onClick={() => router.back()}
        >
          <ArrowLeft size={18} />
          Back to Documents
        </button>

        <div className="mt-2 flex md:flex-row flex-col md:items-center items-start gap-2 justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Monthly Progress Report
              </h2>
              <p className="text-md text-gray-300">
                {projectDetails.projectName}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!editId && (
              <button
                onClick={handleSubmit}
                className="px-5 py-2.5 cursor-pointer bg-custom-yellow text-black font-medium hover:bg-yellow-400 rounded-xl transition text-sm flex items-center gap-2"
              >
                <Save size={16} />
                {"Save"} Document
              </button>
            )}

            <button
              onClick={downloadPDF}
              disabled={props.loader}
              className="px-5 py-2.5 cursor-pointer bg-custom-yellow text-black font-medium hover:bg-yellow-400 rounded-xl transition text-sm flex items-center gap-2"
            >
              <Download size={16} />
              Download Pdf
            </button>
          </div>
        </div>
      </div>

      <div className="min-h-[150px] bg-neutral-900 md:mt-8 mt-4 rounded-xl md:p-6 p-3 border border-gray-800">
        <div className="grid md:grid-cols-4 grid-cols-1 gap-6">
          {/* ⭐ Top Logo */}
          <div>
            <p className="text-white mb-2 text-sm font-medium">
              Top Logo (Organization/Municipality)
            </p>

            <label className="w-full cursor-pointer flex flex-col items-center justify-center border border-gray-600 rounded-xl py-3 hover:bg-gray-800 transition text-gray-300 text-sm">
              <Upload size={18} />
              Change Logo
              <input
                type="file"
                className="hidden"
                disabled={editId}
                accept="image/*"
                onChange={(e) => handleUpload(e, setTopLogo)}
              />
            </label>

            {topLogo && (
              <img
                src={topLogo}
                alt="Top Logo"
                className="w-28 h-auto mt-3 rounded-lg border border-gray-700"
              />
            )}
          </div>

          {/* ⭐ Cover Photo */}
          <div>
            <p className="text-white mb-2 text-sm font-medium">
              Cover Photo (Project Site)
            </p>

            <label className="w-full cursor-pointer flex flex-col items-center justify-center border border-gray-600 rounded-xl py-3 hover:bg-gray-800 transition text-gray-300 text-sm">
              <Upload size={18} />
              Change Photo
              <input
                type="file"
                className="hidden"
                disabled={editId}
                accept="image/*"
                onChange={(e) => handleUpload(e, setCoverPhoto)}
              />
            </label>

            {coverPhoto && (
              <img
                src={coverPhoto}
                alt="Cover Photo"
                className="w-28 h-auto mt-3 rounded-lg border border-gray-700"
              />
            )}
          </div>

          {/* ⭐ Left Logo */}
          <div>
            <p className="text-white mb-2 text-sm font-medium">
              Left Logo (Funding Organization)
            </p>

            <label className="w-full cursor-pointer flex flex-col items-center justify-center border border-gray-600 rounded-xl py-3 hover:bg-gray-800 transition text-gray-300 text-sm">
              <Upload size={18} />
              Change Logo
              <input
                type="file"
                className="hidden"
                disabled={editId}
                accept="image/*"
                onChange={(e) => handleUpload(e, setLeftLogo)}
              />
            </label>

            {leftLogo && (
              <img
                src={leftLogo}
                alt="Left Logo"
                className="w-28 h-auto mt-3 rounded-lg border border-gray-700"
              />
            )}
          </div>

          {/* ⭐ Right Logo */}
          <div>
            <p className="text-white mb-2 text-sm font-medium">
              Right Logo (Partner Organization)
            </p>

            <label className="w-full cursor-pointer flex flex-col items-center justify-center border border-gray-600 rounded-xl py-3 hover:bg-gray-800 transition text-gray-300 text-sm">
              <Upload size={18} />
              Change Logo
              <input
                type="file"
                className="hidden"
                disabled={editId}
                accept="image/*"
                onChange={(e) => handleUpload(e, setRightLogo)}
              />
            </label>

            {rightLogo && (
              <img
                src={rightLogo}
                alt="Right Logo"
                className="w-28 h-auto mt-3 rounded-lg border border-gray-700"
              />
            )}
          </div>
        </div>
      </div>

      <MonthlyProgressReportPdf
        data={data}
        Summary={Summary}
        setSummary={setSummary}
        contentRef={contentRef}
      />
    </div>
  );
}

export default MonthlyProgressReport;
