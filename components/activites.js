import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trash2 } from "lucide-react";

// ✅ Activity Progress
const getActivityProgress = (activity, level) => {
  if (level === "Easy") {
    return Number(activity.qtyDone || 0);
  }

  const qty = Number(activity.qtyDone || 0);
  const boq = Number(activity.qtyInBOQ || 0);

  if (!boq) return 0;
  return ((qty / boq) * 100).toFixed(2);
};

// ✅ Overall Progress
const getOverallProgress = (sections, level) => {
  if (!sections) return 0;

  if (level === "Easy") {
    let total = 0;
    let count = 0;

    sections.forEach((sec) => {
      sec.activities.forEach((act) => {
        total += Number(act.qtyDone || 0);
        count++;
      });
    });

    return count ? (total / count).toFixed(2) : 0;
  }

  let totalQty = 0;
  let totalBoq = 0;

  sections.forEach((sec) => {
    sec.activities.forEach((act) => {
      totalQty += Number(act.qtyDone || 0);
      totalBoq += Number(act.qtyInBOQ || 0);
    });
  });

  if (!totalBoq) return 0;
  return ((totalQty / totalBoq) * 100).toFixed(2);
};

const styles = `
  .wp-root {
    color: #0f172a;
    padding: 16px 0px;
    min-height: 100vh;
  }

  .wp-overall-card {
    background: white;
    border-radius: 20px;
    padding: 24px 18px;
    margin-bottom: 24px;
    box-shadow: 0 8px 32px rgba(37,99,235,0.28);
    position: relative;
    overflow: hidden;
  }

  .wp-overall-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
    position: relative;
    z-index: 1;
  }
  .wp-overall-title {
    font-size: 15px;
    font-weight: 600;
    color: black;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .wp-overall-pct {  
    font-size: 28px;
    font-weight: 800;
    color: blue;
    line-height: 1;
  }
  .wp-track {
    width: 100%;
    height: 8px;
    background: gray;
    border-radius: 99px;
    position: relative;
    z-index: 1;
    overflow: hidden;
  }
  .wp-track-fill {
    height: 100%;
    background: var(--custom-blue);
    border-radius: 99px;
    transition: width 0.6s cubic-bezier(.4,0,.2,1);
    box-shadow: 0 0 12px rgba(255,255,255,0.5);
  }

  .wp-thead {
    display: none;
  }
  @media (min-width: 640px) {
    .wp-thead {
      display: grid;
      border-radius: 14px 14px 0 0;
      background: #1d4ed8;
      padding: 12px 18px;
      gap: 10px;
      margin-bottom: 0;
    }
    .wp-thead-easy  { grid-template-columns: 3fr 1.5fr 1.2fr 60px; }
    .wp-thead-hard  { grid-template-columns: 2.5fr 1fr 1fr 1fr 1fr 1fr 1.2fr 60px; }
    .wp-th {
    
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: rgba(255,255,255,0.85);
    }
  }

  /* ── Table Body ── */
  .wp-body {
    border-radius: 0 0 16px 16px;
    overflow: hidden;
    border: 1px solid #dbeafe;
    border-top: none;
  }
  @media (max-width: 639px) {
    .wp-body {
      border-radius: 16px;
      border-top: 1px solid #dbeafe;
    }
  }

  /* ── Section Header ── */
  .wp-section-header {
    background: #eff6ff;
    padding: 10px 18px;
    font-size: 13px;
    font-weight: 700;
    color: #1d4ed8;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    border-bottom: 1px solid #dbeafe;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .wp-section-dot {
    width: 8px; height: 8px;
    background: #3b82f6;
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* ── Activity Row ── */
  .wp-row {
    background: #fff;
    border-bottom: 1px solid #eff6ff;
    padding: 12px 18px;
    transition: background 0.15s;
  }
  .wp-row:hover { background: #f8fbff; }
  .wp-row:last-child { border-bottom: none; }


  @media (min-width: 640px) {
    .wp-row-inner-easy { display: grid; grid-template-columns: 3fr 1.5fr 1.2fr 60px; gap: 10px; align-items: center; }
    .wp-row-inner-hard { display: grid; grid-template-columns: 2.5fr 1fr 1fr 1fr 1fr 1fr 1.2fr 60px; gap: 10px; align-items: center; }
  }

  @media (max-width: 639px) {
    .wp-row-inner-easy,
    .wp-row-inner-hard {
      // display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .wp-mobile-label {
      font-size: 12px;
      font-weight: 600;
      color: #000;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 2px;
    }
    .wp-mobile-field { display: flex; flex-direction: column; }
    .wp-mobile-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .wp-mobile-grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
    }
  }

  /* ── Input ── */
  .wp-input {
    width: 100%;
    background: transparent;
    border: none;
    padding: 6px 4px;
    font-size: 13px;
    color: #000;
    outline: none;
    transition: border-color 0.2s;
    border-radius: 0;
    box-sizing: border-box;
  }
 
  .wp-input::placeholder { color: #000; }
  .wp-input:disabled {
    color: #60a5fa;

    cursor: default;
  }

  /* number input arrows hide */
  .wp-input[type=number]::-webkit-inner-spin-button,
  .wp-input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
  .wp-input[type=number] { -moz-appearance: textfield; }

  /* ── Progress bar ── */
  .wp-prog-wrap { display: flex; flex-direction: column; gap: 3px; }
  .wp-prog-track {
    height: 5px;
    background: #dbeafe;
    border-radius: 99px;
    overflow: hidden;
  }
  .wp-prog-fill {
    height: 100%;
    background: linear-gradient(90deg, #2563eb, #60a5fa);
    border-radius: 99px;
    transition: width 0.4s ease;
  }
  .wp-prog-label {
    font-size: 11px;
    font-weight: 600;
    color: #3b82f6;
  }

  /* ── Delete btn ── */
  .wp-del {
    background: transparent;
    border: none;
    cursor: pointer;
    color: red;
    font-size: 14px;
    padding: 4px;
    border-radius: 6px;
    transition: color 0.15s, background 0.15s;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .wp-del:hover { color: #ef4444; background: #fef2f2; }

  @media (max-width: 639px) {
    .wp-del { align-self: flex-end; margin-top: -4px; }
    .wp-del-row { display: flex; justify-content: flex-end; }
  }
`;

const WorkplanProgress = ({
  activities,
  progress,
  setActivities,
  setProgress,
  selectedTracker,
}) => {
  const [data, setData] = useState([]);
  const [displayData] = useState("displayAll");

  useEffect(() => {
    setData(activities || []);
  }, [activities]);
  
  const handleChange = (sectionId, actId, field, value) => {
    const updatedData = data.map((sec) => {
      if (sec.id !== sectionId) return sec;
      return {
        ...sec,
        activities: sec.activities.map((act) => {
          if (act.id !== actId) return act;
          let updated = { ...act };

          if (field === "name") {
            updated.name = value;
            return updated;
          }

          if (selectedTracker.level === "Easy") {
            let val = Number(value);
            if (isNaN(val)) return act;
            if (val > 100) val = 100;
            if (val < 0) val = 0;
            updated.qtyDone = val;
            return updated;
          }

          if (value === "") {
            updated[field] = "";
            return updated;
          }

          let numericValue = Number(value);
          if (isNaN(numericValue)) return act;
          if (numericValue < 0) numericValue = 0;
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

    setData(updatedData);
    setActivities(updatedData);
  };

  const handleDelete = (sectionId, actId) => {
    const updated = data.map((sec) => {
      if (sec.id !== sectionId) return sec;
      return {
        ...sec,
        activities: sec.activities.filter((act) => act.id !== actId),
      };
    });
    setData(updated);
    setActivities(updated);
  };

  useEffect(() => {
    const overall = getOverallProgress(data, selectedTracker.level);
    setProgress(overall);
  }, [data]);

  const isEasy = selectedTracker.level === "Easy";

  return (
    <>
      <style>{styles}</style>
      <div className="wp-root">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="wp-overall-card"
        >
          <div className="wp-overall-header">
            <span className="wp-overall-title">Overall Progress</span>
            <span className="wp-overall-pct">{progress}%</span>
          </div>
          <div className="wp-track">
            <motion.div
              className="wp-track-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        <div
          className={`wp-thead ${isEasy ? "wp-thead-easy" : "wp-thead-hard"}`}
        >
          <div className="wp-th">Description</div>
          {isEasy ? (
            <>
              <div className="wp-th">Progress Done</div>
              <div className="wp-th">Progress</div>
              <div className="wp-th"></div>
            </>
          ) : (
            <>
              <div className="wp-th">Qty in BOQ</div>
              <div className="wp-th">Rate</div>
              <div className="wp-th">Amount</div>
              <div className="wp-th">Qty Done</div>
              <div className="wp-th">Amt Done</div>
              <div className="wp-th">Progress</div>
              <div className="wp-th"></div>
            </>
          )}
        </div>

        <div className="wp-body">
          <AnimatePresence>
            {data.map((section) => (
              <div key={section.id}>
                <div className="wp-section-header">
                  {/* <span className="wp-section-dot" /> */}
                  {section.name}
                </div>

                {displayData === "displayAll" &&
                  section.activities.map((act, i) => {
                    const prog = getActivityProgress(
                      act,
                      selectedTracker.level,
                    );

                    return (
                      <motion.div
                        key={act.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ delay: i * 0.04 }}
                        className="wp-row"
                      >
                        <div className="md:hidden">
                          <div
                            className="wp-mobile-field"
                            style={{ marginBottom: 6 }}
                          >
                            <span className="wp-mobile-label">Description</span>
                            <input
                              value={act.name}
                              onChange={(e) =>
                                handleChange(
                                  section.id,
                                  act.id,
                                  "name",
                                  e.target.value,
                                )
                              }
                              className="wp-input"
                              placeholder="Activity name"
                            />
                          </div>

                          {isEasy ? (
                            <div className="wp-mobile-grid">
                              <div className="wp-mobile-field">
                                <span className="wp-mobile-label">
                                  Progress Done
                                </span>
                                <input
                                  type="number"
                                  value={act.qtyDone}
                                  onChange={(e) =>
                                    handleChange(
                                      section.id,
                                      act.id,
                                      "qtyDone",
                                      e.target.value,
                                    )
                                  }
                                  className="wp-input"
                                  placeholder="0"
                                />
                              </div>
                              <div
                                className="wp-mobile-field"
                                style={{ justifyContent: "flex-end" }}
                              >
                                <span className="wp-mobile-label">
                                  Progress
                                </span>
                                <div className="wp-prog-wrap">
                                  <div className="wp-prog-track">
                                    <div
                                      className="wp-prog-fill"
                                      style={{ width: `${prog}%` }}
                                    />
                                  </div>
                                  <span className="wp-prog-label">{prog}%</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="wp-mobile-grid">
                                <div className="wp-mobile-field">
                                  <span className="wp-mobile-label">
                                    Qty in BOQ
                                  </span>
                                  <input
                                    type="number"
                                    value={act.qtyInBOQ}
                                    onChange={(e) =>
                                      handleChange(
                                        section.id,
                                        act.id,
                                        "qtyInBOQ",
                                        e.target.value,
                                      )
                                    }
                                    className="wp-input"
                                    placeholder="0"
                                  />
                                </div>
                                <div className="wp-mobile-field">
                                  <span className="wp-mobile-label">Rate</span>
                                  <input
                                    type="number"
                                    value={act.Rate}
                                    onChange={(e) =>
                                      handleChange(
                                        section.id,
                                        act.id,
                                        "Rate",
                                        e.target.value,
                                      )
                                    }
                                    className="wp-input"
                                    placeholder="0"
                                  />
                                </div>
                              </div>
                              <div
                                className="wp-mobile-grid-3"
                                style={{ marginTop: 8 }}
                              >
                                <div className="wp-mobile-field">
                                  <span className="wp-mobile-label">
                                    Amount
                                  </span>
                                  <input
                                    value={act.Amount}
                                    disabled
                                    className="wp-input"
                                  />
                                </div>
                                <div className="wp-mobile-field">
                                  <span className="wp-mobile-label">
                                    Qty Done
                                  </span>
                                  <input
                                    type="number"
                                    value={act.qtyDone}
                                    onChange={(e) =>
                                      handleChange(
                                        section.id,
                                        act.id,
                                        "qtyDone",
                                        e.target.value,
                                      )
                                    }
                                    className="wp-input"
                                    placeholder="0"
                                  />
                                </div>
                                <div className="wp-mobile-field">
                                  <span className="wp-mobile-label">
                                    Amt Done
                                  </span>
                                  <input
                                    value={act.amountDone}
                                    disabled
                                    className="wp-input"
                                  />
                                </div>
                              </div>
                              <div style={{ marginTop: 8 }}>
                                <span className="wp-mobile-label">
                                  Progress
                                </span>
                                <div className="wp-prog-wrap">
                                  <div className="wp-prog-track">
                                    <div
                                      className="wp-prog-fill"
                                      style={{ width: `${prog}%` }}
                                    />
                                  </div>
                                  <span className="wp-prog-label">{prog}%</span>
                                </div>
                              </div>
                            </>
                          )}

                          <div className="wp-del-row" style={{ marginTop: 6 }}>
                            <button
                              onClick={() => handleDelete(section.id, act.id)}
                              className="wp-del"
                              title="Delete"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>

                        <div
                          className={`hidden md:flex  ${isEasy ? "wp-row-inner-easy" : "wp-row-inner-hard"}`}
                        >
                          <input
                            value={act.name}
                            onChange={(e) =>
                              handleChange(
                                section.id,
                                act.id,
                                "name",
                                e.target.value,
                              )
                            }
                            className="wp-input"
                            placeholder="Activity name"
                          />

                          {isEasy ? (
                            <input
                              type="number"
                              value={act.qtyDone}
                              onChange={(e) =>
                                handleChange(
                                  section.id,
                                  act.id,
                                  "qtyDone",
                                  e.target.value,
                                )
                              }
                              className="wp-input"
                              placeholder="0"
                            />
                          ) : (
                            <>
                              <input
                                type="number"
                                value={act.qtyInBOQ}
                                onChange={(e) =>
                                  handleChange(
                                    section.id,
                                    act.id,
                                    "qtyInBOQ",
                                    e.target.value,
                                  )
                                }
                                className="wp-input"
                                placeholder="0"
                              />
                              <input
                                type="number"
                                value={act.Rate}
                                onChange={(e) =>
                                  handleChange(
                                    section.id,
                                    act.id,
                                    "Rate",
                                    e.target.value,
                                  )
                                }
                                className="wp-input"
                                placeholder="0"
                              />
                              <input
                                value={act.Amount}
                                disabled
                                className="wp-input"
                              />
                              <input
                                type="number"
                                value={act.qtyDone}
                                onChange={(e) =>
                                  handleChange(
                                    section.id,
                                    act.id,
                                    "qtyDone",
                                    e.target.value,
                                  )
                                }
                                className="wp-input"
                                placeholder="0"
                              />
                              <input
                                value={act.amountDone}
                                disabled
                                className="wp-input"
                              />
                            </>
                          )}

                          <div className="wp-prog-wrap">
                            <div className="wp-prog-track">
                              <div
                                className="wp-prog-fill"
                                style={{ width: `${prog}%` }}
                              />
                            </div>
                            <span className="wp-prog-label">{prog}%</span>
                          </div>

                          <button
                            onClick={() => handleDelete(section.id, act.id)}
                            className="wp-del"
                            title="Delete"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default WorkplanProgress;
