import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

function Register() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Registration successful! Please log in.");
        navigate("/login");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
    }
  }

  return (
    <div style={styles.page}>
      <Header />
      <div style={styles.centerer}>
        <div style={styles.card}>
          <h2 style={styles.title}>Create Account</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>Username</label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
              style={styles.input}
            />
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Choose a password"
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              Register
            </button>
          </form>
          <p style={styles.footerText}>
            Already have an account?{" "}
            <span onClick={() => navigate("/login")} style={styles.link}>
              Login here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

const BLUE = "#0F9FEA";
const TEXT = "#F9F9F9";

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#1A1A1A",
  },
  centerer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 64px)",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    padding: "2rem",
    backgroundColor: "#333333",
    borderRadius: "8px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
  },
  title: {
    textAlign: "center",
    color: TEXT,
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "0.8rem",
    fontWeight: "600",
    color: "#aaa",
    marginTop: "10px",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1px solid #444",
    backgroundColor: "#2a2a2a",
    color: TEXT,
    fontSize: "1rem",
    outline: "none",
  },
  button: {
    marginTop: "1.2rem",
    backgroundColor: BLUE,
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer",
    width: "100%",
    fontWeight: "600",
    fontSize: "1rem",
  },
  footerText: {
    marginTop: "1.5rem",
    textAlign: "center",
    fontSize: "0.9rem",
    color: "#888",
  },
  link: {
    color: BLUE,
    cursor: "pointer",
    fontWeight: "bold",
    textDecoration: "underline",
  },
};

export default Register;