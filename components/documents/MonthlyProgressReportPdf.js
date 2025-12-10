import moment from "moment";
import React, { useEffect, useState } from "react";

const MonthlyProgressReportPdf = ({ data, Summary, setSummary }) => {
  useEffect(() => {
    if (!data) return;

    const advance = Number(data?.advancePayment) || 0;
    const contract = Number(data?.contractAmount) || 0;
    const paid = Number(data?.paidAmount) || 0;

    const progressAmount = advance + paid;

    const progress =
      contract > 0 ? ((progressAmount / contract) * 100).toFixed(2) : 0;

    const remainingPayment = contract - progressAmount;
    let totalSubmitted = 0;
    let totalInProcess = 0;
    let totalPaid = 0;

    data.certificates?.forEach((certificate) => {
      const amt = Number(certificate.amount || 0);

      if (certificate.status === "Submitted") {
        totalSubmitted += amt;
      } else if (certificate.status === "In-Process") {
        totalInProcess += amt;
      } else if (certificate.status === "Paid") {
        totalPaid += amt;
      }
    });

    setSummary({
      advancePayment: advance,
      contractAmount: contract,
      paidAmount: paid,
      progress,
      remainingPayment,
      totalSubmitted,
      totalInProcess,
      totalPaid,
    });
  }, [data]);

  return (
    <div className="min-h-screen mt-8 rounded-2xl">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          <div className="w-[300mm] min-h-[297mm] bg-white text-black font-sans px-12 py-10">
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

            <div className="text-center my-10">
              <div className="inline-block bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-4 rounded-lg shadow-lg">
                <h2 className="text-[22px] text-white font-bold tracking-wide">
                  MONTHLY PROGRESS REPORT – {data.reportMonth} {data.reportYear}
                </h2>
              </div>
            </div>

            {data?.coverUrl && (
              <img
                src={data?.coverUrl}
                alt="Cover"
                className="max-w-[420px] h-auto mx-auto mb-8"
              />
            )}

            <div className="text-center my-8">
              <p className="text-lg font-semibold">
                {data.reportMonth} 5, {data.reportYear}
              </p>
            </div>

            <div className="flex justify-center items-center gap-5 my-10">
              {data?.leftLogo && (
                <img
                  src={data?.leftLogo}
                  alt="Left Logo"
                  className="max-w-[110px] h-auto"
                />
              )}

              {data?.rightLogo && (
                <img
                  src={data?.rightLogo}
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
                    [
                      "12. Total Amount certified to date",
                      `$${Summary?.totalPaid}`,
                    ],
                    ["13. Advance Payment", `$${Summary?.advancePayment}`],
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
              {data.ProjectScope ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: data?.ProjectScope || "",
                  }}
                ></div>
              ) : (
                <p className="text-base text-gray-600 mt-2 mb-5">
                  No scope of work details provided.
                </p>
              )}
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-bold mb-2">4. PROGRESS</h2>
              <div>
                <p className="text-base text-gray-600 mb-5">
                  4.1 Overall Progress
                </p>
                <div className="w-full mb-6">
                  <div className="grid grid-cols-3 gap-10">
                    <div>
                      <p className="text-sm text-gray-500">Completion Status</p>
                      <p className="text-2xl font-bold">4%</p>

                      <div className="w-full bg-gray-300 h-3 rounded-full mt-2">
                        <div
                          className="h-3 bg-custom-yellow rounded-full"
                          style={{ width: "10%" }}
                        ></div>
                      </div>
                    </div>

                    {/* Days Elapsed */}
                    <div>
                      <p className="text-sm text-gray-500">Days Elapsed</p>
                      <p className="text-2xl font-bold">63%</p>
                      <p className="text-sm text-gray-500 mt-1">
                        150 / 239 days
                      </p>

                      <div className="w-full bg-gray-300 h-3 rounded-full mt-2">
                        <div
                          className="h-3 bg-custom-yellow rounded-full"
                          style={{ width: "63%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Budget Used</p>
                      <p className="text-2xl font-bold">{Summary?.progress}%</p>

                      <div className="w-full bg-gray-300 h-3 rounded-full mt-2">
                        <div
                          className="h-3 bg-custom-yellow rounded-full"
                          style={{ width: Summary?.progress }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-base text-gray-600 mb-5">4.2 Work Progress</p>
              <p className="text-base text-gray-600 mb-6">---</p>

              <div className="">
                <p className="text-base text-gray-600 mb-5">
                  4.3 Financial Progress
                </p>
                <div className="w-full ">
                  <div className="grid grid-cols-4 gap-6 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Contract Amount</p>
                      <p className="text-xl font-semibold">
                        ${Summary.contractAmount}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Certified</p>
                      <p className="text-xl font-semibold">
                        ${Summary.paidAmount}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Balance</p>
                      <p className="text-xl font-semibold text-red-600">
                        -${Summary.remainingPayment}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Financial Progress
                      </p>
                      <p className="text-xl font-semibold">
                        {Summary.progress}%
                      </p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-3">
                    Interim Payment Certificates (IPCs)
                  </h3>

                  <table className="w-full border-separate border-spacing-y-2">
                    <thead>
                      <tr className="text-left text-gray-600 text-sm">
                        <th className="py-2">#</th>
                        <th className="py-2">Certificate No.</th>
                        <th className="py-2">Date Certified</th>
                        <th className="py-2">Submitted Amount</th>
                        <th className="py-2">In Process Amount</th>
                        <th className="py-2">Amount Paid</th>
                        <th className="py-2">Payment Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr className="bg-white">
                        <td className="p-2">1.</td>
                        <td className="p-2">Advance Payment</td>
                        <td className="p-2">-</td>
                        <td className="p-2">-</td>
                        <td className="p-2">-</td>
                        <td className="p-2">${Summary.advancePayment}</td>
                        <td className="p-2">
                          <span className="px-3 py-1 bg-gray-800 text-white text-sm rounded-full">
                            Paid
                          </span>
                        </td>
                      </tr>

                      {data.certificates?.map((certificate, key) => {
                        let submittedAmount = "-";
                        let inProcessAmount = "-";
                        let paidAmount = "-";

                        if (certificate.status === "Submitted") {
                          submittedAmount = `$${certificate.amount}`;
                        } else if (certificate.status === "In-Process") {
                          inProcessAmount = `$${certificate.amount}`;
                        } else if (certificate.status === "Paid") {
                          paidAmount = `$${certificate.amount}`;
                        }

                        return (
                          <tr className="bg-white" key={key}>
                            <td className="p-2">{key + 1}.</td>
                            <td className="p-2">{certificate.certificateNo}</td>
                            <td className="p-2">
                              {" "}
                              {moment(certificate.date).format("DD-MM-YYYY")}
                            </td>

                            <td className="p-2">{submittedAmount}</td>
                            <td className="p-2">{inProcessAmount}</td>
                            <td className="p-2">{paidAmount}</td>

                            <td className="p-2">
                              <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                                {certificate.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}

                      {/* TOTAL ROW */}
                      <tr className="bg-gray-100 font-semibold">
                        <td className="p-2"></td>
                        <td className="p-2"></td>
                        <td className="p-2 text-right">Total:</td>

                        <td className="p-2">${Summary?.totalSubmitted}</td>
                        <td className="p-2">${Summary?.totalInProcess}</td>
                        <td className="p-2">
                          ${Summary?.totalPaid + Summary?.advancePayment}
                        </td>

                        <td className="p-2"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-bold">5. WORK PLAN</h2>

              <div className="w-full  rounded-lg">
                <div className=" gap-6">
                  <div className="">
                    {data?.workplan?.map((plan, key) => {
                      return (
                        <div key={key} className="mb-6 mt-4">
                          <p className="font-semibold text-base mb-2">
                            {plan.planName}
                          </p>

                          <table className="w-full text-left">
                            <thead>
                              <tr className="border-b">
                                <th className="p-2 text-sm font-semibold">
                                  Activity Name
                                </th>
                                <th className="p-2 text-sm font-semibold">
                                  Start Date
                                </th>
                                <th className="p-2 text-sm font-semibold">
                                  Duration
                                </th>
                                <th className="p-2 text-sm font-semibold">
                                  End Date
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {plan?.workActivities?.length > 0 ? (
                                plan.workActivities.map((item, index) => (
                                  <tr key={index} className="border-b text-sm">
                                    <td className="p-2">
                                      {item.description || "-"}
                                    </td>

                                    <td className="p-2">
                                      {item.startDate
                                        ? moment(item.startDate).format(
                                            "MMMM DD, YYYY"
                                          )
                                        : "-"}
                                    </td>

                                    <td className="p-2">
                                      {item.duration
                                        ? `${item.duration} days`
                                        : "days"}
                                    </td>

                                    <td className="p-2">
                                      {item.endDate
                                        ? moment(item.endDate).format(
                                            "MMMM DD, YYYY"
                                          )
                                        : "-"}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td
                                    colSpan={4}
                                    className="text-center py-3 text-gray-500 italic"
                                  >
                                    No activities available for this workplan.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
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

              {data?.issuesConcern && data.issuesConcern.length > 0 ? (
                data.issuesConcern.map((issue, key) => (
                  <div
                    key={key}
                    className="w-full p-2.5 rounded-lg border shadow-sm bg-custom-green mt-3"
                  >
                    {/* Description */}
                    <p className="text-gray-800 font-medium mb-3">
                      {issue.description}
                    </p>

                    {/* Status & Date */}
                    <div className="flex items-center justify-start gap-4">
                      <span className="px-3 py-1 text-sm rounded-full font-semibold bg-yellow-200 text-yellow-900">
                        {issue.status}
                      </span>

                      <span className="text-sm text-gray-600">
                        {moment(issue.dueDate).format("DD-MM-YYYY")}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <h3 className="text-base mt-1 mb-6">
                  No issues or concerns recorded for this project.
                </h3>
              )}

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
