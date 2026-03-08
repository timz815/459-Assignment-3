import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";

function AddPlant() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    common_name: "",
    family: "",
    categories: "",
    origin: "",
    climate: "",
    img_url: "",
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/plants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        navigate("/dashboard");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to add plant");
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
          {/* Back button */}
          <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>
            ← Back to My Garden
          </button>

          <h2 style={styles.title}>Add New Plant</h2>
          <p style={styles.subtitle}>Fill in the details for your new plant</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>Common Name *</label>
            <input
              name="common_name"
              value={formData.common_name}
              onChange={handleChange}
              placeholder="e.g. Janet Craig"
              required
              style={styles.input}
            />

            <label style={styles.label}>Family</label>
            <input
              name="family"
              value={formData.family}
              onChange={handleChange}
              placeholder="e.g. Liliaceae"
              style={styles.input}
            />

            <label style={styles.label}>Category</label>
            <input
              name="categories"
              value={formData.categories}
              onChange={handleChange}
              placeholder="e.g. Dracaena"
              style={styles.input}
            />

            <label style={styles.label}>Origin</label>
            <input
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              placeholder="e.g. Cultivar"
              style={styles.input}
            />

            <label style={styles.label}>Climate</label>
            <input
              name="climate"
              value={formData.climate}
              onChange={handleChange}
              placeholder="e.g. Tropical"
              style={styles.input}
            />

            <label style={styles.label}>Image URL</label>
            <input
              name="img_url"
              value={formData.img_url}
              onChange={handleChange}
              placeholder="https://..."
              style={styles.input}
            />

            <div style={styles.btnRow}>
              <button
                type="button"
                style={styles.cancelBtn}
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </button>
              <button type="submit" style={styles.submitBtn}>
                Add to Garden
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const GREEN = "#2e7d32";
const BORDER = "#c8e6c9";

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f4f7f4",
    fontFamily: "'Segoe UI', sans-serif",
  },
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "40px 20px",
  },
  card: {
    width: "100%",
    maxWidth: "520px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "40px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  backBtn: {
    background: "none",
    border: "none",
    color: GREEN,
    fontWeight: "600",
    fontSize: "0.9rem",
    cursor: "pointer",
    padding: "0",
    marginBottom: "24px",
    display: "block",
  },
  title: {
    margin: "0 0 4px",
    color: GREEN,
    fontSize: "1.8rem",
  },
  subtitle: {
    margin: "0 0 28px",
    color: "#888",
    fontSize: "0.9rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "0.8rem",
    fontWeight: "600",
    color: "#444",
    marginTop: "10px",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "6px",
    border: `1px solid ${BORDER}`,
    fontSize: "1rem",
    outline: "none",
  },
  btnRow: {
    display: "flex",
    gap: "12px",
    marginTop: "24px",
  },
  cancelBtn: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#fff",
    color: "#666",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  submitBtn: {
    flex: 2,
    padding: "12px",
    backgroundColor: GREEN,
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default AddPlant;