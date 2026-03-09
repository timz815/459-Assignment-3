import { useState, useEffect, useRef } from "react";

const BLUE = "#0F9FEA";

function TimePicker({ name, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const timePart = value && value.includes("T") ? value.split("T")[1] : "12:00";
  const [hours24, minutes] = timePart.split(":").map(Number);

  const isPM = hours24 >= 12;
  const hours12 = hours24 % 12 || 12;
  const ampm = isPM ? "PM" : "AM";

  const hoursOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutesOptions = Array.from({ length: 60 }, (_, i) => i);
  const ampmOptions = ["AM", "PM"];

  function updateTime(newHours12, newMinutes, newAmpm) {
    let h24 = newHours12;

    if (newAmpm === "PM" && newHours12 !== 12) h24 = newHours12 + 12;
    if (newAmpm === "AM" && newHours12 === 12) h24 = 0;

    const datePart =
      value && value.includes("T")
        ? value.split("T")[0]
        : new Date().toISOString().split("T")[0];

    const timeStr = `${h24.toString().padStart(2, "0")}:${newMinutes
      .toString()
      .padStart(2, "0")}`;

    onChange({
      target: { name, value: `${datePart}T${timeStr}` },
    });
  }

  useEffect(() => {
    function handleOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const displayTime = `${hours12
    .toString()
    .padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${ampm}`;

  function DropdownColumn({ options, selected, onSelect, format = (x) => x }) {
    return (
      <div style={dropStyles.container}>
        <div style={dropStyles.scroll}>
          {options.map((opt) => {
            const isSelected = opt === selected;

            return (
              <div
                key={opt}
                onClick={() => onSelect(opt)}
                style={{
                  ...dropStyles.item,
                  ...(isSelected ? dropStyles.selected : {}),
                }}
              >
                {format(opt)}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} style={styles.root}>
      <style>{css}</style>

      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        style={{
          ...styles.trigger,
          ...(isOpen ? styles.triggerOpen : {}),
        }}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>

        <span style={styles.triggerTime}>{displayTime}</span>

        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          style={{
            opacity: 0.35,
            transform: isOpen ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        >
          <polyline points="6,9 12,15 18,9" />
        </svg>
      </button>

      {isOpen && (
        <div style={styles.panel}>
          <div style={styles.labels}>
            <span style={styles.label}>Hour</span>
            <span style={{ width: "1px" }} />
            <span style={styles.label}>Min</span>
            <span style={{ width: "1px" }} />
            <span style={styles.label}></span>
          </div>

          <div style={styles.columns}>
            <DropdownColumn
              options={hoursOptions}
              selected={hours12}
              onSelect={(h) => updateTime(h, minutes, ampm)}
              format={(h) => h.toString().padStart(2, "0")}
            />

            <div style={styles.divider} />

            <DropdownColumn
              options={minutesOptions}
              selected={minutes}
              onSelect={(m) => updateTime(hours12, m, ampm)}
              format={(m) => m.toString().padStart(2, "0")}
            />

            <div style={styles.divider} />

            <DropdownColumn
              options={ampmOptions}
              selected={ampm}
              onSelect={(a) => updateTime(hours12, minutes, a)}
            />
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            style={styles.doneBtn}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');
`;

const styles = {
  root: {
    position: "relative",
    display: "inline-block",
    fontFamily: "'DM Mono', monospace",
  },

  trigger: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "9px 14px",
    backgroundColor: "#1e1e1e",
    border: "1px solid #333",
    borderRadius: "10px",
    color: "#e8e8e8",
    cursor: "pointer",
    fontSize: "0.95rem",
    transition: "all 0.15s",
  },

  triggerOpen: {
    borderColor: BLUE,
    backgroundColor: "#1a2a33",
    boxShadow: "0 0 0 3px rgba(15,159,234,0.12)",
  },

  triggerTime: {
    letterSpacing: "0.05em",
  },

  panel: {
    position: "absolute",
    top: "calc(100% + 8px)",
    left: 0,
    backgroundColor: "#1a1a1a",
    border: "1px solid #2e2e2e",
    borderRadius: "14px",
    boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
    zIndex: 1000,
    minWidth: "230px",
    overflow: "hidden",
  },

  labels: {
    display: "flex",
    padding: "10px 16px 4px",
  },

  label: {
    flex: 1,
    textAlign: "center",
    fontSize: "0.65rem",
    color: "#555",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },

  columns: {
    display: "flex",
  },

  divider: {
    width: "1px",
    backgroundColor: "#252525",
  },

  doneBtn: {
    width: "100%",
    padding: "11px",
    backgroundColor: "transparent",
    border: "none",
    borderTop: "1px solid #252525",
    color: BLUE,
    cursor: "pointer",
    fontSize: "0.85rem",
    letterSpacing: "0.08em",
  },
};

const dropStyles = {
  container: {
    flex: 1,
    height: "180px",
  },

  scroll: {
    height: "100%",
    overflowY: "auto",
  },

  item: {
    padding: "10px",
    textAlign: "center",
    cursor: "pointer",
    color: "#888",
    fontSize: "0.95rem",
    transition: "all 0.12s",
  },

  selected: {
    color: "#fff",
    background: "rgba(15,159,234,0.15)",
    fontWeight: "500",
  },
};

export default TimePicker;