import React, { useEffect, useState } from "react";

const MonthlyProgressReportPdf = ({ formData, contentRef, projectDetails }) => {
  const [data, setData] = useState({
    clientName: "",
    coverUrl: "",
    leftLogo: "",
    rightLogo: "",
    projectTitle: "",
    projectNo: "",
    LogoImage: "",
    contractorName: "",
    contractorContact: "",
    certificateNo: "",
    location: "",
    employerName: "",
    contractAmount: "",
    reportMonth: "",
    reportYear: "",
  });

  useEffect(() => {
    if (!formData || !projectDetails) return;

    setData({
      clientName: projectDetails?.clientInfo?.ClientName || "BRA",
      projectTitle:
        projectDetails?.projectName || "proposed construction of daynille road",
      projectNo: projectDetails?.projectNo || "",
      LogoImage: formData?.LogoImage || "",
      contractorName:
        projectDetails?.contractorInfo?.contractorName || "Contractor Name",
      contractorContact:
        projectDetails?.contractorInfo?.phone || "Contractor Contact",
      certificateNo: formData?.certificateNo || "TOC-undefined-2025",
      location: projectDetails?.location || "Mogadishu",
      employerName: projectDetails?.clientInfo?.ClientName || "BRA",
      contractAmount: projectDetails?.contractAmount || "5678000.00",
      reportMonth: formData?.reportMonth || "DECEMBER",
      reportYear: formData?.reportYear || "2025",
    });
  }, [formData, projectDetails]);

  const convertBase64ToUrl = (base64String) => {
    if (!base64String) return "";
    if (base64String.startsWith("http")) return base64String;
    if (!base64String.startsWith("data:")) {
      return `data:image/png;base64,${base64String}`;
    }

    return base64String;
  };

  const logoUrl = convertBase64ToUrl(
    data.LogoImage ||
      "https://images.unsplash.com/photo-1764767168158-9f05d34e3881?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxN3x8fGVufDB8fHx8fA%3D%3D"
  );
  const CoverUrl = convertBase64ToUrl(
    data.coverUrl ||
      "https://images.unsplash.com/photo-1764806359224-4aa8a23dc66b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNHx8fGVufDB8fHx8fA%3D%3D"
  );
  const LeftLogo = convertBase64ToUrl(
    data.leftLogo ||
      "https://images.unsplash.com/photo-1764773965937-8c6c0f2ad915?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8"
  );
  const RightLogo = convertBase64ToUrl(
    data.rightLogo ||
      "https://images.unsplash.com/photo-1761839257144-297ce252742e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8"
  );

  return (
    <div className="min-h-screen  mt-8 rounded-2xl ">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          <div
            ref={contentRef}
            style={{
              width: "260mm",
              minHeight: "297mm",
              background: "#ffffff",
              color: "#000000",
              fontFamily: "Arial, sans-serif",
              padding: "40px 50px",
            }}
          >
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt="Logo"
                  style={{
                  maxWidth: "120px",
                  height: "auto",
                  display: "block",
                  margin: "0 auto 30px auto",
                }}
                />
              )}

              <h1
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginBottom: "6px",
                }}
              >
                {data.clientName}
              </h1>

              <p
                style={{ fontSize: "14px", color: "#444", marginBottom: "8px" }}
              >
                {data.projectTitle}
              </p>

              <div
                style={{
                  background: "#FFE082",
                  display: "inline-block",
                  padding: "8px 20px",
                  borderRadius: "4px",
                  fontSize: "13px",
                  fontWeight: "500",
                }}
              >
                {data.projectTitle}
              </div>
            </div>

            {/* Report Title */}
            <div style={{ textAlign: "center", margin: "40px 0" }}>
              <h2
                style={{
                  fontSize: "22px",
                  color: "#2196F3",
                  fontWeight: "bold",
                  letterSpacing: "0.5px",
                }}
              >
                MONTHLY PROGRESS REPORT – {data.reportMonth} {data.reportYear}
              </h2>
            </div>

            {/* Cover Image */}
            {CoverUrl && (
              <img
                src={CoverUrl}
                alt="Cover"
                style={{
                  maxWidth: "420px",
                  height: "auto",
                  display: "block",
                  margin: "0 auto 30px auto",
                }}
              />
            )}

            {/* Date */}
            <div style={{ textAlign: "center", margin: "30px 0" }}>
              <p style={{ fontSize: "16px", fontWeight: "600" }}>
                {data.reportMonth} 5, {data.reportYear}
              </p>
            </div>

            {/* Logos */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
                margin: "40px 0",
              }}
            >
              {LeftLogo && (
                <img
                  src={LeftLogo}
                  alt="Left Logo"
                  style={{ maxWidth: "110px", height: "auto" }}
                />
              )}

              {RightLogo && (
                <img
                  src={RightLogo}
                  alt="Right Logo"
                  style={{ maxWidth: "110px", height: "auto" }}
                />
              )}
            </div>

            {/* Table of Contents */}
            <div style={{ marginTop: "60px" }}>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "20px",
                }}
              >
                TABLE OF CONTENTS
              </h3>

              <div style={{ fontSize: "14px", lineHeight: "1.8" }}>
                <strong>1. INTRODUCTION</strong>
                <div style={{ marginLeft: "20px" }}>1.1 Project Summary</div>
                <div style={{ marginLeft: "20px", marginBottom: "10px" }}>
                  1.2 Location and Extents of Works
                </div>

                <div style={{ fontWeight: "bold" }}>2. PROJECT INFORMATION</div>

                <div style={{ fontWeight: "bold" }}>3. SCOPE OF WORK</div>

                <strong>4. PROGRESS</strong>
                <div style={{ marginLeft: "20px" }}>4.1 Overall Progress</div>
                <div style={{ marginLeft: "20px" }}>4.2 Work Progress</div>
                <div style={{ marginLeft: "20px", marginBottom: "5px" }}>
                  4.3 Financial Progress
                </div>

                <strong>5. WORK PLAN</strong>
                <br />

                <strong>6. CLIENT PERSONNEL</strong>
                <br />

                <strong>7. CONTRACTOR PERSONNEL</strong>
                <br />

                <strong>8. CONTRACTOR'S EQUIPMENT</strong>
                <br />

                <strong>9. ISSUES AND CONCERNS</strong>
              </div>
            </div>

            <div
              style={{
                marginTop: "30px",
              }}
            >
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
                  1. INTRODUCTION
                </h2>

                <h3
                  style={{
                    fontSize: "15px",
                    marginTop: "15px",
                    fontWeight: "bold",
                  }}
                >
                  1.1 Project Summary
                </h3>
                <p style={{ fontSize: "13px", color: "#555" }}>
                  No description provided for this project.
                </p>

                <h3
                  style={{
                    fontSize: "15px",
                    marginTop: "15px",
                    fontWeight: "bold",
                  }}
                >
                  1.2 Location and Extents of Works
                </h3>
                <p style={{ fontSize: "13px", color: "#555" }}>
                  <strong>Location:</strong> Mogadishu
                </p>
              </div>

              <div>
                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginTop: "20px",
                  }}
                >
                  2. PROJECT INFORMATION
                </h2>

                <h3 style={{ fontSize: "15px", marginTop: "15px" }}>
                  2.1 Project Summary - N/A
                </h3>

                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "13px",
                    marginTop: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          border: "1px solid #ccc",
                          padding: "8px",
                          background: "#f1f1f1",
                          fontWeight: "bold",
                        }}
                      >
                        Item
                      </th>
                      <th
                        style={{
                          border: "1px solid #ccc",
                          padding: "8px",
                          background: "#f1f1f1",
                          fontWeight: "bold",
                        }}
                      >
                        Details
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {[
                      ["1. Contractor", "-"],
                      ["2. Contract Sum (USD)", "$0.00"],
                      ["3. Source of funds", "BRA"],
                      ["4. Start Date", "July 8, 2025"],
                      ["5. Commencement date", "July 8, 2025"],
                      ["6. Original Contract period", "-"],
                      ["7. Date of Completion", "March 4, 2026"],
                      ["8. Period Elapsed", "5 Months"],
                      ["9. Percentage of Time Elapsed", "63%"],
                      ["10. Physical progress to date", "4%"],
                      ["11. Defects Liability Period", "-"],
                      ["12. Total Amount certified to date", "$2,000.00"],
                      ["13. Advance Payment", "$1,000.00"],
                      ["14. Percentage of amount certified to date", "0%"],
                    ].map(([item, value]) => (
                      <tr>
                        <td
                          style={{ border: "1px solid #ccc", padding: "8px" }}
                        >
                          {item}
                        </td>
                        <td
                          style={{ border: "1px solid #ccc", padding: "8px" }}
                        >
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div>
                  <h2
                    style={{
                      fontSize: "18px",
                      marginTop: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    3. SCOPE OF WORK
                  </h2>
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#555",
                      marginBottom: "20px",
                    }}
                  >
                    No scope of work details provided.
                  </p>
                </div>

                <div>
                  <h2
                    style={{
                      fontSize: "18px",
                      marginTop: "20px",
                      marginBottom: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    4. PROGRESS
                  </h2>
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#555",
                      marginBottom: "20px",
                    }}
                  >
                    4.1 Overall Progress
                  </p>
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#555",
                      marginBottom: "20px",
                    }}
                  >
                    ----
                  </p>

                  <p
                    style={{
                      fontSize: "16px",
                      color: "#555",
                      marginBottom: "20px",
                    }}
                  >
                    4.2 Work Progress
                  </p>
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#555",
                      marginBottom: "20px",
                    }}
                  >
                    ---
                  </p>
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#555",
                      marginBottom: "20px",
                    }}
                  >
                    4.3 Financial Progress
                  </p>
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#555",
                      marginBottom: "20px",
                    }}
                  >
                    ---
                  </p>
                </div>
                <div>
                  <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
                    5. WORK PLAN
                  </h2>

                  <h3
                    style={{
                      fontSize: "15px",
                      marginTop: "5px",
                      marginBottom: "20px",
                    }}
                  >
                    ----
                  </h3>
                </div>

                <div>
                  <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
                    6. CLIENT PERSONNEL
                  </h2>

                  <h3
                    style={{
                      fontSize: "15px",
                      marginTop: "5px",
                      marginBottom: "20px",
                    }}
                  >
                    ---
                  </h3>
                </div>

                <div>
                  <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
                    7. CONTRACTOR PERSONNEL
                  </h2>

                  <h3
                    style={{
                      fontSize: "15px",
                      marginTop: "5px",
                      marginBottom: "20px",
                    }}
                  >
                    No contractor personnel recorded for this project.
                  </h3>
                </div>

                <div>
                  <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
                    8. CONTRACTOR'S EQUIPMENT
                  </h2>

                  <h3
                    style={{
                      fontSize: "15px",
                      marginTop: "5px",
                      marginBottom: "20px",
                    }}
                  >
                    No contractor equipment recorded for this project.
                  </h3>
                </div>

                <div>
                  <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
                    9. ISSUES AND CONCERNS
                  </h2>

                  <h3
                    style={{
                      fontSize: "15px",
                      marginTop: "5px",
                      marginBottom: "20px",
                    }}
                  >
                    No contractor equipment recorded for this project.
                  </h3>
                  <div style={{ display: "flex", gap: "50%" }}>
                    <div>
                      <p style={{ fontWeight: "bold", fontSize: "18px" }}>
                        {" "}
                        Prepared by:
                      </p>
                      <p style={{ fontSize: "14px" }}> Project Manager</p>
                    </div>
                    <div>
                      <p style={{ fontWeight: "bold", fontSize: "18px" }}>
                        {" "}
                        Reviewed by:{" "}
                      </p>
                      <p style={{ fontSize: "14px" }}> Client Representative</p>
                      <p style={{ fontSize: "14px" }}> BRA</p>
                    </div>
                  </div>

                  <p style={{ textAlign: "center" }}> 5 December 2025 </p>
                  <p
                    style={{
                      textAlign: "center",
                      marginTop: "20px",
                      fontSize: "14px",
                    }}
                  >
                    {" "}
                    This report is confidential and intended solely for the use
                    of BRA{" "}
                  </p>
                  <p style={{ textAlign: "center", fontSize: "14px" }}>
                    {" "}
                    ConstructTrack Project Management System - December 5, 2025
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyProgressReportPdf;

// const PDFDemo = () => {
//   const contentRef = React.useRef(null);

//   const sampleProjectDetails = {
//     clientInfo: { ClientName: "BRA" },
//     projectName: "proposed construction of daynille road",
//     projectNo: "PRJ-2025-001",
//     contractorInfo: {
//       contractorName: "ABC Construction Ltd",
//       phone: "+252 61 234 5678",
//     },
//     location: "Mogadishu, Somalia",
//     contractAmount: "5,678,000.00",
//   };

//   const sampleFormData = {
//     certificateNo: "TOC-2025-001",
//     reportMonth: "DECEMBER",
//     reportYear: "2025",
//     LogoImage: "", // Add base64 string here if you have one
//   };

//   return (
//     <div className="p-4">
//       <div className="mb-4 text-center">
//         <h2 className="text-2xl font-bold mb-2">Monthly Progress Report PDF</h2>
//       </div>
//       <MonthlyProgressReportPdf
//         formData={sampleFormData}
//         contentRef={contentRef}
//         projectDetails={sampleProjectDetails}
//       />
//     </div>
//   );
// };

// export default PDFDemo;
