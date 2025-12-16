import React, { useEffect, useRef, useState } from "react";

const InstructionLetterPdf = ({ formData, contentRef, projectDetails }) => {
  const [data, setData] = useState({
    clientName: "",
    projectTitle: "",
    projectNo: "",
    OrderNo: "",
    OrderDate: "",
    CommencementDate: "",
    PlannedCompletionDate: "",
    LogoImage: "",
    contractorName: "",
    clientContact: "",
  });

  useEffect(() => {
    if (!formData || !projectDetails) return;

    setData({
      clientName: projectDetails?.clientInfo?.ClientName || "Client Name",
      projectTitle: projectDetails?.projectName || "Project Title",
      projectNo: projectDetails?.projectNo || "",
      OrderNo: formData.OrderNo || "",
      OrderDate: formData?.OrderDate || "",
      CommencementDate: formData?.CommencementDate || "",
      PlannedCompletionDate: formData?.PlannedCompletionDate || "",
      contractorName:
        projectDetails?.contractorInfo?.contractorName || "Contractor Name",
      clientContact: projectDetails?.clientInfo?.phone || "Client Contact",
      clientName: projectDetails?.clientInfo?.ClientName || "",
      clientAddress: projectDetails?.clientInfo?.Address || "",
      LogoImage: projectDetails?.clientInfo?.ClientLogo || "",
    });
  }, [formData, projectDetails]);

  console.log(formData);
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
                padding: "40px 50px",
              }}
            >
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: "30px" }}>
                <div style={{ marginBottom: "20px" }}>
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
                    borderTop: "3px solid #000",
                    marginTop: "20px",
                  }}
                ></div>
              </div>

              {/* Order Info */}
              <div style={{ marginBottom: "25px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "14px", marginBottom: "3px" }}>
                      Order No:
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#0066cc",
                        fontWeight: "500",
                      }}
                    >
                      {data.OrderNo || "CO-undefined-2025"}
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "14px", marginBottom: "3px" }}>
                      Date:
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: "500" }}>
                      {data.OrderDate || "December 4, 2025"}
                    </div>
                  </div>
                </div>

                {/* Contractor Details */}
                <div style={{ fontSize: "14px", marginBottom: "18px" }}>
                  <div style={{ marginBottom: "3px" }}>To:</div>
                  <div style={{ fontWeight: "600", marginBottom: "2px" }}>
                    {data.contractorName}
                  </div>
                  <div>Attn: {data.contractorContact}</div>
                </div>

                {/* Client Info */}
                <div style={{ fontSize: "14px" }}>
                  <div style={{ marginBottom: "3px" }}>From:</div>
                  <div style={{ fontWeight: "600" }}>BRA</div>
                </div>
              </div>

              {/* Subject */}
              <div style={{ marginBottom: "25px" }}>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  RE: {data.subject || "COMMENCEMENT ORDER"}
                </div>
                <div style={{ fontSize: "14px", fontWeight: "600" }}>
                  Project: {data.projectTitle}
                </div>
              </div>

              {/* Letter Body */}
              <div style={{ marginBottom: "30px" }}>
                <p
                  style={{
                    fontSize: "14px",
                    marginBottom: "20px",
                    lineHeight: "1.6",
                  }}
                >
                  Dear {data.contractorName},
                </p>

                <div
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.6",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {`This letter serves as an official Commencement Order for the above-referenced project in accordance with the terms and conditions of the Contract Agreement.

You are hereby instructed to commence work on the above project effective December 4, 2025. Please ensure that all necessary resources, personnel, and equipment are mobilized to the site and that work proceeds in accordance with the approved schedule and specifications.

All work shall be carried out in strict compliance with the Contract Documents, including drawings, specifications, and any supplementary instructions issued by the Engineer.

Should you have any questions or require clarification on any aspect of this order, please contact the undersigned immediately.`}
                </div>

                <p
                  style={{
                    fontSize: "14px",
                    marginTop: "20px",
                    lineHeight: "1.6",
                  }}
                >
                  Sincerely,
                </p>
              </div>

              {/* Signature */}
              <div style={{ marginTop: "100px" }}>
                <div
                  style={{
                    borderTop: "1px solid #000",
                    width: "250px",
                    marginBottom: "10px",
                  }}
                ></div>

                <div style={{ fontSize: "13px", marginBottom: "2px" }}>BRA</div>
                <div style={{ fontSize: "13px", color: "#666" }}>
                  Signature & Date
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
