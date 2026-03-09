import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";

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
      <Header />
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>Login</h2>

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
            <button type="submit" style={styles.button}>Sign In</button>
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

const BLUE = "#0F9FEA";
const TEXT = "#F9F9F9";

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#1A1A1A",
  },
  container: {
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
  errorBanner: {
    backgroundColor: "#4a1a1a",
    color: "#ff6b6b",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "16px",
    fontSize: "0.9rem",
    textAlign: "center",
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
    marginTop: "1rem",
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
    fontWeight: "bold",
    textDecoration: "none",
  },
};

export default Login;