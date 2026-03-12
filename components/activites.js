import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const getActivityProgress = (activity) => {
  const qty = Number(activity.qtyDone || 0);
  const boq = Number(activity.qtyInBOQ || 0);
  if (!boq) return 0;
  return ((qty / boq) * 100).toFixed(2);
};

const getOverallProgress = (sections) => {
  if (!sections) return;
  let totalQty = 0,
    totalBoq = 0;

  sections?.forEach((sec) => {
    sec.activities.forEach((act) => {
      totalQty += Number(act.qtyDone || 0);
      totalBoq += Number(act.qtyInBOQ || 0);
    });
  });

  if (!totalBoq) return 0;
  return ((totalQty / totalBoq) * 100).toFixed(2);
};

const WorkplanProgress = ({
  activities,
  progress,
  setActivities,
  setProgress,
}) => {
  if (!activities) return;
  const [data, setData] = useState(activities || []);

  const [displayData, setDisplayData] = useState("displayAll");

  useEffect(() => {
    setData(activities);
  }, [activities]);

  const handleChange = (sectionId, actId, field, value) => {
    const cloned = data.map((sec) => {
      if (sec.id !== sectionId) return sec;

      return {
        ...sec,
        activities: sec.activities.map((act) => {
          if (act.id !== actId) return act;

          let updated = { ...act };

          if (value === "") {
            updated[field] = "";
            return updated;
          }

          if (value === "+" || value === "-") {
            return act;
          }

          let numericValue = Number(value);

          if (isNaN(numericValue)) {
            return act;
          }

          if (numericValue < 0) {
            numericValue = 0;
          }

          numericValue = Math.floor(numericValue * 100) / 100;

          updated[field] = numericValue;

          const boq = Number(updated.qtyInBOQ || 0);
          const rate = Number(updated.Rate || 0);
          let doneQty = Number(updated.qtyDone || 0);

          if (field === "qtyDone" && doneQty > boq) {
            doneQty = boq;
            updated.qtyDone = boq;
          }

          updated.Amount = Math.floor(boq * rate * 100) / 100;
          updated.amountDone = Math.floor(doneQty * rate * 100) / 100;

          return updated;
        }),
      };
    });

    setData(cloned);
    setActivities(cloned);
  };

  useEffect(() => {
    if (!data || data.length === 0) return;

    const overall = getOverallProgress(data);
    setProgress(overall);
  }, [data]);

  return (
    <div className="py-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="mb-8 bg-white border- border-gray-300 p-5 rounded-xl shadow-sm border"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-black">
              Overall Progress
            </h1>
            <span className="text-lg font-bold text-blue-500">
              {progress}%
            </span>
          </div>

          <select
            value={displayData}
            onChange={(e) => {
              setDisplayData(e.target.value);
            }}
            className="w-full md:w-[220px] text-[14px] px-4 py-2.5 cursor-pointer bg-white text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-custom-yellow"
          >
            <option value="displayAll">Display All</option>
            <option value="section">Display Only Sections</option>
          </select>
        </div>

        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </motion.div>

      <div className="border rounded-xl shadow bg-custom-black overflow-hidden">
        <div className="hidden sm:grid grid-cols-10 gap-4 px-4 py-3 text-white text-sm font-semibold bg-blue-500">
          <div className="xl:col-span-4 lg:col-span-3">Description</div>
          <div>Qty in BOQ</div>
          <div>Rate</div>
          <div>Amount</div>
          <div>Qty Done</div>
          <div>Amount Done</div>
          <div>Progress</div>
        </div>

        <AnimatePresence>
          {data?.map((section) => (
            <React.Fragment key={section.id}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="px-4 py-3 bg-gray-200 border-b border-gray-200 text-black font-bold flex justify-between items-center cursor-pointer"
              >
                <span>{section.name}</span>
              </motion.div>

              {displayData === "displayAll" &&
                section.activities.map((act) => {
                  const progress = getActivityProgress(act);

                  return (
                    <motion.div
                      key={act.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-b border-gray-300 bg-white text-sm text-black px-4 py-3"
                    >
                      <div className="sm:hidden flex flex-col gap-3">
                        <div className="font-semibold">{act.name}</div>

                        <div className="flex justify-between">
                          <span>Qty in BOQ</span>
                          <input
                            type="number"
                            className="bg-gray-200 p-1 rounded w-20"
                            value={act.qtyInBOQ}
                            onChange={(e) =>
                              handleChange(
                                section.id,
                                act.id,
                                "qtyInBOQ",
                                e.target.value,
                              )
                            }
                          />
                        </div>

                        <div className="flex justify-between">
                          <span>Rate</span>
                          <input
                            type="number"
                            className="bg-gray-200 p-1 rounded w-20"
                            value={act.Rate}
                            onChange={(e) =>
                              handleChange(
                                section.id,
                                act.id,
                                "Rate",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="flex justify-between">
                          <span>Amount</span>
                          <input
                            type="number"
                            disabled
                            className="bg-gray-200 p-1 rounded w-20"
                            value={act.Amount}
                            onChange={(e) =>
                              handleChange(
                                section.id,
                                act.id,
                                "Amount",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="flex justify-between">
                          <span>Qty Done</span>
                          <input
                            type="number"
                            className="bg-gray-200 p-1 rounded w-20"
                            value={act.qtyDone}
                            onChange={(e) =>
                              handleChange(
                                section.id,
                                act.id,
                                "qtyDone",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="flex justify-between">
                          <span>Amount Done</span>
                          <input
                            type="number"
                            disabled
                            className="bg-gray-200 p-1 rounded w-20"
                            value={act.amountDone}
                            onChange={(e) =>
                              handleChange(
                                section.id,
                                act.id,
                                "amountDone",
                                e.target.value,
                              )
                            }
                          />
                        </div>

                        {/* Progress Bar */}
                        <div>
                          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold">
                            {progress}%
                          </span>
                        </div>
                      </div>

                      <div className="hidden md:grid grid-cols-10 gap-4 items-center">
                        <div className="xl:col-span-4 lg:col-span-3">{act.name}</div>

                        <input
                          type="number"
                          className="bg-gray-200 p-1 rounded xl:w-20 lg:w-14"
                          value={act.qtyInBOQ}
                          onChange={(e) =>
                            handleChange(
                              section.id,
                              act.id,
                              "qtyInBOQ",
                              e.target.value,
                            )
                          }
                        />

                        <input
                          type="number"
                          className="bg-gray-200 p-1 rounded xl:w-20 lg:w-14"
                          value={act.Rate}
                          onChange={(e) =>
                            handleChange(
                              section.id,
                              act.id,
                              "Rate",
                              e.target.value,
                            )
                          }
                        />

                        <input
                          type="number"
                          className="bg-gray-200 p-1 rounded xl:w-20 lg:w-14"
                          value={act.Amount}
                          disabled
                          onChange={(e) =>
                            handleChange(
                              section.id,
                              act.id,
                              "Amount",
                              e.target.value,
                            )
                          }
                        />

                        <input
                          type="number"
                          className="bg-gray-200 p-1 rounded xl:w-20 lg:w-14"
                          value={act.qtyDone}
                          onChange={(e) =>
                            handleChange(
                              section.id,
                              act.id,
                              "qtyDone",
                              e.target.value,
                            )
                          }
                        />

                        <input
                          type="number"
                          className="bg-gray-200 p-1 rounded xl:w-20 lg:w-14"
                          value={act.amountDone}
                          disabled
                          onChange={(e) =>
                            handleChange(
                              section.id,
                              act.id,
                              "amountDone",
                              e.target.value,
                            )
                          }
                        />

                        <div className="flex items-center gap-2">
                          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold">
                            {progress}%
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </React.Fragment>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WorkplanProgress;
