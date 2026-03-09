// DatePicker.jsx - COMPLETE FILE
import { useState, useEffect, useRef } from "react";

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getMonthName(month) {
  return new Date(2000, month, 1).toLocaleString("default", { month: "long" });
}

function DatePicker({ name, value, onChange, placeholder = "Select date" }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const dateValue = value ? value.split("T")[0] : "";

  const initialDate = dateValue ? new Date(dateValue) : new Date();
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());

  const today = new Date();

  useEffect(() => {
    function handleOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    if (dateValue) {
      const d = new Date(dateValue);
      setCurrentMonth(d.getMonth());
      setCurrentYear(d.getFullYear());
    }
  }, [dateValue]);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const days = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function changeMonth(delta) {
    let newMonth = currentMonth + delta;
    let newYear = currentYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  }

  function selectDay(day) {
    if (!day) return;
    const newDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const timePart = value && value.includes("T") ? value.split("T")[1] : "00:00";
    onChange({ target: { name, value: `${newDate}T${timePart}` } });
    setIsOpen(false);
  }

  function isSelected(day) {
    if (!day || !dateValue) return false;
    const check = new Date(currentYear, currentMonth, day);
    const selected = new Date(dateValue);
    return check.toDateString() === selected.toDateString();
  }

  function isToday(day) {
    if (!day) return false;
    const check = new Date(currentYear, currentMonth, day);
    return check.toDateString() === today.toDateString();
  }

  return (
    <div ref={wrapperRef} style={styles.wrapper}>
      <div style={styles.display} onClick={() => setIsOpen(!isOpen)}>
        <span style={dateValue ? {} : styles.placeholder}>
          {dateValue || placeholder}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          style={styles.iconBtn}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div style={styles.popup}>
          <div style={styles.header}>
            <button type="button" onClick={() => changeMonth(-1)} style={styles.navBtn}>‹</button>
            <span style={styles.monthYear}>{getMonthName(currentMonth)} {currentYear}</span>
            <button type="button" onClick={() => changeMonth(1)} style={styles.navBtn}>›</button>
          </div>
          <div style={styles.weekdays}>
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d} style={styles.weekday}>{d}</div>
            ))}
          </div>
          <div style={styles.daysGrid}>
            {days.map((day, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => selectDay(day)}
                disabled={!day}
                style={{
                  ...styles.dayBtn,
                  ...(day ? {} : styles.emptyDay),
                  ...(isSelected(day) ? styles.selectedDay : {}),
                  ...(isToday(day) && !isSelected(day) ? styles.todayDay : {}),
                }}
              >
                {day || ""}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const BLUE = "#0F9FEA";
const TEXT = "#F9F9F9";

const styles = {
  wrapper: { flex: "1.2", position: "relative" },
  display: {
    width: "100%",
    padding: "12px 44px 12px 16px",
    borderRadius: "8px",
    border: "1px solid #444",
    backgroundColor: "#1f1f1f",
    color: TEXT,
    fontSize: "1rem",
    cursor: "pointer",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  placeholder: { color: "#666" },
  iconBtn: {
    position: "absolute",
    right: "8px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "#888",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    borderRadius: "4px",
  },
  popup: {
    position: "absolute",
    top: "calc(100% + 8px)",
    left: 0,
    backgroundColor: "#2a2a2a",
    border: "1px solid #444",
    borderRadius: "12px",
    padding: "16px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    zIndex: 1000,
    minWidth: "280px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  navBtn: {
    background: "none",
    border: "none",
    color: TEXT,
    fontSize: "1.2rem",
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: "4px",
  },
  monthYear: { color: TEXT, fontWeight: "600", fontSize: "0.95rem" },
  weekdays: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "4px",
    marginBottom: "4px",
  },
  weekday: {
    textAlign: "center",
    color: "#888",
    fontSize: "0.75rem",
    fontWeight: "600",
    padding: "8px 4px",
  },
  daysGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "4px",
  },
  dayBtn: {
    aspectRatio: "1",
    border: "none",
    backgroundColor: "transparent",
    color: TEXT,
    fontSize: "0.9rem",
    cursor: "pointer",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s",
  },
  emptyDay: { cursor: "default", pointerEvents: "none" },
  selectedDay: { backgroundColor: BLUE, color: "#fff", fontWeight: "600" },
  todayDay: { border: `2px solid ${BLUE}`, color: BLUE, fontWeight: "600" },
};

export default DatePicker;