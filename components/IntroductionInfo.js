import React from "react";
import TextAreaField from "./UI/TextAreaField";
import dynamic from "next/dynamic";

function IntroductionInfo({ formData, handleInputChange, setFormData }) {
  const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
  const editorConfig = {
    height: 250,
    readonly: false,
    toolbarAdaptive: false,
    toolbarSticky: false,
    spellcheck: true,

    buttons: ["bold", "ul", "ol"],

    removeButtons: [
      "source",
      "image",
      "video",
      "table",
      "link",
      "brush",
      "font",
      "fontsize",
      "paragraph",
      "fullsize",
    ],

    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: "insert_clear_html",
  };
  return (
    <div className="mt-6">
      <div className="flex flex-col gap-2 mb-4">
        <p className="text-gray-200 text-sm font-medium">Executive Summary</p>
        <div className="rounded-xl text-black overflow-hidden shadow-sm border border-gray-600 bg-gray-50">
          <JoditEditor
            value={formData.ExcuetiveSummary}
            config={{
              ...editorConfig,
              placeholder: `Executive Summary`,
            }}
            tabIndex={1}
            onBlur={(html) => {
              setFormData((prev) => ({
                ...prev,
                ExcuetiveSummary: html,
              }));
            }}
          />
        </div>
      </div>

      <TextAreaField
        label="Location Description"
        name="LocationSummary"
        value={formData.LocationSummary}
        onChange={handleInputChange}
        rows="4"
        placeholder="Enter detailed location description..."
      />

      <div className="flex flex-col gap-2 mb-4">
        <p className="text-gray-200 text-sm font-medium">Scope of Work</p>
        <div className="rounded-xl text-black overflow-hidden shadow-sm border border-gray-600 bg-gray-50">
          <JoditEditor
            value={formData.ProjectScope}
            config={{
              ...editorConfig,
              placeholder: `Enter Scope of Work`,
            }}
            tabIndex={1}
            onBlur={(html) => {
              setFormData((prev) => ({
                ...prev,
                ProjectScope: html,
              }));
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default IntroductionInfo;
