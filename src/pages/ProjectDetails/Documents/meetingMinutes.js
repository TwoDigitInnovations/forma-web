import React, { useContext, useEffect, useRef, useState } from "react";
import { ArrowLeft, X, Save, Download } from "lucide-react";
import { useRouter } from "next/router";
import InputField from "../../../../components/UI/InputField";
import TextAreaField from "../../../../components/UI/TextAreaField";
import RichTextEditor from "../../../../components/UI/ListEditer";
import { toast } from "react-toastify";
import { Api } from "@/services/service";
import MeetingMinutesPdf from "../../../../components/documents/MeetingMintuesPdf";
import { ProjectDetailsContext } from "@/pages/_app";

function MeetingMinutes(props) {
  const router = useRouter();
  const [projectId, setProjectId] = useState("");
  const [editId, setEditId] = useState("");
  const [projectDetails, setProjectDetails] = useContext(ProjectDetailsContext);
  const [isGenerating, setIsGenerating] = useState(false);
  const contentRef = useRef(null);

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

      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

      // Convert canvas to image
      const imgData = canvas.toDataURL("image/png");

      const imgWidth = pdfWidth;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;

      // 🔥 MAIN FIX — Force image height to fit exactly inside A4
      if (imgHeight > pdfHeight) {
        imgHeight = pdfHeight - 2; // remove 1–2mm margin
      }

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      pdf.save(`meeting-mintues.pdf`);
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
    name: "",
    meetingDate: "",
    meetingTime: "",
    venue: "",
    attendees: "",
    agenda: "",
    discussions: "",
    actionItems: "",
    nextMeeting: "",
  });

  const reset = () => {
    setFormData({
      meetingDate: "",
      meetingTime: "",
      venue: "",
      attendees: "",
      agenda: "",
      discussions: "",
      actionItems: "",
      nextMeeting: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
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
  const handleSubmit = async (e) => {
    e.preventDefault();

    props.loader(true);
    let data;
    try {
      let url = "";
      let method = "post";
      const documentName = generateDocumentName(router.query.type);

      if (editId) {
        url = `documents/update/${editId}`;
        method = "put";
        data = {
          data: formData,
        };
      } else {
        url = `documents/create`;
        data = {
          data: formData,
          type: router.query.type,
          projectId: projectId,
          name: documentName,
        };
      }

      const res = await Api(method, url, data, router);
      props.loader(false);
      if (res?.status) {
        toast.success(editId ? "Documents updated!" : "Documents created!");
        router.push(`/ProjectDetails/Documents`);
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
        if (res?.status === true) {
          const data = res.data.data.data;
          setFormData({
            meetingDate: data.meetingDate || "",
            meetingTime: data.meetingTime || "",
            venue: data.venue || "",
            attendees: data.attendees || "",
            agenda: data.agenda || "",
            discussions: data.discussions || "",
            actionItems: data.actionItems || "",
            nextMeeting: data.nextMeeting || "",
          });
        }
      })
      .catch((err) => {
        props.loader(false);
        toast.error(err?.message || "An error occurred");
      });
  };

  console.log(formData);
  
  return (
    <div className="bg-black  md:p-6 p-3 overflow-x-auto scrollbar-hide overflow-scroll md:h-[90vh] h-[95vh] pb-28">
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
                Meeting Minutes
              </h2>
              <p className="text-md text-gray-300 ">
                {projectDetails.projectName}
              </p>
            </div>
          </div>

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

      <div className="min-h-[450px] bg-neutral-900 md:mt-8 mt-4 rounded-xl md:p-6 p-3 border border-gray-800 ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Meeting Date"
            name="meetingDate"
            type="date"
            value={formData.meetingDate}
            onChange={handleInputChange}
          />

          <InputField
            label="Meeting Time"
            name="meetingTime"
            type="time"
            value={formData.meetingTime}
            onChange={handleInputChange}
          />
        </div>

        <div className="md:mt-6 mt-3">
          <InputField
            label="Venue"
            name="venue"
            value={formData.venue}
            onChange={handleInputChange}
            placeholder="Enter meeting venue"
          />
        </div>

        <div className="md:mt-6 mt-3">
          <RichTextEditor
            label="Attendees"
            name="attendees"
            value={formData.attendees}
            onChange={(content) => {
              setFormData({ ...formData, attendees: content });
            }}
          />
        </div>

        <div className="md:mt-6 mt-3">
          <RichTextEditor
            label="Agenda"
            name="agenda"
            value={formData.agenda}
            onChange={(content) => {
              setFormData({ ...formData, agenda: content });
            }}
          />
        </div>

        <div className="md:mt-6 mt-3">
          <RichTextEditor
            label="Discussions & Decisions"
            name="discussions"
            value={formData.discussions}
            onChange={(content) => {
              setFormData({ ...formData, discussions: content });
            }}
          />
        </div>

        <div className="md:mt-6 mt-3">
          <RichTextEditor
            label="Action Items"
            name="actionItems"
            value={formData.actionItems}
            onChange={(content) => {
              setFormData({ ...formData, actionItems: content });
            }}
          />
        </div>

        <div className="md:mt-6 mt-3">
          <InputField
            label="Next Meeting"
            name="nextMeeting"
            type="datetime-local"
            value={formData.nextMeeting}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div>
        <MeetingMinutesPdf
          formData={formData}
          contentRef={contentRef}
          projectDetails={projectDetails}
        />
      </div>
    </div>
  );
}

export default MeetingMinutes;
