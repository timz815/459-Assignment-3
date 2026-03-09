import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";

function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/tournaments")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTournaments(data);
      })
      .catch((err) => console.error("Error fetching tournaments:", err));
  }, []);

  const filtered = tournaments.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function getStatusStyle(status) {
    switch (status) {
      case "open":   return { bg: "#0a3a4a", color: "#0F9FEA" };
      case "active": return { bg: "#0a3a1a", color: "#4caf50" };
      case "closed": return { bg: "#3a1a1a", color: "#ff6b6b" };
      case "ended":  return { bg: "#2a2a2a", color: "#888" };
      default:       return { bg: "#2a2a2a", color: "#888" };
    }
  }

  function getJoinLabel(t) {
    if (!token) return "Login to Join";
    if (t.status === "open" || t.status === "active") return "Join";
    return "View";
  }

  return (
    <div style={styles.page}>
      <Header />

      <div style={styles.content}>
        {/* Title row */}
        <div style={styles.titleRow}>
          <h1 style={styles.pageTitle}>Tournaments</h1>
          {token && (
            <button
              style={styles.createBtn}
              onClick={() => navigate("/add-tournament")}
            >
              Create Tournament
            </button>
          )}
        </div>

        {/* Search */}
        <div style={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Search tournaments…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <span style={styles.searchIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
        </div>

        {/* List */}
        <div style={styles.list}>
          {filtered.length > 0 ? (
            filtered.map((t) => {
              const { bg, color } = getStatusStyle(t.status);
              return (
                <div
                  key={t._id}
                  style={{ ...styles.card, cursor: "pointer" }}
                  onClick={() => navigate(`/tournaments/${t._id}`)}
                >
                  <div style={styles.cardLeft}>
                    <h3 style={styles.cardName}>{t.name}</h3>
                    <div style={styles.cardStats}>
                      <span style={styles.stat}>📅 {t.start_date?.slice(0, 10)} → {t.end_date?.slice(0, 10)}</span>
                      <span style={styles.statDivider}>·</span>
                      <span style={styles.stat}>💰 ${t.starting_balance} starting balance</span>
                    </div>
                    {t.description && <p style={styles.description}>{t.description}</p>}
                  </div>
                  <div style={styles.cardRight}>
                    <span style={{ ...styles.badge, backgroundColor: bg, color }}>
                      {t.status}
                    </span>
                    <button
                      style={styles.joinBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/tournaments/${t._id}`);
                      }}
                    >
                      {getJoinLabel(t)}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={styles.empty}>
              <p>No tournaments found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const BLUE = "#0F9FEA";
const BG = "#1A1A1A";
const TEXT = "#F9F9F9";

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: BG,
    color: TEXT,
    fontFamily: "'Segoe UI', sans-serif",
  },
  content: {
    maxWidth: "1250px",
    margin: "0 auto",
    padding: "50px 20px 80px",
  },
  titleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
    paddingBottom: "20px",
    borderBottom: "1px solid #3a3a3a",
  },
  pageTitle: {
    margin: 0,
    fontSize: "2rem",
    color: TEXT,
    fontWeight: "700",
  },
  createBtn: {
    padding: "10px 22px",
    backgroundColor: BLUE,
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "0.95rem",
    cursor: "pointer",
  },
  searchWrapper: {
    position: "relative",
    maxWidth: "500px",
    marginBottom: "28px",
  },
  searchInput: {
    width: "100%",
    padding: "12px 44px 12px 18px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#333333",
    color: TEXT,
    fontSize: "1rem",
    outline: "none",
    boxSizing: "border-box",
  },
  searchIcon: {
    position: "absolute",
    right: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    alignItems: "center",
    pointerEvents: "none",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  card: {
    backgroundColor: "#333333",
    borderRadius: "10px",
    padding: "20px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },
  cardLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  cardName: {
    margin: 0,
    fontSize: "1rem",
    color: TEXT,
    fontWeight: "600",
  },
  cardStats: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  stat: {
    fontSize: "0.85rem",
    color: "#aaa",
  },
  statDivider: {
    color: "#555",
  },
  description: {
    margin: "4px 0 0",
    fontSize: "0.85rem",
    color: "#777",
  },
  cardRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexShrink: 0,
  },
  badge: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  joinBtn: {
    padding: "8px 20px",
    backgroundColor: BLUE,
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "0.9rem",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  empty: {
    textAlign: "center",
    padding: "60px 40px",
    color: "#666",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
};

export default Tournaments;