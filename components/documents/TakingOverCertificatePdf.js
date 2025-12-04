import React, { useEffect, useState } from "react";

const TakingOverCertificatePdf = ({ formData, contentRef, projectDetails }) => {
  const [data, setData] = useState({
    clientName: "",
    projectTitle: "",
    projectNo: "",
    LogoImage: "",
    contractorName: "",
    contractorContact: "",
    certificateNo: "",
    dateOfIssue: "",
    takingOverDate: "",
    location: "",
    employerName: "",
    contractAmount: "",
    defects: "",
  });

  useEffect(() => {
    if (!formData || !projectDetails) return;

    setData({
      clientName: projectDetails?.clientInfo?.ClientName || "BRA",
      projectTitle:
        projectDetails?.projectName ||
        "proposed construction of daynille road (Copy)",
      projectNo: projectDetails?.projectNo || "",
      LogoImage: formData?.LogoImage || "",
      contractorName:
        projectDetails?.contractorInfo?.contractorName || "Contractor Name",
      contractorContact:
        projectDetails?.contractorInfo?.phone || "Contractor Contact",
      certificateNo: formData?.certificateNo || "TOC-undefined-2025",
      dateOfIssue: formData?.dateOfIssue || "December 4, 2025",
      takingOverDate: formData?.takingOverDate || "December 4, 2025",
      location: projectDetails?.location || "Mogadishu",
      employerName: projectDetails?.clientInfo?.ClientName || "BRA",
      contractAmount: projectDetails?.contractAmount || "5678000.00",
      defects: formData?.OutstandingWorkandDefects || "None at the time of Taking Over",
    });
  }, [formData, projectDetails]);

  return (
    <div className="min-h-screen bg-black mt-8 rounded-2xl p-6">
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
              {/* Header with Logo and Title */}
              <div style={{ marginBottom: "30px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "20px",
                  }}
                >
                  {data.LogoImage && (
                    <img
                      src={data.LogoImage}
                      alt="Logo"
                      style={{
                        width: "100px",
                        height: "100px",
                      }}
                    />
                  )}
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#1e5a8e",
                    }}
                  >
                    {data.clientName}
                  </div>
                </div>

                <div
                  style={{
                    borderTop: "2px solid #1e5a8e",
                    marginBottom: "30px",
                  }}
                ></div>

                <h1
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "#1e5a8e",
                    marginBottom: "10px",
                  }}
                >
                  TAKING OVER CERTIFICATE
                </h1>

                <div
                  style={{
                    textAlign: "center",
                    fontSize: "13px",
                    color: "#666",
                    marginBottom: "30px",
                  }}
                >
                  Certificate No: {data.certificateNo}
                </div>
              </div>

              {/* Two Column Info Section */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "25px",
                  fontSize: "13px",
                }}
              >
                <div>
                  <div style={{ marginBottom: "12px" }}>
                    <div style={{ color: "#666", marginBottom: "3px" }}>
                      Date of Issue:
                    </div>
                    <div style={{ fontWeight: "500", color: "#1e5a8e" }}>
                      {data.dateOfIssue}
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ marginBottom: "12px" }}>
                    <div style={{ color: "#666", marginBottom: "3px" }}>
                      Taking Over Date:
                    </div>
                    <div style={{ fontWeight: "500", color: "#1e5a8e" }}>
                      {data.takingOverDate}
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Details Section */}
              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "20px",
                  borderRadius: "5px",
                  marginBottom: "25px",
                  fontSize: "13px",
                }}
              >
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ color: "#666", marginBottom: "3px" }}>
                    Project Name:
                  </div>
                  <div style={{ fontWeight: "500", color: "#1e5a8e" }}>
                    {data.projectTitle}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                  }}
                >
                  <div>
                    <div style={{ color: "#666", marginBottom: "3px" }}>
                      Project Number:
                    </div>
                    <div style={{ fontWeight: "500" }}>
                      {data.projectNo || "-"}
                    </div>
                  </div>

                  <div>
                    <div style={{ color: "#666", marginBottom: "3px" }}>
                      Location:
                    </div>
                    <div style={{ fontWeight: "500" }}>{data.location}</div>
                  </div>

                  <div>
                    <div style={{ color: "#666", marginBottom: "3px" }}>
                      Employer:
                    </div>
                    <div style={{ fontWeight: "500" }}>
                      {data.employerName}
                    </div>
                  </div>

                  <div>
                    <div style={{ color: "#666", marginBottom: "3px" }}>
                      Contractor:
                    </div>
                    <div style={{ fontWeight: "500" }}>
                      {data.contractorName}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "12px" }}>
                  <div style={{ color: "#666", marginBottom: "3px" }}>
                    Contract Amount:
                  </div>
                  <div style={{ fontWeight: "500" }}>{data.contractAmount}</div>
                </div>
              </div>

              {/* Certificate Statement */}
              <div style={{ marginBottom: "25px" }}>
                <h2
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginBottom: "15px",
                    color: "#1e5a8e",
                  }}
                >
                  CERTIFICATE
                </h2>

                <p
                  style={{
                    fontSize: "13px",
                    lineHeight: "1.7",
                    marginBottom: "15px",
                  }}
                >
                  In accordance with Sub-Clause 10.1 of the Conditions of
                  Contract, I hereby certify that the Works described as "
                  <em>{data.projectTitle}</em>" - were substantially completed
                  in accordance with the Contract on{" "}
                  <strong>{data.takingOverDate}</strong>.
                </p>

                <p style={{ fontSize: "13px", lineHeight: "1.7" }}>
                  The Works are now taken over by the Employer, and the Defects
                  Notification Period commences from the above date in
                  accordance with Sub-Clause 11.1 of the Contract.
                </p>
              </div>

              {/* Outstanding Work and Defects */}
              <div style={{ marginBottom: "30px" }}>
                <h2
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginBottom: "12px",
                    color: "#1e5a8e",
                  }}
                >
                  Outstanding Work and Defects
                </h2>

                <div
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    padding: "15px",
                    backgroundColor: "#fafafa",
                    fontSize: "13px",
                    minHeight: "60px",
                  }}
                >
                  {data.defects}
                </div>

                <p
                  style={{
                    fontSize: "11px",
                    color: "#666",
                    marginTop: "8px",
                    fontStyle: "italic",
                  }}
                >
                  * The Contractor shall complete the outstanding work and
                  remedy defects listed above during the Defects Notification
                  Period.
                </p>
              </div>

              {/* Signature Section */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "30px",
                  marginTop: "60px",
                }}
              >
                <div>
                  <div
                    style={{
                      borderTop: "1px solid #000",
                      marginBottom: "8px",
                    }}
                  ></div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "2px",
                    }}
                  >
                    Engineer/Engineer's Representative
                  </div>
                  <div style={{ fontSize: "11px", color: "#666" }}>
                    Signature & Date
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#666",
                      marginTop: "5px",
                    }}
                  >
                    Name: ______________
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      borderTop: "1px solid #000",
                      marginBottom: "8px",
                    }}
                  ></div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "2px",
                    }}
                  >
                    Contractor
                  </div>
                  <div style={{ fontSize: "11px", color: "#666" }}>
                    Signature & Date
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#666",
                      marginTop: "5px",
                    }}
                  >
                    Name: {data.contractorContact}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      borderTop: "1px solid #000",
                      marginBottom: "8px",
                    }}
                  ></div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "2px",
                    }}
                  >
                    Employer/Employer's Representative
                  </div>
                  <div style={{ fontSize: "11px", color: "#666" }}>
                    Signature & Date
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#666",
                      marginTop: "5px",
                    }}
                  >
                    Name: Client Contact
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakingOverCertificatePdf;