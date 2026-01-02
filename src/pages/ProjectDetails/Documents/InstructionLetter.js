import React, { useContext, useEffect, useRef, useState } from "react";
import { ArrowLeft, X, Save, Download } from "lucide-react";
import { useRouter } from "next/router";
import InputField from "../../../../components/UI/InputField";
import TextAreaField from "../../../../components/UI/TextAreaField";
import { toast } from "react-toastify";
import { Api } from "@/services/service";
import InstructionLetterPdf from "../../../../components/documents/InstructionLetterPdf";
import { ProjectDetailsContext } from "@/pages/_app";

function InstructionLetter(props) {
  const router = useRouter();
  const [projectId, setProjectId] = useState("");
  const [editId, setEditId] = useState("");
  const [projectDetails, setProjectDetails] = useContext(ProjectDetailsContext);
  const [isGenerating, setIsGenerating] = useState(false);
  const contentRef = useRef(null);

  // 🚀 Generate Auto Document Name
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

  const downloadPDF = async () => {
    const input = contentRef.current;
    if (!input) return;

    setIsGenerating(true);

    try {
      await new Promise((res) => setTimeout(res, 300));

      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = pdfWidth;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight > pdfHeight) {
        imgHeight = pdfHeight - 2;
      }

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // Auto Name
      const fileName = generateDocumentName(router.query.type || "Document");
      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("projectDetails");
    if (stored) {
      const project = JSON.parse(stored);
      setProjectDetails(project);
      setProjectId(project._id);
    }
  }, []);

  useEffect(() => {
    if (!router.isReady) return;

    const id = router.query.editId;
    if (id) {
      setEditId(id);
      getDetails(id);
    }
  }, [router.isReady, router.query.editId]);

  const [formData, setFormData] = useState({
    LetterNo: "",
    LetterDate: "",
    subject: "",
    LetterContent: "",
  });

  const reset = () => {
    setFormData({
      LetterNo: "",
      LetterDate: "",
      subject: "",
      LetterContent: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData?.LetterNo ||
      !formData?.LetterContent ||
      !formData?.LetterDate ||
      !formData?.subject
    ) {
      return toast.error("Please fill all the details");
    }
    props.loader(true);

    try {
      let url = "";
      let method = "post";
      const documentName = generateDocumentName(router.query.type);

      let data;

      if (editId) {
        url = `documents/update/${editId}`;
        method = "put";
        data = {
          data: formData,
        };
      } else {
        url = `documents/create`;
        data = {
          type: router.query.type,
          projectId: projectId,
          data: formData,
          name: documentName,
        };
      }

      const res = await Api(method, url, data, router);

      props.loader(false);

      if (res?.status) {
        toast.success(editId ? "Documents updated!" : "Documents created!");
        router.push(`/ProjectDetails/documents`);
      } else {
        toast.error(res?.message || "Something went wrong");
      }
    } catch (err) {
      props.loader(false);
      toast.error(err?.message || "Error occurred");
    }
  };

  // Fetch document details for edit mode
  const getDetails = async (editId) => {
    props.loader(true);

    Api("get", `documents/getOne/${editId}`, "", router)
      .then((res) => {
        props.loader(false);
        if (res?.status) {
          const data = res.data.data.data;
          setFormData({
            LetterNo: data.LetterNo || "",
            LetterDate: data.LetterDate || "",
            subject: data.subject || "",
            LetterContent: data.LetterContent || "",
          });
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
                Instruction Letter
              </h2>
              <p className="text-md text-gray-300">
                {projectDetails.projectName}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="px-4 py-2.5 cursor-pointer rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-800 transition text-sm flex items-center gap-2"
              onClick={reset}
            >
              <X size={16} />
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="px-5 py-2.5 cursor-pointer bg-custom-yellow text-black font-medium hover:bg-yellow-400 rounded-xl transition text-sm flex items-center gap-2"
            >
              <Save size={16} />
              {editId ? "Update" : "Save"} Document
            </button>

            <button
              onClick={downloadPDF}
              className="px-5 py-2.5 cursor-pointer bg-custom-yellow text-black font-medium hover:bg-yellow-400 rounded-xl transition text-sm flex items-center gap-2"
            >
              <Download size={16} />
              Download Pdf
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="min-h-[450px] bg-neutral-900 md:mt-8 mt-4 rounded-xl md:p-6 p-3 border border-gray-800">
        <p className="text-white text-lg">Letter Details</p>

        <div className="mt-3">
          <InputField
            label="Letter No"
            name="LetterNo"
            value={formData.LetterNo}
            onChange={handleInputChange}
            placeholder="e.g., IL-67HY57-2025"
          />
        </div>

        <div className="md:mt-6 mt-3">
          <InputField
            label="Letter Date"
            name="LetterDate"
            type="date"
            value={formData.LetterDate}
            onChange={handleInputChange}
          />
        </div>

        <div className="md:mt-6 mt-3">
          <InputField
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="e.g., SITE INSTRUCTION-CONCREATE WORKS"
          />
        </div>

        <div className="md:mt-6 mt-3">
          <TextAreaField
            label="Letter Content"
            name="LetterContent"
            value={formData.LetterContent}
            onChange={handleInputChange}
            placeholder="Enter Your Content Letter"
            rows="8"
          />
        </div>
      </div>

      {/* PDF Preview */}
      <div>
        <InstructionLetterPdf
          formData={formData}
          contentRef={contentRef}
          projectDetails={projectDetails}
        />
      </div>
    </div>
  );
}

export default InstructionLetter;
