"use client";
import React, { useState, useEffect } from "react";
import { EllipsisVertical, Search, Trash } from "lucide-react";
import { toast } from "react-toastify";
import moment from "moment";
import { useRef } from "react";

const EditableTable = ({ activities, setActivities }) => {
  const [menuIndex, setMenuIndex] = useState(null);
  const [displayData, setDisplayData] = useState("displayAll");
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddRow = (type = "activity", insertIndex = null) => {
    const newRow = {
      description: type === "section" ? "New Section" : "New Activity",
      duration: type === "section" ? null : "1",
      startDate: type === "section" ? null : moment().format("YYYY-MM-DD"),
      endDate: type === "section" ? null : "",
      rowType: type,
    };

    setActivities((prev) => {
      const updated = [...prev];
      if (insertIndex !== null) {
        updated.splice(insertIndex + 1, 0, newRow);
        return updated;
      }
      return [...prev, newRow];
    });
  };

  const handleDelete = (index) => {
    setActivities((prev) => prev.filter((_, i) => i !== index));
    toast.info("Row removed (not saved yet)");
  };

  const handleChange = (index, field, value) => {
    setActivities((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  };

  const getNumbering = (index) => {
    let sectionNum = 0;
    let activityNum = 0;

    for (let i = 0; i <= index; i++) {
      if (activities[i].rowType === "section") {
        sectionNum++;
        activityNum = 0;
      } else if (activities[i].rowType === "activity") {
        activityNum++;
      }
    }

    return activities[index].rowType === "activity"
      ? `${sectionNum}.${activityNum}`
      : "";
  };

  useEffect(() => {
    setActivities((prev) => {
      const updated = prev.map((r) => ({ ...r }));

      for (let i = 0; i < updated.length; i++) {
        const row = updated[i];
        if (row.rowType === "activity" && row.startDate && row.duration) {
          updated[i].endDate = moment(row.startDate)
            .add(Number(row.duration), "days")
            .format("YYYY-MM-DD");
        } else if (row.rowType === "activity") {
          updated[i].endDate = row.endDate || "";
        }
      }

      for (let i = 0; i < updated.length - 1; i++) {
        const curr = updated[i];
        const next = updated[i + 1];

        if (curr.rowType === "activity" && next.rowType === "activity") {
          if (curr.endDate && !next.startDate) {
            updated[i + 1].startDate = curr.endDate;
          }
        }
      }

      return updated;
    });
  }, [
    activities.map((r) => r.startDate).join(","),
    activities.map((r) => r.duration).join(","),
  ]);

  useEffect(() => {
    setActivities((prev) => {
      const updated = prev.map((row, idx) => {
        if (row.rowType !== "section") return row;

        let earliest = null;
        let latest = null;

        for (let i = idx + 1; i < prev.length; i++) {
          if (prev[i].rowType === "section") break;

          if (prev[i].rowType === "activity") {
            if (prev[i].startDate) {
              if (!earliest || moment(prev[i].startDate).isBefore(earliest)) {
                earliest = prev[i].startDate;
              }
            }

            if (prev[i].endDate) {
              if (!latest || moment(prev[i].endDate).isAfter(latest)) {
                latest = prev[i].endDate;
              }
            }
          }
        }

        if (row.startDate === earliest && row.endDate === latest) {
          return row; // ❗ no change
        }

        return {
          ...row,
          startDate: earliest,
          endDate: latest,
        };
      });

      // ❗ check if array actually changed
      const changed = JSON.stringify(prev) !== JSON.stringify(updated);

      return changed ? updated : prev;
    });
  }, [activities]);

  const hasSection = activities.some((a) => a.rowType === "section");

  const filteredActivities = activities.filter((row) => {
    const query = searchQuery.toLowerCase();

    if (searchQuery) {
      return (
        row.rowType === "section" &&
        row.description?.toLowerCase().includes(query)
      );
    }

    if (displayData === "section") {
      return row.rowType === "section";
    }

    return true;
  });

  return (
    <div className="bg-white rounded-2xl shadow-md mt-4 overflow-y-scroll scrollbar-hide pb-28">
      <div className="flex flex-col md:flex-row gap-2 mb-4 mt-4 md:items-center justify-start px-4 ">
        <div className="relative ">
          <Search
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600"
          />
          <input
            type="text"
            placeholder="Search Section..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[320px] ps-8 text-[14px] px-4 py-2 bg-white text-black rounded-lg border border-gray-600 focus:outline-none focus:border-green-400"
          />
        </div>

        <select
          value={displayData}
          onChange={(e) => {
            setDisplayData(e.target.value);
            setSearchQuery(""); // reset search when changing mode
          }}
          className="w-[220px] text-[14px] px-4 py-2.5 cursor-pointer bg-white text-black rounded-lg border border-gray-600 focus:outline-none focus:border-green-400"
        >
          <option value="displayAll">Display All</option>
          <option value="section">Display Only Sections</option>
        </select>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-custom-yellow text-gray-700">
            <th className="py-3 px-3 text-left w-[100px]">Item No</th>
            <th className="py-3 px-3 text-left min-w-[250px]">Description</th>
            <th className="py-3 px-3 text-center w-[120px]">Duration (D)</th>
            <th className="py-3 px-3 text-center w-[150px]">Start Date</th>
            <th className="py-3 px-3 text-center w-[150px]">End Date</th>
            <th className="py-3 px-3 text-center w-[150px]">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredActivities.map((row, i) => {
            const originalIndex = activities.indexOf(row);
            const num = getNumbering(originalIndex);
            const isSection = row.rowType === "section";
            const duration =
              row.startDate && row.endDate
                ? Math.max(
                    0,
                    moment(row.endDate).diff(moment(row.startDate), "days"),
                  )
                : "";

            if (row.rowType === "activity") {
              let sectionIndex = -1;
              for (let j = i; j >= 0; j--) {
                if (activities[j].rowType === "section") {
                  sectionIndex = j;
                  break;
                }
              }
            }

            return (
              <tr
                key={i}
                className={`border-b ${
                  isSection
                    ? "bg-gray-100 text-black font-semibold cursor-pointer"
                    : "bg-white text-black"
                }`}
              >
                <td className="text-center py-2">{num}</td>

                <td className="py-2 px-3">
                  <textarea
                    rows={1}
                    value={row.description || ""}
                    onChange={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = `${e.target.scrollHeight}px`;
                      handleChange(i, "description", e.target.value);
                    }}
                    className={`w-full bg-transparent outline-none resize-none overflow-hidden leading-relaxed ${
                      isSection ? "font-semibold text-black" : "text-black"
                    }`}
                  />
                </td>

                <td className="text-center">
                  {isSection ? (
                    <p className="text-gray-600 text-center">{duration}</p>
                  ) : (
                    <input
                      type="number"
                      min="1"
                      value={row.duration ?? ""}
                      onChange={(e) =>
                        handleChange(i, "duration", e.target.value)
                      }
                      className="md:ps-3 w-full text-center bg-transparent outline-none"
                    />
                  )}
                </td>

                <td className="text-center">
                  {isSection ? (
                    // show section's computed start date (read-only) instead of "—"
                    <input
                      type="date"
                      value={
                        row.startDate
                          ? moment(row.startDate).format("YYYY-MM-DD")
                          : ""
                      }
                      readOnly
                      className="bg-transparent outline-none text-center text-gray-600 cursor-not-allowed"
                    />
                  ) : (
                    <input
                      type="date"
                      value={
                        row.startDate
                          ? moment(row.startDate).format("YYYY-MM-DD")
                          : ""
                      }
                      onChange={(e) =>
                        handleChange(i, "startDate", e.target.value)
                      }
                      className="bg-transparent outline-none text-center"
                    />
                  )}
                </td>

                <td className="text-center">
                  {isSection ? (
                    <input
                      type="date"
                      value={
                        row.endDate
                          ? moment(row.endDate).format("YYYY-MM-DD")
                          : ""
                      }
                      readOnly
                      className="bg-gray-50 text-center text-gray-600 cursor-not-allowed outline-none"
                    />
                  ) : (
                    <input
                      type="date"
                      value={
                        row.endDate
                          ? moment(row.endDate).format("YYYY-MM-DD")
                          : ""
                      }
                      readOnly
                      className="bg-gray-50 text-center text-gray-600 cursor-not-allowed outline-none"
                    />
                  )}
                </td>

                <td className="relative text-center">
                  <button
                    className="p-2 cursor-pointer"
                    onClick={() => setMenuIndex(menuIndex === i ? null : i)}
                  >
                    <EllipsisVertical />
                  </button>

                  {menuIndex === i && (
                    <div
                      ref={menuRef}
                      className="w-[200px] absolute right-10 top-8 bg-white shadow-lg border rounded-md py-2 z-20"
                    >
                      <button
                        onClick={() => {
                          handleAddRow("section");
                          setMenuIndex(null);
                        }}
                        className="block w-full cursor-pointer text-left px-3 py-2 border-b hover:bg-gray-100 text-sm"
                      >
                        + Add Section
                      </button>

                      <button
                        disabled={!hasSection}
                        onClick={() => {
                          if (!hasSection) return;
                          handleAddRow("activity", i);
                          setMenuIndex(null);
                        }}
                        className={`block w-full cursor-pointer text-left px-3 py-2 border-b text-sm ${
                          hasSection
                            ? "hover:bg-gray-100"
                            : "opacity-50 cursor-not-allowed"
                        }`}
                      >
                        + Add Activity
                      </button>

                      <button
                        onClick={() => {
                          setMenuIndex(null);
                          handleDelete(i);
                        }}
                        className="block w-full flex cursor-pointer justify-start gap-3 items-center text-left px-3 py-2 hover:bg-red-100 text-sm text-red-600"
                      >
                        <Trash size={18} /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex justify-end mt-4 gap-3 mr-4">
        <button
          onClick={() => handleAddRow("section")}
          className="px-4 py-2 bg-custom-yellow text-black rounded-lg"
        >
          + Add Section
        </button>

        <button
          disabled={!hasSection}
          onClick={() => hasSection && handleAddRow("activity")}
          className={`px-4 py-2 rounded-lg ${
            hasSection
              ? "bg-custom-yellow text-black"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          + Add Activity
        </button>
      </div>
    </div>
  );
};

export default EditableTable;
