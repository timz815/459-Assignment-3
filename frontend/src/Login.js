import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";
import { AuthContext } from "./context/AuthContext";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [allPlants, setAllPlants] = useState([]); // store everything for filtering
  const [error, setError] = useState("");

  const { token } = useContext(AuthContext);

  // search state - the search term
  const [searchTerm, setSearchTerm] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // data fetching - GET all plants (GET is the default method)
  useEffect(() => {
    fetch("http://localhost:5000/api/plants")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAllPlants(data);
        }
      })
      .catch((err) => console.error("Error fetching public plants:", err));
  }, []);

  useEffect(() => {
    if (token) {
      navigate("/"); // redirect to dashboard if already logged in
    }
  }, [token, navigate]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // authentication logic
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
        navigate("/");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  }

  // search logic
  const filteredPlants = allPlants
    .filter((plant) => {
      return (plant.common_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    })
    .slice(0, 10); // Show only top 10 (5 per row)

  // helper function to clean image URLs from Google Search redirects
  function getCleanImageUrl(url) {
    if (!url) return null;
    if (url.includes("search?q=")) {
      try {
        const directUrl = url.split("search?q=")[1];
        return decodeURIComponent(directUrl);
      } catch (e) {
        return url;
      }
    }
    return url;
  }

  return (
    <div className="page-container" style={styles.pageContainer}>
      {/* login form */}
      <div style={styles.formWrapper}>
        <div className="card" style={styles.loginCard}>
          <h2 style={styles.loginTitle}>Login</h2>

          {error && <div style={styles.errorBanner}>{error}</div>}

          <form onSubmit={handleSubmit} className="plant-form">
            <label>Username</label>
            <input
              name="username"
              type="text"
              placeholder="Username"
              onChange={handleChange}
              required
            />

            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />

            <button type="submit" style={styles.submitBtn}>
              Sign In
            </button>
          </form>

          <p style={styles.footerText}>
            Need an account?{" "}
            <Link to="/register" style={styles.registerLink}>
              Register here
            </Link>
          </p>
        </div>
      </div>

      {/* search by name only */}
      <div className="card" style={styles.searchCard}>
        <div style={styles.searchRow}>
          <div style={styles.searchInputGroup}>
            <label style={styles.searchLabel}>Search by Plant Name</label>
            <input
              type="text"
              placeholder="Start typing a plant name (e.g. 'Janet' or 'Lily')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <button onClick={() => setSearchTerm("")} style={styles.clearBtn}>
            Clear
          </button>
        </div>
      </div>

      {/* 5-col grid (top 10 results) */}
      <div style={styles.gridWrapper}>
        <h2 style={styles.previewTitle}>PLANTS COLLECTION - PREVIEW</h2>

        <div className="plant-grid" style={styles.plantGrid}>
          {filteredPlants.length > 0 ? (
            filteredPlants.map((plant) => (
              <div key={plant._id} className="plant-card">
                <div
                  className="image-container"
                  style={styles.cardImageContainer}
                >
                  {plant.img_url ? (
                    <img
                      src={getCleanImageUrl(plant.img_url)}
                      alt={plant.common_name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/200?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="placeholder">No Image</div>
                  )}
                </div>
                <div className="card-details" style={styles.cardDetailsText}>
                  <h3 style={styles.cardTitle}>{plant.common_name}</h3>
                  <p style={styles.cardFamily}>
                    <small>
                      <strong>{plant.family}</strong>
                    </small>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div style={styles.noResults}>
              <p>No plants match your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  formWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px",
  },
  loginCard: {
    width: "400px",
  },
  loginTitle: {
    textAlign: "center",
    color: "#2e7d32",
    marginBottom: "20px",
  },
  errorBanner: {
    backgroundColor: "#ffebee",
    color: "#c62828",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "15px",
    textAlign: "center",
  },
  submitBtn: {
    marginTop: "10px",
  },
  footerText: {
    textAlign: "center",
    marginTop: "15px",
    fontSize: "0.9rem",
  },
  registerLink: {
    color: "#2e7d32",
    fontWeight: "bold",
  },
  searchCard: {
    width: "100%",
    maxWidth: "1200px",
    marginBottom: "40px",
    backgroundColor: "#f1f8e9",
  },
  searchRow: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  searchInputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    width: "100%",
    maxWidth: "500px",
  },
  searchLabel: {
    fontSize: "0.8rem",
    fontWeight: "bold",
    color: "#2e7d32",
  },
  searchInput: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #c8e6c9",
    fontSize: "1rem",
  },
  clearBtn: {
    padding: "10px 20px",
    background: "#666",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    height: "42px",
    fontWeight: "bold",
  },
  gridWrapper: {
    width: "100%",
    maxWidth: "1200px",
  },
  previewTitle: {
    color: "#2e7d32",
    textAlign: "center",
    marginBottom: "30px",
    borderBottom: "2px solid #a5d6a7",
    paddingBottom: "10px",
  },
  plantGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "20px",
  },
  cardImageContainer: {
    height: "140px",
  },
  cardDetailsText: {
    textAlign: "center",
  },
  cardTitle: {
    fontSize: "1rem",
  },
  cardFamily: {
    margin: 0,
  },
  noResults: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "40px",
  },
};

export default Login;
