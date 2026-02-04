import React, { useEffect, useRef, useState } from "react";

const MeetingMinutesPdf = ({ formData, contentRef, projectDetails }) => {
  const [data, setData] = useState({
    clientName: "",
    projectTitle: "",
    projectNo: "",
    date: "",
    time: "",
    venue: "",
    attendees: "",
    agenda: "",
    discussions: "",
    actionItems: "",
    preparedBy: "",
    preparedDate: "",
    clientName: "",
    clientAddress: "",
    LogoImage: "",
    clientContact: "",
  });

  useEffect(() => {
    if (!formData || !projectDetails) return;

    setData({
      clientName: projectDetails?.clientInfo?.ClientName || "Client Name",
      projectTitle:
        projectDetails?.projectName ||
        "proposed construction of daynille road (Copy)",
      projectNo: projectDetails?.projectNo || "",
      date: formData.meetingDate || "Thursday, December 4, 2025",
      time: formData.meetingTime || "10:00",
      venue: formData.venue || "Not specified",
      attendees: formData.attendees || "Not specified",
      agenda: formData.agenda || "Not specified",
      discussions: formData.discussions || "Not specified",
      actionItems: formData.actionItems || "Not specified",
      preparedBy: formData.preparedBy || "",
      preparedDate: formData.preparedDate || "December 4, 2025",
      clientName: projectDetails?.clientInfo?.ClientName || "",
      clientAddress: projectDetails?.clientInfo?.Address || "",
      clientContact: projectDetails?.clientInfo?.phone || "",
      LogoImage: projectDetails?.clientInfo?.ClientLogo || "",
    });
  }, [formData, projectDetails]);

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
                    borderTop: "3px solid #1e3a8a",
                    marginBottom: "20px",
                  }}
                ></div>
              </div>

              {/* Title Section */}
              <div style={{ textAlign: "center", marginBottom: "30px" }}>
                <h2
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#1e3a8a",
                    marginBottom: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  MEETING MINUTES
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#4b5563",
                    marginBottom: "5px",
                  }}
                >
                  {data.projectTitle}
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                  }}
                >
                  Project No: {data.projectNo}
                </p>
              </div>

              <div
                style={{
                  borderTop: "1px solid #d1d5db",
                  marginBottom: "25px",
                }}
              ></div>

              {/* Date and Time */}
              <div
                style={{
                  display: "flex",
                  marginBottom: "25px",
                  gap: "40px",
                }}
              >
                <div style={{ flex: "1" }}>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#1e3a8a",
                      fontWeight: "600",
                      marginBottom: "5px",
                    }}
                  >
                    Date:
                  </p>
                  <p style={{ fontSize: "14px", color: "#374151" }}>
                    {data.date}
                  </p>
                </div>
                <div style={{ flex: "1" }}>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#1e3a8a",
                      fontWeight: "600",
                      marginBottom: "5px",
                    }}
                  >
                    Time:
                  </p>
                  <p style={{ fontSize: "14px", color: "#374151" }}>
                    {data.time}
                  </p>
                </div>
              </div>

              {/* Venue */}
              <div style={{ marginBottom: "25px" }}>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#1e3a8a",
                    fontWeight: "600",
                    marginBottom: "5px",
                  }}
                >
                  Venue:
                </p>
                <p style={{ fontSize: "14px", color: "#374151" }}>
                  {data.venue}
                </p>
              </div>

              {/* Attendees */}
              <div style={{ marginBottom: "25px" }}>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#1e3a8a",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  Attendees
                </p>

                <div
                  className="rich-html"
                  style={{ fontSize: "14px", color: "#374151" }}
                  dangerouslySetInnerHTML={{ __html: data.attendees }}
                ></div>
              </div>

              {/* Agenda */}
              <div style={{ marginBottom: "25px" }}>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#1e3a8a",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  Agenda
                </p>
                <div
                  className="rich-html"
                  style={{ fontSize: "14px", color: "#374151" }}
                  dangerouslySetInnerHTML={{ __html: data.agenda }}
                ></div>
              </div>

              {/* Discussions & Decisions */}
              <div style={{ marginBottom: "25px" }}>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#1e3a8a",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  Discussions & Decisions
                </p>
                <div
                  className="rich-html"
                  style={{ fontSize: "14px", color: "#374151" }}
                  dangerouslySetInnerHTML={{ __html: data.discussions }}
                ></div>
              </div>

              {/* Action Items */}
              <div style={{ marginBottom: "40px" }}>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#1e3a8a",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  Action Items
                </p>

                <div
                  className="rich-html"
                  style={{ fontSize: "14px", color: "#374151" }}
                  dangerouslySetInnerHTML={{ __html: data.actionItems }}
                ></div>
              </div>

              {/* Footer */}
              <div
                style={{
                  borderTop: "1px solid #d1d5db",
                  paddingTop: "25px",
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "50px",
                }}
              >
                <div style={{ flex: "1" }}>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginBottom: "8px",
                    }}
                  >
                    Prepared by:
                  </p>
                  <div
                    style={{
                      borderTop: "1px solid #9ca3af",
                      paddingTop: "8px",
                      marginTop: "20px",
                    }}
                  >
                    <p style={{ fontSize: "12px", color: "#9ca3af" }}>
                      Name & Signature
                    </p>
                  </div>
                </div>
                <div style={{ flex: "1", marginLeft: "40px" }}>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginBottom: "8px",
                    }}
                  >
                    Date:
                  </p>
                  <div
                    style={{
                      borderTop: "1px solid #9ca3af",
                      paddingTop: "8px",
                      marginTop: "20px",
                    }}
                  >
                    <p style={{ fontSize: "14px", color: "#374151" }}>
                      {data.preparedDate}
                    </p>
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

export default MeetingMinutesPdf;
