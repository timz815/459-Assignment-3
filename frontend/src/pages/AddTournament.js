// AddTournament.jsx - COMPLETE FILE
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";
import DatePicker from "../components/DatePicker";
import TimePicker from "../components/TimePicker";

function getRoundedNow() {
  const now = new Date();
  const ms = 15 * 60 * 1000;
  return new Date(Math.ceil(now.getTime() / ms) * ms).toISOString().slice(0, 16);
}

function addHours(dateStr, hours) {
  const d = new Date(dateStr);
  d.setHours(d.getHours() + hours);
  return d.toISOString().slice(0, 16);
}

function AddTournament() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const now = getRoundedNow();

  const [formData, setFormData] = useState({
    name: "",
    start_date: now,
    end_date: addHours(now, 24),
    starting_balance: "10000",
    description: "",
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function getDuration() {
    const diff = new Date(formData.end_date) - new Date(formData.start_date);
    const mins = Math.floor(diff / 60000);
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/tournaments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          ...formData,
          starting_balance: parseFloat(formData.starting_balance),
        }),
      });

      if (res.ok) {
        navigate("/dashboard");
      } else {
        const err = await res.json();
        alert(err.message || "Failed to create tournament");
      }
    } catch (err) {
      console.error("Submission error:", err);
    }
  }

  return (
    <div style={styles.page}>
      <Header />
      <div style={styles.container}>
        <div style={styles.card}>
          <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </button>

          <h2 style={styles.title}>Create Tournament</h2>
          <p style={styles.subtitle}>Set up a new trading tournament</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>Tournament Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. S&P 500 Challenge"
              required
              style={styles.input}
              autoFocus
            />

            {/* Start Date & Time */}
            <label style={styles.label}>Start Date & Time *</label>
            <div style={styles.dateTimeRow}>
              <DatePicker 
                name="start_date" 
                value={formData.start_date} 
                onChange={handleChange}
              />
              <TimePicker 
                name="start_date" 
                value={formData.start_date} 
                onChange={handleChange}
              />
            </div>

            {/* End Date & Time */}
            <label style={styles.label}>End Date & Time *</label>
            <div style={styles.dateTimeRow}>
              <DatePicker 
                name="end_date" 
                value={formData.end_date} 
                onChange={handleChange}
              />
              <TimePicker 
                name="end_date" 
                value={formData.end_date} 
                onChange={handleChange}
              />
            </div>

            <div style={styles.durationBadge}>
              <span style={styles.durationLabel}>Duration:</span>
              <span style={styles.durationValue}>{getDuration()}</span>
            </div>

            <label style={styles.label}>Player Starting Balance *</label>
            <div style={styles.inputWrapper}>
              <span style={styles.prefix}>$</span>
              <input
                name="starting_balance"
                type="number"
                value={formData.starting_balance}
                onChange={handleChange}
                placeholder="10000"
                required
                min="0"
                step="1000"
                style={{ ...styles.input, paddingLeft: "28px" }}
              />
            </div>

            <label style={styles.label}>Game Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the rules and goals of this tournament…"
              rows={4}
              style={styles.textarea}
            />

            <div style={styles.btnRow}>
              <button type="button" style={styles.cancelBtn} onClick={() => navigate("/dashboard")}>
                Cancel
              </button>
              <button type="submit" style={styles.submitBtn}>
                Create Tournament
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const BLUE = "#0F9FEA";
const BG = "#1A1A1A";
const TEXT = "#F9F9F9";

const styles = {
  page: { minHeight: "100vh", backgroundColor: BG, fontFamily: "'Segoe UI', sans-serif" },
  container: { display: "flex", justifyContent: "center", padding: "40px 20px" },
  card: { width: "100%", maxWidth: "600px", backgroundColor: "#2a2a2a", borderRadius: "16px", padding: "40px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)", border: "1px solid #333" },
  backBtn: { background: "none", border: "none", color: BLUE, fontWeight: "600", fontSize: "0.9rem", cursor: "pointer", padding: "8px 0", marginBottom: "24px", display: "block" },
  title: { margin: "0 0 4px", color: TEXT, fontSize: "1.8rem", fontWeight: "700" },
  subtitle: { margin: "0 0 28px", color: "#888", fontSize: "0.95rem" },
  form: { display: "flex", flexDirection: "column", gap: "4px" },
  label: { fontSize: "0.85rem", fontWeight: "600", color: "#aaa", marginTop: "16px", marginBottom: "8px", display: "block" },
  input: { padding: "12px 16px", borderRadius: "8px", border: "1px solid #444", backgroundColor: "#1f1f1f", color: TEXT, fontSize: "1rem", outline: "none", width: "100%", boxSizing: "border-box" },
  inputWrapper: { position: "relative" },
  prefix: { position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#666", fontWeight: "600", pointerEvents: "none" },
  dateTimeRow: { display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "8px" },
  durationBadge: { display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#252525", padding: "10px 16px", borderRadius: "8px", marginTop: "8px", border: "1px solid #333" },
  durationLabel: { color: "#888", fontSize: "0.85rem" },
  durationValue: { color: "#00D084", fontWeight: "700", fontSize: "1rem" },
  textarea: { padding: "12px 16px", borderRadius: "8px", border: "1px solid #444", backgroundColor: "#1f1f1f", color: TEXT, fontSize: "1rem", outline: "none", resize: "vertical", fontFamily: "'Segoe UI', sans-serif", minHeight: "100px" },
  btnRow: { display: "flex", gap: "12px", marginTop: "24px" },
  cancelBtn: { flex: 1, padding: "14px", backgroundColor: "transparent", color: "#888", border: "1px solid #444", borderRadius: "8px", fontSize: "1rem", fontWeight: "600", cursor: "pointer" },
  submitBtn: { flex: 2, padding: "14px", backgroundColor: BLUE, color: "#fff", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: "700", cursor: "pointer" },
};

export default AddTournament;