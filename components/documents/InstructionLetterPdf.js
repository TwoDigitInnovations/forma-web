import React, { useEffect, useRef, useState } from "react";

const InstructionLetterPdf = ({ formData, contentRef, projectDetails }) => {
  const [data, setData] = useState({
    clientName: "",
    projectTitle: "",
    projectNo: "",
    LetterNo: "",
    LetterDate: "",
    subject: "",
    LetterContent: "",
    LogoImage: "",
    contractorName: "",
    clientContact: "",
    clientAddress: "",
    clientName: "",
  });

  useEffect(() => {
    if (!formData || !projectDetails) return;

    setData({
      clientName: projectDetails?.clientInfo?.ClientName || "Client Name",
      projectTitle: projectDetails?.projectName || "Project Title",
      projectNo: projectDetails?.projectNo || "",
      LetterNo: formData?.LetterNo || "",
      LetterDate: formData?.LetterDate || "",
      subject: formData?.subject || "",
      LetterContent: formData?.LetterContent || "",
      LogoImage: projectDetails?.clientInfo?.ClientLogo || "",
      contractorName: projectDetails?.contractorInfo?.contractorName || "",
      clientContact: projectDetails?.clientInfo?.phone || "",
      clientName: projectDetails?.clientInfo?.ClientName || "",
      clientAddress: projectDetails?.clientInfo?.Address || "",
    });
  }, [formData, projectDetails]);

  console.log(data);

  return (
    <div className="min-h-screen bg-custom-black mt-8 rounded-2xl p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <div className="border-2 border-gray-300 rounded-lg p-4">
            <div
              ref={contentRef}
              style={{
                width: "800px",
                minHeight: "1120px",
                background: "white",
                color: "black",
                fontFamily: "Arial, sans-serif",
                padding: "20px 40px",
              }}
            >
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <div style={{ marginBottom: "40px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      {data.LogoImage && (
                        <img
                          src={data.LogoImage}
                          alt="Logo"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "contain",
                          }}
                        />
                      )}
                    </div>

                    <div
                      style={{
                        textAlign: "right",
                        fontSize: "12px",
                        lineHeight: "1.6",
                      }}
                    >
                      <p style={{ margin: 0 }}>{data.clientName}</p>
                      <p style={{ margin: 0 }}>{data.clientAddress}</p>
                      <p style={{ margin: 0 }}>{data.clientContact}</p>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    borderTop: "2px solid #000",
                    marginTop: "25px",
                  }}
                ></div>
              </div>

              {/* Letter Info */}
              <div style={{ marginBottom: "30px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "15px",
                  }}
                >
                  <div>
                    <span style={{ fontSize: "13px" }}>Letter No:</span>
                    <div style={{ fontSize: "13px", color: "#0066cc" }}>
                      {data.LetterNo || "IL-0001"}
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "13px" }}>Date:</span>
                    <div style={{ fontSize: "13px" }}>
                      {data.LetterDate || "Date"}
                    </div>
                  </div>
                </div>

                {/* Contractor Details */}
                <div style={{ fontSize: "13px", marginBottom: "8px" }}>
                  <div>To:</div>
                  <div style={{ fontWeight: "bold", marginTop: "3px" }}>
                    {data.contractorName}
                  </div>
                  <div style={{ marginTop: "3px" }}>
                    Attn: {data.contractorContact}
                  </div>
                </div>

                {/* Client Info */}
                <div style={{ fontSize: "13px", marginTop: "15px" }}>
                  <div>From:</div>
                  <div style={{ fontWeight: "bold", marginTop: "3px" }}>
                    BRA
                  </div>
                  <div style={{ marginTop: "3px" }}>
                    Project Engineer: {data.clientContact}
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div style={{ marginBottom: "25px" }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                >
                  RE: {data.subject || "[SUBJECT LINE]"}
                </div>
                <div style={{ fontSize: "13px" }}>
                  Project: {data.projectTitle}
                </div>
              </div>

              {/* Letter Body */}
              <div style={{ marginBottom: "30px" }}>
                <p style={{ fontSize: "13px", marginBottom: "15px" }}>
                  Dear {data.contractorName},
                </p>

                <div
                  className="rich-html"
                  style={{ fontSize: "13px", marginBottom: "15px" }}
                  dangerouslySetInnerHTML={{
                    __html:
                      data.LetterContent || "[Enter your letter content here]",
                  }}
                />

                <p style={{ fontSize: "13px" }}>Sincerely,</p>
              </div>

              {/* Signature */}
              <div style={{ marginTop: "80px", paddingTop: "40px" }}>
                <div
                  style={{
                    borderTop: "1px solid #000",
                    width: "200px",
                    marginBottom: "8px",
                  }}
                ></div>

                <div style={{ fontSize: "13px", marginBottom: "3px" }}>
                  {data.clientContact}
                </div>
                <div style={{ fontSize: "13px", marginBottom: "3px" }}>BRA</div>
                <div style={{ fontSize: "13px" }}>
                  Project Engineer - Signature & Date
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructionLetterPdf;
