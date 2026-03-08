import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Header";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { token, login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) navigate("/dashboard");
  }, [token, navigate]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.token);
        navigate("/dashboard");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  }

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Sign in to your garden</p>

          {error && <div style={styles.errorBanner}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>Username</label>
            <input
              name="username"
              type="text"
              placeholder="Your username"
              onChange={handleChange}
              required
              style={styles.input}
            />
            <label style={styles.label}>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Your password"
              onChange={handleChange}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.submitBtn}>Sign In</button>
          </form>

          <p style={styles.footerText}>
            Need an account?{" "}
            <Link to="/register" style={styles.link}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const GREEN = "#2e7d32";
const BORDER = "#c8e6c9";

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#f4f7f4", fontFamily: "'Segoe UI', sans-serif" },
  container: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 64px)" },
  card: { width: "100%", maxWidth: "400px", backgroundColor: "#fff", borderRadius: "12px", padding: "40px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" },
  title: { margin: "0 0 4px", color: GREEN, fontSize: "1.8rem", textAlign: "center" },
  subtitle: { margin: "0 0 28px", color: "#888", fontSize: "0.9rem", textAlign: "center" },
  errorBanner: { backgroundColor: "#ffebee", color: "#c62828", padding: "10px", borderRadius: "6px", marginBottom: "16px", fontSize: "0.9rem", textAlign: "center" },
  form: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "0.8rem", fontWeight: "600", color: "#444", marginTop: "10px" },
  input: { padding: "10px 14px", borderRadius: "6px", border: `1px solid ${BORDER}`, fontSize: "1rem", outline: "none" },
  submitBtn: { marginTop: "18px", padding: "12px", backgroundColor: GREEN, color: "#fff", border: "none", borderRadius: "6px", fontSize: "1rem", fontWeight: "600", cursor: "pointer", width: "100%" },
  footerText: { marginTop: "20px", textAlign: "center", fontSize: "0.88rem", color: "#666" },
  link: { color: GREEN, fontWeight: "bold", textDecoration: "none" },
};

export default Login;
