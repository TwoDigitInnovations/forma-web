import moment from "moment";
import React, { useEffect, useState } from "react";

const MonthlyProgressReportPdf = ({
  data,
  Summary,
  setSummary,
  contentRef,
}) => {
  const safeNumber = (value) => {
    const num = Number(value);
    return isNaN(num) || num < 0 ? 0 : num;
  };

  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

  useEffect(() => {
    if (!data) return;

    const advance = safeNumber(data?.advancePayment);
    const contract = safeNumber(data?.contractAmount);
    const paid = safeNumber(data?.paidAmount);

    const progressAmount = paid;

    const rawProgress = contract > 0 ? (progressAmount / contract) * 100 : 0;
    console.log(progressAmount, contract);

    console.log(rawProgress);

    const progress = clamp(Number(rawProgress.toFixed(2)), 0, 100);

    const remainingPayment = Math.max(contract - progressAmount, 0);

    let totalSubmitted = 0;
    let totalInProcess = 0;
    let totalPaid = 0;

    data?.certificates?.forEach((certificate) => {
      const amt = safeNumber(certificate?.amount);

      switch (certificate?.status) {
        case "Submitted":
          totalSubmitted += amt;
          break;
        case "In-Process":
          totalInProcess += amt;
          break;
        case "Paid":
          totalPaid += amt;
          break;
        default:
          break;
      }
    });

    setSummary({
      advancePayment: advance,
      contractAmount: contract,
      paidAmount: paid,
      progress, // always 0–100
      remainingPayment, // never negative
      totalSubmitted,
      totalInProcess,
      totalPaid,
    });
  }, [data]);

  const tdStyle = {
    border: "1px solid #D1D5DB",
    padding: "12px",
    backgroundColor: "#FFFFFF",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        marginTop: "32px",
        borderRadius: "16px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            overflow: "hidden",
          }}
        >
          <div
            ref={contentRef}
            style={{
              width: "300mm",
              minHeight: "297mm",
              backgroundColor: "#ffffff",
              color: "#000000",
              fontFamily: "sans-serif",
              paddingLeft: "48px",
              paddingRight: "48px",
              paddingTop: "40px",
              paddingBottom: "40px",
              boxSizing: "border-box",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              {data.LogoImage && (
                <img
                  src={data.LogoImage}
                  alt="Logo"
                  style={{
                    maxWidth: "120px",
                    height: "auto",
                    margin: "0 auto 32px auto",
                    display: "block",
                  }}
                />
              )}

              <h1
                style={{
                  fontSize: "22px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                {data.clientName}
              </h1>

              <div
                style={{
                  display: "inline-block",
                  // background: "#FCD34D",
                  padding: "8px 0px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                {data.projectTitle}
              </div>
            </div>

            <div style={{ textAlign: "center", margin: "40px 0" }}>
              <div
                style={{
                  display: "inline-block",
                  // background: "#2563EB",
                  padding: "16px 28px",
                  borderRadius: "10px",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
                }}
              >
                <h2
                  style={{
                    fontSize: "22px",
                    color: "black",
                    fontWeight: "bold",
                    letterSpacing: "1px",
                    margin: 0,
                  }}
                >
                  MONTHLY PROGRESS REPORT – {data.reportMonth} {data.reportYear}
                </h2>
              </div>
            </div>

            {data?.coverUrl && (
              <img
                src={data?.coverUrl}
                alt="Cover"
                style={{
                  maxWidth: "420px",
                  height: "auto",
                  margin: "0 auto 32px auto",
                  display: "block",
                }}
              />
            )}

            <div style={{ textAlign: "center", margin: "30px 0" }}>
              <p style={{ fontSize: "18px", fontWeight: 600 }}>
                {data.reportMonth}, {data.reportYear}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
                margin: "40px 0",
              }}
            >
              {data?.leftLogo && (
                <img
                  src={data?.leftLogo}
                  alt="Left Logo"
                  style={{ maxWidth: "110px", height: "auto" }}
                />
              )}

              {data?.rightLogo && (
                <img
                  src={data?.rightLogo}
                  alt="Right Logo"
                  style={{ maxWidth: "110px", height: "auto" }}
                />
              )}
            </div>

            <div style={{ marginTop: "56px" }}>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "20px",
                }}
              >
                TABLE OF CONTENTS
              </h3>

              <div style={{ fontSize: "14px", lineHeight: "24px" }}>
                <p style={{ fontWeight: 600 }}>1. INTRODUCTION</p>
                <p style={{ marginLeft: "20px" }}>1.1 Project Summary</p>
                <p style={{ marginLeft: "20px", marginBottom: "12px" }}>
                  1.2 Location and Extents of Works
                </p>

                <p style={{ fontWeight: 600 }}>2. PROJECT INFORMATION</p>

                <p style={{ fontWeight: 600, marginTop: "10px" }}>
                  3. SCOPE OF WORK
                </p>

                <p style={{ fontWeight: 600, marginTop: "10px" }}>
                  4. PROGRESS
                </p>
                <p style={{ marginLeft: "20px" }}>4.1 Overall Progress</p>
                <p style={{ marginLeft: "20px" }}>4.2 Work Progress</p>
                <p style={{ marginLeft: "20px", marginBottom: "10px" }}>
                  4.3 Financial Progress
                </p>

                <p style={{ fontWeight: 600, marginTop: "10px" }}>
                  5. WORK PLAN
                </p>

                <p style={{ fontWeight: 600, marginTop: "10px" }}>
                  6. CLIENT PERSONNEL
                </p>

                <p style={{ fontWeight: 600, marginTop: "10px" }}>
                  7. CONTRACTOR PERSONNEL
                </p>

                <p style={{ fontWeight: 600, marginTop: "10px" }}>
                  8. CONTRACTOR'S EQUIPMENT
                </p>

                <p style={{ fontWeight: 600, marginTop: "10px" }}>
                  9. ISSUES AND CONCERNS
                </p>
              </div>
            </div>

            {/* INTRODUCTION */}
            <div style={{ marginTop: "32px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
                1. INTRODUCTION
              </h2>

              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginTop: "16px",
                }}
              >
                1.1 Project Summary
              </h3>

              {data?.ProjectSummary ? (
                <p style={{ fontSize: "14px", color: "#555" }}>
                  {data?.ProjectSummary}
                </p>
              ) : (
                <p style={{ fontSize: "14px", color: "#555" }}>
                  No description provided for this project.
                </p>
              )}

              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginTop: "16px",
                }}
              >
                1.2 Location and Extents of Works
              </h3>

              <p style={{ fontSize: "14px", color: "#555" }}>
                <span style={{ fontWeight: 600 }}>Location:</span>{" "}
                {data.location}
              </p>
            </div>

            {/* PROJECT INFO */}
            <div style={{ marginTop: "40px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
                2. PROJECT INFORMATION
              </h2>

              <div
                dangerouslySetInnerHTML={{
                  __html: data?.ExcuetiveSummary || "",
                }}
              ></div>

              {/* TABLE */}
              <table
                style={{
                  width: "1000px",
                  borderCollapse: "collapse",
                  fontSize: "14px",
                  marginTop: "20px",
                  marginBottom: "24px",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px",
                        background: "#f5f5f5",
                        fontWeight: 600,
                        textAlign: "left",
                      }}
                    >
                      Item
                    </th>
                    <th
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px",
                        background: "#f5f5f5",
                        fontWeight: 600,
                        textAlign: "left",
                      }}
                    >
                      Details
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {[
                    ["1. Contractor", data.contractorName],
                    ["2. Contract Sum (USD)", `$${data.contractAmount}`],
                    ["3. Source of funds", data.clientName],
                    ["4. Start Date", "July 8, 2025"],
                    ["5. Commencement date", "July 8, 2025"],
                    ["6. Original Contract period", "-"],
                    ["7. Date of Completion", "March 4, 2026"],
                    ["8. Period Elapsed", "5 Months"],
                    ["9. Percentage of Time Elapsed", "63%"],
                    ["10. Physical progress to date", "4%"],
                    ["11. Defects Liability Period", "-"],
                    [
                      "12. Total Amount certified to date",
                      `$${Summary?.totalPaid}`,
                    ],
                    ["13. Advance Payment", `$${Summary?.advancePayment}`],
                    ["14. Percentage of amount certified to date", "0%"],
                  ].map(([item, value], index) => (
                    <tr key={index}>
                      <td
                        style={{
                          border: "1px solid #ccc",
                          padding: "8px",
                          verticalAlign: "top",
                        }}
                      >
                        {item}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ccc",
                          padding: "8px",
                          verticalAlign: "top",
                        }}
                      >
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: "32px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
                3. SCOPE OF WORK
              </h2>

              {data.ProjectScope ? (
                <div
                  dangerouslySetInnerHTML={{ __html: data.ProjectScope }}
                  style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}
                ></div>
              ) : (
                <p
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    marginTop: "8px",
                    marginBottom: "20px",
                  }}
                >
                  No scope of work details provided.
                </p>
              )}
            </div>

            <div style={{ marginTop: "32px" }}>
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                4. PROGRESS
              </h2>

              {/* 4.1 Overall Progress */}
              <p
                style={{
                  fontSize: "15px",
                  color: "#666",
                  marginBottom: "20px",
                }}
              >
                4.1 Overall Progress
              </p>

              <div style={{ width: "1000px", marginBottom: "24px" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "40px",
                  }}
                >
                  <div>
                    <p style={{ fontSize: "13px", color: "#777" }}>
                      Completion Status
                    </p>

                    <p style={{ fontSize: "26px", fontWeight: "bold" }}>
                      {data?.actualProgress ?? 0}%
                    </p>

                    <div
                      style={{
                        width: "100%",
                        background: "#d1d5db",
                        height: "12px",
                        borderRadius: "10px",
                        marginTop: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "12px",
                          width: `${Math.min(data?.actualProgress || 0, 100)}%`,
                          background: "#fbbf24",
                          borderRadius: "10px",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>
                  </div>

                  {/* Days Elapsed */}
                  <div>
                    <p style={{ fontSize: "13px", color: "#777" }}>
                      Days Elapsed
                    </p>
                    <p style={{ fontSize: "26px", fontWeight: "bold" }}>63%</p>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#777",
                        marginTop: "5px",
                      }}
                    >
                      150 / 239 days
                    </p>

                    <div
                      style={{
                        width: "100%",
                        background: "#d1d5db",
                        height: "12px",
                        borderRadius: "10px",
                        marginTop: "8px",
                      }}
                    >
                      <div
                        style={{
                          height: "12px",
                          width: "63%",
                          background: "#fbbf24",
                          borderRadius: "10px",
                        }}
                      ></div>
                    </div>
                  </div>

                
                  <div>
                    <p style={{ fontSize: "13px", color: "#777" }}>
                      Budget Used
                    </p>
                    <p style={{ fontSize: "26px", fontWeight: "bold" }}>
                      {Summary?.progress}%
                    </p>

                    <div
                      style={{
                        width: "100%",
                        background: "#d1d5db",
                        height: "12px",
                        borderRadius: "10px",
                        marginTop: "8px",
                      }}
                    >
                      <div
                        style={{
                          height: "12px",
                          width: Summary?.progress + "%",
                          background: "#fbbf24",
                          borderRadius: "10px",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <p
                style={{
                  fontSize: "15px",
                  color: "#666",
                  marginBottom: "20px",
                }}
              >
                4.2 Financial Progress
              </p>

              <div style={{ width: "100%" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "24px",
                    marginBottom: "24px",
                  }}
                >
                  <div>
                    <p style={{ fontSize: "13px", color: "#777" }}>
                      Contract Amount
                    </p>
                    <p style={{ fontSize: "20px", fontWeight: "600" }}>
                      ${Summary.contractAmount}
                    </p>
                  </div>

                  <div>
                    <p style={{ fontSize: "13px", color: "#777" }}>
                      Total Certified
                    </p>
                    <p style={{ fontSize: "20px", fontWeight: "600" }}>
                      ${Summary.paidAmount}
                    </p>
                  </div>

                  <div>
                    <p style={{ fontSize: "13px", color: "#777" }}>Balance</p>
                    <p
                      style={{
                        fontSize: "20px",
                        fontWeight: "600",
                        color: "red",
                      }}
                    >
                      ${Summary.remainingPayment}
                    </p>
                  </div>

                  <div>
                    <p style={{ fontSize: "13px", color: "#777" }}>
                      Financial Progress
                    </p>
                    <p style={{ fontSize: "20px", fontWeight: "600" }}>
                      {Summary.progress}%
                    </p>
                  </div>
                </div>

                {/* IPC TABLE */}
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "12px",
                  }}
                >
                  Interim Payment Certificates (IPCs)
                </h3>

                <table
                  style={{
                    width: "100%",
                    borderCollapse: "separate",
                    borderSpacing: "0",
                    fontSize: "14px",
                    border: "1px solid #d1d5db", // gray-300
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        color: "#666",
                        fontSize: "13px",
                        textAlign: "left",
                        background: "#f9fafb",
                      }}
                    >
                      {[
                        "#",
                        "Certificate No.",
                        "Date Certified",
                        "Submitted Amount",
                        "In Process Amount",
                        "Amount Paid",
                        "Payment Status",
                      ].map((h, i) => (
                        <th
                          key={i}
                          style={{
                            padding: "10px 8px",
                            borderBottom: "1px solid #d1d5db",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {/* Advance Row */}
                    <tr style={{ background: "#ffffff" }}>
                      {[
                        "1.",
                        "Advance Payment",
                        "-",
                        "-",
                        "-",
                        `$${Summary.advancePayment}`,
                      ].map((cell, i) => (
                        <td
                          key={i}
                          style={{
                            padding: "8px",
                            borderBottom: "1px solid #e5e7eb", // gray-200
                          }}
                        >
                          {cell}
                        </td>
                      ))}
                      <td
                        style={{
                          padding: "8px",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        <span
                          style={{
                            // padding: "4px 10px",
                            // background: "#1f2937",
                            color: "black",
                            fontWeight:"600",
                            fontSize: "12px",
                            borderRadius: "50px",
                          }}
                        >
                          Paid
                        </span>
                      </td>
                    </tr>

                    {/* Dynamic rows */}
                    {data.certificates?.map((certificate, key) => {
                      let submittedAmount = "-";
                      let inProcessAmount = "-";
                      let paidAmount = "-";

                      if (certificate.status === "Submitted")
                        submittedAmount = `$${certificate.amount}`;
                      else if (certificate.status === "In-Process")
                        inProcessAmount = `$${certificate.amount}`;
                      else if (certificate.status === "Paid")
                        paidAmount = `$${certificate.amount}`;

                      return (
                        <tr key={key} style={{ background: "#ffffff" }}>
                          {[
                            `${key + 1}.`,
                            certificate.certificateNo,
                            moment(certificate.date).format("DD-MM-YYYY"),
                            submittedAmount,
                            inProcessAmount,
                            paidAmount,
                          ].map((cell, i) => (
                            <td
                              key={i}
                              style={{
                                padding: "8px",
                                borderBottom: "1px solid #e5e7eb",
                              }}
                            >
                              {cell}
                            </td>
                          ))}
                          <td
                            style={{
                              padding: "8px",
                              borderBottom: "1px solid #e5e7eb",
                            }}
                          >
                            <span
                              style={{
                                // padding: "4px 10px",
                                // background: "#e5e7eb",
                                color: "#555",
                                fontWeight:"600",
                                fontSize: "12px",
                                borderRadius: "50px",
                              }}
                            >
                              {certificate.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}

                    <tr
                      style={{
                        background: "#f3f4f6",
                        fontWeight: "bold",
                      }}
                    >
                      <td style={{ padding: "8px" }}></td>
                      <td style={{ padding: "8px" }}></td>
                      <td style={{ padding: "8px", textAlign: "right" }}>
                        Total:
                      </td>
                      <td style={{ padding: "8px" }}>
                        ${Summary?.totalSubmitted}
                      </td>
                      <td style={{ padding: "8px" }}>
                        ${Summary?.totalInProcess}
                      </td>
                      <td style={{ padding: "8px" }}>
                        ${Summary?.totalPaid + Summary?.advancePayment}
                      </td>
                      <td style={{ padding: "8px" }}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ marginTop: "32px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
                5. WORK PLAN
              </h2>

              <div style={{ width: "100%", borderRadius: "10px" }}>
                {data?.workplan?.map((plan, key) => (
                  <div
                    key={key}
                    style={{ marginBottom: "24px", marginTop: "16px" }}
                  >
                    <p
                      style={{
                        fontWeight: "600",
                        fontSize: "16px",
                        marginBottom: "10px",
                      }}
                    >
                      {plan.planName}
                    </p>

                    <table
                      style={{
                        width: "100%",
                        fontSize: "14px",
                        borderCollapse: "collapse",
                      }}
                    >
                      <thead>
                        <tr style={{ borderBottom: "1px solid #ddd" }}>
                          <th style={{ padding: "8px", fontWeight: "600" }}>
                            Activity Name
                          </th>
                          <th style={{ padding: "8px", fontWeight: "600" }}>
                            Start Date
                          </th>
                          <th style={{ padding: "8px", fontWeight: "600" }}>
                            Duration
                          </th>
                          <th style={{ padding: "8px", fontWeight: "600" }}>
                            End Date
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {plan?.workActivities?.length > 0 ? (
                          plan.workActivities.map((item, index) => (
                            <tr
                              key={index}
                              style={{ borderBottom: "1px solid #ddd" }}
                            >
                              <td style={{ padding: "8px" }}>
                                {item.description || "-"}
                              </td>
                              <td style={{ padding: "8px" }}>
                                {item.startDate
                                  ? moment(item.startDate).format(
                                      "MMMM DD, YYYY",
                                    )
                                  : "-"}
                              </td>
                              <td style={{ padding: "8px" }}>
                                {item.duration
                                  ? `${item.duration} days`
                                  : "days"}
                              </td>
                              <td style={{ padding: "8px" }}>
                                {item.endDate
                                  ? moment(item.endDate).format("MMMM DD, YYYY")
                                  : "-"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={4}
                              style={{
                                textAlign: "center",
                                padding: "12px",
                                color: "#666",
                                fontStyle: "italic",
                              }}
                            >
                              No activities available for this workplan.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: "32px" }}>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  marginBottom: "16px",
                }}
              >
                6. CLIENT PERSONNEL
              </h2>

              {data?.clientPersonnel ? (
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "14px",
                    marginTop: "12px",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#EFF6FF" }}>
                      {[
                        "Client Name",
                        "Email",
                        "Contact Person",
                        "Contact",
                        "Address",
                      ].map((item) => (
                        <th
                          key={item}
                          style={{
                            border: "1px solid #D1D5DB",
                            padding: "12px",
                            textAlign: "left",
                            fontWeight: 600,
                          }}
                        >
                          {item}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    <tr style={{ backgroundColor: "#fff" }}>
                      <td style={tdStyle}>
                        {data.clientPersonnel?.ClientName || "-"}
                      </td>
                      <td style={tdStyle}>
                        {data.clientPersonnel?.Email || "-"}
                      </td>
                      <td style={tdStyle}>
                        {data.clientPersonnel?.contactPerson || "-"}
                      </td>
                      <td style={tdStyle}>
                        {data.clientPersonnel?.phone || "-"}
                      </td>
                      <td style={tdStyle}>
                        {data.clientPersonnel?.Address || "-"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p
                  style={{
                    fontSize: "14px",
                    color: "#4B5563",
                    fontStyle: "italic",
                  }}
                >
                  No client personnel recorded for this project.
                </p>
              )}
            </div>

            <div style={{ marginTop: "32px" }}>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  marginBottom: "16px",
                }}
              >
                7. CONTRACTOR PERSONNEL
              </h2>

              {data?.contractorPersonnel ? (
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "14px",
                    marginTop: "12px",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#FFFBEB" }}>
                      {["Name", "Email", "Contact Person", "Contact"].map(
                        (item) => (
                          <th
                            key={item}
                            style={{
                              border: "1px solid #D1D5DB",
                              padding: "12px",
                              textAlign: "left",
                              fontWeight: 600,
                            }}
                          >
                            {item}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td style={tdStyle}>
                        {data?.contractorPersonnel?.contractorName || "-"}
                      </td>
                      <td style={tdStyle}>
                        {data?.contractorPersonnel?.Email || "-"}
                      </td>
                      <td style={tdStyle}>
                        {data?.contractorPersonnel?.contactPerson || "-"}
                      </td>
                      <td style={tdStyle}>
                        {data?.contractorPersonnel?.phone || "-"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p
                  style={{
                    fontSize: "14px",
                    color: "#4B5563",
                    fontStyle: "italic",
                  }}
                >
                  No contractor personnel recorded for this project.
                </p>
              )}
            </div>

            {/* 8. CONTRACTOR EQUIPMENT */}
            <div style={{ marginTop: "32px" }}>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  marginBottom: "16px",
                }}
              >
                8. CONTRACTOR'S EQUIPMENT
              </h2>

              {data.contractorEquipment &&
              data.contractorEquipment.length > 0 ? (
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "14px",
                    marginTop: "12px",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#ECFDF5" }}>
                      {[
                        "S/N",
                        "Name",
                        "Equipment Type",
                        "Quantity",
                        "Condition",
                      ].map((item) => (
                        <th
                          key={item}
                          style={{
                            border: "1px solid #D1D5DB",
                            padding: "12px",
                            textAlign: "left",
                            fontWeight: 600,
                          }}
                        >
                          {item}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {data.contractorEquipment.map((equipment, index) => (
                      <tr key={index}>
                        <td style={tdStyle}>{index + 1}</td>
                        <td style={tdStyle}>{equipment.name || "-"}</td>
                        <td style={tdStyle}>{equipment.type || "-"}</td>
                        <td style={tdStyle}>{equipment.quantity || "-"}</td>
                        <td style={tdStyle}>{equipment.condition || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p
                  style={{
                    fontSize: "14px",
                    color: "#4B5563",
                    fontStyle: "italic",
                  }}
                >
                  No contractor equipment recorded for this project.
                </p>
              )}
            </div>

            {/* 9. ISSUES AND CONCERNS */}
            <div style={{ marginTop: "40px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>
                9. ISSUES AND CONCERNS
              </h2>

              {data?.issuesConcern && data.issuesConcern.length > 0 ? (
                data.issuesConcern.map((issue, key) => (
                  <div
                    key={key}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      background: "#F3FDF3",
                      marginTop: "12px",
                    }}
                  >
                    <p
                      style={{
                        color: "#1F2937",
                        fontWeight: 500,
                        marginBottom: "8px",
                      }}
                    >
                      {issue.description}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          padding: "4px 12px",
                          fontSize: "13px",
                          borderRadius: "14px",
                          background: "#FEF3C7",
                          color: "#B45309",
                          fontWeight: 600,
                        }}
                      >
                        {issue.status}
                      </span>

                      <span style={{ fontSize: "13px", color: "#4B5563" }}>
                        {moment(issue.dueDate).format("DD-MM-YYYY")}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <h3
                  style={{
                    fontSize: "16px",
                    marginTop: "8px",
                    marginBottom: "20px",
                  }}
                >
                  No issues or concerns recorded for this project.
                </h3>
              )}

              {/* Prepared / Reviewed */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "32px",
                  marginBottom: "24px",
                }}
              >
                <div>
                  <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                    Prepared by:
                  </p>
                  <p style={{ fontSize: "14px" }}>Project Manager</p>
                </div>

                <div>
                  <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                    Reviewed by:
                  </p>
                  <p style={{ fontSize: "14px" }}>Client Representative</p>
                  <p style={{ fontSize: "14px" }}>{data.clientName}</p>
                </div>
              </div>

              <p style={{ textAlign: "center", fontSize: "16px" }}>
                {data.reportMonth} {data.reportYear}
              </p>

              <p
                style={{
                  textAlign: "center",
                  fontSize: "14px",
                  marginTop: "24px",
                }}
              >
                This report is confidential and intended solely for the use of{" "}
                {data.clientName}
              </p>

              <p style={{ textAlign: "center", fontSize: "14px" }}>
                ConstructTrack Project Management System - {data.reportMonth} ,{" "}
                {data.reportYear}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyProgressReportPdf;
