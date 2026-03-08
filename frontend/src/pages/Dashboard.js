import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";

function Dashboard() {
  const [plants, setPlants] = useState([]);
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/plants/my-plants", {
      headers: { Authorization: token },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not retrieve your garden data.");
        return res.json();
      })
      .then((data) => setPlants(data))
      .catch((err) => console.error("Fetch error:", err));
  }, [token]);

  async function handleDelete(id) {
    try {
      const res = await fetch(`http://localhost:5000/api/plants/${id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });

      if (res.ok) {
        setPlants(plants.filter((p) => p._id !== id));
      } else {
        alert("Delete failed. You might not have permission to remove this item.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  function getCleanImageUrl(url) {
    if (!url) return null;
    if (url.includes("search?q=")) {
      try {
        return decodeURIComponent(url.split("search?q=")[1]);
      } catch (e) {
        return url;
      }
    }
    return url;
  }

  return (
    <div style={styles.page}>
      <Header />

      <div style={styles.content}>
        {/* Page title row */}
        <div style={styles.titleRow}>
          <div>
            <h1 style={styles.pageTitle}>My Garden</h1>
            {user && (
              <p style={styles.welcomeText}>Welcome back, {user.username}!</p>
            )}
          </div>
          <button
            style={styles.addBtn}
            onClick={() => navigate("/add-plant")}
          >
            + Add New Plant
          </button>
        </div>

        {/* Plant grid */}
        <div style={styles.plantGrid}>
          {plants.length > 0 ? (
            plants.map((plant) => (
              <div key={plant._id} style={styles.plantCard}>
                <div style={styles.cardImg}>
                  {plant.img_url ? (
                    <img
                      src={getCleanImageUrl(plant.img_url)}
                      alt={plant.common_name}
                      style={styles.img}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/260x180?text=Image+Not+Found";
                      }}
                    />
                  ) : (
                    <div style={styles.noImg}>No Image Provided</div>
                  )}
                </div>
                <div style={styles.cardBody}>
                  <h3 style={styles.cardName}>{plant.common_name || "Unnamed Plant"}</h3>
                  <p style={styles.cardDetail}><strong>Family:</strong> {plant.family || "N/A"}</p>
                  <p style={styles.cardDetail}><strong>Category:</strong> {plant.categories || "N/A"}</p>
                  <p style={styles.cardSmall}>Origin: {plant.origin || "N/A"}</p>
                  <p style={styles.cardSmall}>Climate: {plant.climate || "N/A"}</p>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(plant._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={styles.emptyMessage}>
              <p>Your garden is empty. Click <strong>"+ Add New Plant"</strong> to get started!</p>
            </div>
          )}
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
    backgroundColor: "#fafafa",
    fontFamily: "'Segoe UI', sans-serif",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px",
  },
  titleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
    borderBottom: `2px solid ${BORDER}`,
    paddingBottom: "20px",
  },
  pageTitle: {
    margin: "0 0 4px",
    color: GREEN,
    fontSize: "2rem",
  },
  welcomeText: {
    margin: 0,
    color: "#666",
    fontSize: "0.95rem",
  },
  addBtn: {
    padding: "12px 24px",
    backgroundColor: GREEN,
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  plantGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "24px",
  },
  plantCard: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
    border: `1px solid ${BORDER}`,
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  cardImg: {
    height: "160px",
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  noImg: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#bbb",
    fontSize: "0.85rem",
  },
  cardBody: {
    padding: "16px",
  },
  cardName: {
    margin: "0 0 8px",
    fontSize: "1rem",
    color: "#222",
  },
  cardDetail: {
    margin: "4px 0",
    fontSize: "0.9rem",
    color: "#444",
  },
  cardSmall: {
    margin: "4px 0",
    fontSize: "0.8rem",
    color: "#888",
  },
  deleteBtn: {
    marginTop: "12px",
    padding: "8px 16px",
    backgroundColor: "#c62828",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.85rem",
  },
  emptyMessage: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "60px 40px",
    color: "#666",
  },
};

export default Dashboard;