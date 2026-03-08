import { useEffect, useState } from "react";
import Navbar from "../components/Header";

function Home() {
  const [allPlants, setAllPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/plants")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAllPlants(data);
      })
      .catch((err) => console.error("Error fetching plants:", err));
  }, []);

  const filteredPlants = allPlants
    .filter((plant) =>
      (plant.common_name || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 10);

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
      <Navbar />

      {/* Hero */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Discover the World of Plants</h1>
        <p style={styles.heroSub}>
          Browse our collection below. Sign up to build and manage your own garden.
        </p>
      </section>

      {/* Search */}
      <section style={styles.searchSection}>
        <input
          type="text"
          placeholder="Search plants by name…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm("")} style={styles.clearBtn}>
            Clear
          </button>
        )}
      </section>

      {/* Grid */}
      <section style={styles.gridSection}>
        <h2 style={styles.gridTitle}>
          Plant Collection Preview
          <span style={styles.gridCount}> — {filteredPlants.length} shown</span>
        </h2>

        <div style={styles.plantGrid}>
          {filteredPlants.length > 0 ? (
            filteredPlants.map((plant) => (
              <div key={plant._id} style={styles.plantCard}>
                <div style={styles.cardImg}>
                  {plant.img_url ? (
                    <img
                      src={getCleanImageUrl(plant.img_url)}
                      alt={plant.common_name}
                      style={styles.img}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/200?text=No+Image";
                      }}
                    />
                  ) : (
                    <div style={styles.noImg}>No Image</div>
                  )}
                </div>
                <div style={styles.cardBody}>
                  <h3 style={styles.cardName}>{plant.common_name}</h3>
                  <p style={styles.cardFamily}>{plant.family || "—"}</p>
                </div>
              </div>
            ))
          ) : (
            <p style={styles.noResults}>No plants match your search.</p>
          )}
        </div>
      </section>
    </div>
  );
}

const GREEN = "#2e7d32";
const LIGHT_GREEN = "#f1f8e9";
const BORDER = "#c8e6c9";

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#fafafa",
    fontFamily: "'Segoe UI', sans-serif",
  },
  hero: {
    textAlign: "center",
    padding: "60px 20px 40px",
    backgroundColor: LIGHT_GREEN,
    borderBottom: `1px solid ${BORDER}`,
  },
  heroTitle: {
    fontSize: "2.2rem",
    color: GREEN,
    margin: "0 0 10px",
  },
  heroSub: {
    fontSize: "1.05rem",
    color: "#555",
    margin: 0,
  },
  searchSection: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    padding: "30px 20px",
  },
  searchInput: {
    padding: "11px 18px",
    borderRadius: "8px",
    border: `1px solid ${BORDER}`,
    fontSize: "1rem",
    width: "100%",
    maxWidth: "480px",
    outline: "none",
  },
  clearBtn: {
    padding: "11px 18px",
    backgroundColor: "#666",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  gridSection: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px 60px",
  },
  gridTitle: {
    color: GREEN,
    borderBottom: `2px solid ${BORDER}`,
    paddingBottom: "10px",
    marginBottom: "24px",
  },
  gridCount: {
    fontWeight: "400",
    color: "#888",
    fontSize: "1rem",
  },
  plantGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "20px",
  },
  plantCard: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
    border: `1px solid ${BORDER}`,
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  cardImg: {
    height: "140px",
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
    padding: "12px",
    textAlign: "center",
  },
  cardName: {
    fontSize: "0.95rem",
    margin: "0 0 4px",
    color: "#222",
  },
  cardFamily: {
    fontSize: "0.8rem",
    color: "#888",
    margin: 0,
  },
  noResults: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "40px",
    color: "#999",
  },
};

export default Home;
