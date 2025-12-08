import React, { useEffect, useState } from "react";

const MonthlyProgressReportPdf = ({ formData, contentRef, projectDetails , editData , editId , data,setData }) => {

useEffect(() => {
  if (!formData || !projectDetails) return;

  const newData = {
    clientName: projectDetails?.clientInfo?.ClientName || "BRA",
    coverUrl: formData?.coverPhoto || "",
    leftLogo: formData?.leftLogo || "",
    rightLogo: formData?.rightLogo || "",
    ProjectScope: formData?.ProjectScope || "",
    ProjectSummary: projectDetails.description || "",
    ExcuetiveSummary: projectDetails?.ExcuetiveSummary || "",
    projectTitle:
      projectDetails?.projectName || "proposed construction of daynille road",
    projectNo: projectDetails?.projectNo || "",
    LogoImage: formData?.topLogo || "",
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
    contractorEquipment: projectDetails?.contractorInfo?.equipment || [],
    contractorPersonnel: projectDetails?.contractorInfo || {},
    clientPersonnel: projectDetails?.clientInfo || {},
  };

  setData(prev => {
    if (JSON.stringify(prev) === JSON.stringify(newData)) return prev;
    return newData;
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

  const CoverUrl = convertBase64ToUrl(data?.coverUrl);
  const LeftLogo = convertBase64ToUrl(data?.leftLogo);
  const RightLogo = convertBase64ToUrl(data?.rightLogo);


  return (
    <div className="min-h-screen mt-8 rounded-2xl">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          <div
            ref={contentRef}
            className="w-[260mm] min-h-[297mm] bg-white text-black font-sans px-12 py-10"
          >
           
            <div className="text-center mb-10">
              {data.LogoImage && (
                <img
                  src={data.LogoImage}
                  alt="Logo"
                  className="max-w-[120px] h-auto mx-auto mb-8"
                />
              )}

              <h1 className="text-2xl font-bold mb-1">{data.clientName}</h1>

              <p className="text-sm text-gray-600 mb-2">{data.projectTitle}</p>

              <div className="inline-block bg-amber-300 px-5 py-2 rounded text-sm font-medium">
                {data.projectTitle}
              </div>
            </div>

            {/* ============================= */}
            {/*       REPORT TITLE SECTION    */}
            {/* ============================= */}
            <div className="text-center my-10">
              <div className="inline-block bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-4 rounded-lg shadow-lg">
                <h2 className="text-[22px] text-white font-bold tracking-wide">
                  MONTHLY PROGRESS REPORT – {data.reportMonth} {data.reportYear}
                </h2>
              </div>
            </div>

            {/* ============================= */}
            {/*           COVER IMAGE         */}
            {/* ============================= */}
            {CoverUrl && (
              <img
                src={CoverUrl}
                alt="Cover"
                className="max-w-[420px] h-auto mx-auto mb-8"
              />
            )}

            {/* ============================= */}
            {/*              DATE             */}
            {/* ============================= */}
            <div className="text-center my-8">
              <p className="text-lg font-semibold">
                {data.reportMonth} 5, {data.reportYear}
              </p>
            </div>

            {/* ============================= */}
            {/*           LOGO ROW            */}
            {/* ============================= */}
            <div className="flex justify-center items-center gap-5 my-10">
              {LeftLogo && (
                <img
                  src={LeftLogo}
                  alt="Left Logo"
                  className="max-w-[110px] h-auto"
                />
              )}

              {RightLogo && (
                <img
                  src={RightLogo}
                  alt="Right Logo"
                  className="max-w-[110px] h-auto"
                />
              )}
            </div>

            <div className="mt-14">
              <h3 className="text-lg font-bold mb-5">TABLE OF CONTENTS</h3>

              <div className="text-sm leading-7">
                <p className="font-semibold">1. INTRODUCTION</p>
                <p className="ml-5">1.1 Project Summary</p>
                <p className="ml-5 mb-3">1.2 Location and Extents of Works</p>

                <p className="font-semibold">2. PROJECT INFORMATION</p>

                <p className="font-semibold mt-2">3. SCOPE OF WORK</p>

                <p className="font-semibold mt-2">4. PROGRESS</p>
                <p className="ml-5">4.1 Overall Progress</p>
                <p className="ml-5">4.2 Work Progress</p>
                <p className="ml-5 mb-2">4.3 Financial Progress</p>

                <p className="font-semibold mt-2">5. WORK PLAN</p>

                <p className="font-semibold mt-2">6. CLIENT PERSONNEL</p>

                <p className="font-semibold mt-2">7. CONTRACTOR PERSONNEL</p>

                <p className="font-semibold mt-2">8. CONTRACTOR'S EQUIPMENT</p>

                <p className="font-semibold mt-2">9. ISSUES AND CONCERNS</p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-bold">1. INTRODUCTION</h2>
              <h3 className="text-base font-bold mt-4">1.1 Project Summary</h3>
              {data?.ProjectSummary ? (
                <p className="text-sm text-gray-600">{data?.ProjectSummary}</p>
              ) : (
                <p className="text-sm text-gray-600">
                  No description provided for this project.
                </p>
              )}

              {/* 1.2 Location */}
              <h3 className="text-base font-bold mt-4">
                1.2 Location and Extents of Works
              </h3>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Location:</span> {data.location}
              </p>
            </div>

            <div className="mt-10">
              <h2 className="text-lg font-bold">2. PROJECT INFORMATION</h2>

              <div
                dangerouslySetInnerHTML={{
                  __html: data?.ExcuetiveSummary || "",
                }}
              ></div>
              {/* Table */}
              <table className="w-full border-collapse text-sm mt-5 mb-6">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 bg-gray-100 font-semibold">
                      Item
                    </th>
                    <th className="border border-gray-300 p-2 bg-gray-100 font-semibold">
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
                    ["12. Total Amount certified to date", "$2,000.00"],
                    ["13. Advance Payment", "$1,000.00"],
                    ["14. Percentage of amount certified to date", "0%"],
                  ].map(([item, value], index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">{item}</td>
                      <td className="border border-gray-300 p-2">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-bold">3. SCOPE OF WORK</h2>

              <p className="text-base text-gray-600 mt-2 mb-5">
                No scope of work details provided.
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-bold mb-2">4. PROGRESS</h2>

              <p className="text-base text-gray-600 mb-5">
                4.1 Overall Progress
              </p>
              <p className="text-base text-gray-600 mb-6">----</p>

              <p className="text-base text-gray-600 mb-5">4.2 Work Progress</p>
              <p className="text-base text-gray-600 mb-6">---</p>

              <p className="text-base text-gray-600 mb-5">
                4.3 Financial Progress
              </p>
              <p className="text-base text-gray-600 mb-6">---</p>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-bold">5. WORK PLAN</h2>

              <h3 className="text-base mt-1 mb-5">----</h3>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-bold mb-4">6. CLIENT PERSONNEL</h2>

              {data?.clientPersonnel ? (
                <table className="w-full border-collapse text-sm mt-3">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="border border-gray-300 p-3 text-left font-semibold">
                        Client Name
                      </th>
                      <th className="border border-gray-300 p-3 text-left font-semibold">
                        Email
                      </th>
                      <th className="border border-gray-300 p-3 text-left font-semibold">
                        Contact Person
                      </th>
                      <th className="border border-gray-300 p-3 text-left font-semibold">
                        Contact
                      </th>
                      <th className="border border-gray-300 p-3 text-left font-semibold">
                        Address
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-3">
                        {data.clientPersonnel?.ClientName || "-"}
                      </td>
                      <td className="border border-gray-300 p-3">
                        {data.clientPersonnel?.Email || "-"}
                      </td>
                      <td className="border border-gray-300 p-3">
                        {data.clientPersonnel?.contactPerson || "-"}
                      </td>
                      <td className="border border-gray-300 p-3">
                        {data.clientPersonnel?.phone || "-"}
                      </td>
                      <td className="border border-gray-300 p-3">
                        {data.clientPersonnel?.Address || "-"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-gray-600 italic">
                  No client personnel recorded for this project.
                </p>
              )}
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-bold mb-4">
                7. CONTRACTOR PERSONNEL
              </h2>

              {data?.contractorPersonnel ? (
                <table className="w-full border-collapse text-sm mt-3">
                  <thead>
                    <tr className="bg-amber-50">
                      <th className="border border-gray-300 p-3 text-left font-semibold">
                        Name
                      </th>
                      <th className="border border-gray-300 p-3 text-left font-semibold">
                        Email
                      </th>
                      <th className="border border-gray-300 p-3 text-left font-semibold">
                        Contact Person
                      </th>
                      <th className="border border-gray-300 p-3 text-left font-semibold">
                        Contact
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-3">
                        {data?.contractorPersonnel?.contractorName || "-"}
                      </td>
                      <td className="border border-gray-300 p-3">
                        {data?.contractorPersonnel?.Email || "-"}
                      </td>
                      <td className="border border-gray-300 p-3">
                        {data?.contractorPersonnel?.contactPerson || "-"}
                      </td>
                      <td className="border border-gray-300 p-3">
                        {data?.contractorPersonnel?.phone || "-"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-gray-600 italic">
                  No contractor personnel recorded for this project.
                </p>
              )}
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-bold mb-4">
                8. CONTRACTOR'S EQUIPMENT
              </h2>

              {data.contractorEquipment &&
              data.contractorEquipment.length > 0 ? (
                <table className="w-full border-collapse text-sm mt-3">
                  <thead>
                    <tr className="bg-green-50">
                      <th className="border border-gray-300 p-3 text-left font-semibold">
                        S/N
                      </th>
                      <th className="border border-gray-300 p-3 text-left font-semibold">
                        Name
                      </th>
                      <th className="border border-gray-300 p-3 text-left font-semibold">
                        Equipment Type
                      </th>
                      <th className="border border-gray-300 p-3 text-left font-semibold">
                        Quantity
                      </th>
                      <th className="border border-gray-300 p-3 text-left font-semibold">
                        Condition
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.contractorEquipment.map((equipment, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 p-3">
                          {index + 1}
                        </td>
                        <td className="border border-gray-300 p-3">
                          {equipment.name || "-"}
                        </td>
                        <td className="border border-gray-300 p-3">
                          {equipment.type || "-"}
                        </td>
                        <td className="border border-gray-300 p-3">
                          {equipment.quantity || "-"}
                        </td>
                        <td className="border border-gray-300 p-3">
                          {equipment.condition || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-gray-600 italic">
                  No contractor equipment recorded for this project.
                </p>
              )}
            </div>

            <div className="mt-10">
              <h2 className="text-lg font-bold">9. ISSUES AND CONCERNS</h2>

              <h3 className="text-base mt-1 mb-6">
                No issues or concerns recorded for this project.
              </h3>

              <div className="flex justify-between mt-10 mb-6">
                <div>
                  <p className="text-lg font-bold">Prepared by:</p>
                  <p className="text-sm">Project Manager</p>
                </div>

                <div>
                  <p className="text-lg font-bold">Reviewed by:</p>
                  <p className="text-sm">Client Representative</p>
                  <p className="text-sm">{data.clientName}</p>
                </div>
              </div>

              <p className="text-center text-base">
                5 {data.reportMonth} {data.reportYear}
              </p>

              <p className="text-center text-sm mt-6">
                This report is confidential and intended solely for the use of{" "}
                {data.clientName}
              </p>

              <p className="text-center text-sm">
                ConstructTrack Project Management System - {data.reportMonth} 5,{" "}
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
