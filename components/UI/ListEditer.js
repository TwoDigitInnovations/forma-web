"use client";

import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";

// Import Jodit dynamically (to avoid SSR issues)
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function RichTextEditor({ label = "Executive Summary", value, onChange }) {
  const editor = useRef(null);
  const [content, setContent] = useState(value || "");

  // Configuration
  const editorConfig = {
    height: 400,
    toolbarAdaptive: false,
    toolbarSticky: true,
    toolbarButtonSize: "middle",
    buttons: [
      "bold", "italic", "underline", "strikethrough", "|",
      "fontsize", "font", "paragraph", "brush", "|",
      "left", "center", "right", "justify", "|",
      "ul", "ol", "indent", "outdent", "|",
      "link", "image", "video", "table", "hr", "emoji", "|",
      "undo", "redo", "|",
      "cut", "copy", "paste", "|",
      "brush", "background", "|",
      "source", "fullsize"
    ],
    uploader: {
      insertImageAsBase64URI: true,
    },
    removeButtons: ["about"],
  };

  return (
    <div className="flex flex-col gap-2 mb-4">
      {label && <p className="text-gray-200 text-sm font-medium">{label}</p>}

      <div className="rounded-xl text-black overflow-hidden shadow-sm border border-gray-600 bg-gray-50">
        <JoditEditor
          ref={editor}
          value={content}
          config={editorConfig}
          tabIndex={1}
          onBlur={(newContent) => {
            setContent(newContent);
            onChange?.(newContent);
          }}
        />
      </div>
    </div>
  );
}
