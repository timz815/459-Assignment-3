import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";

function Dashboard() {
  const [tournaments, setTournaments] = useState([]);
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/tournaments/my-tournaments", {
      headers: { Authorization: token },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not retrieve tournaments.");
        return res.json();
      })
      .then((data) => setTournaments(data))
      .catch((err) => console.error("Fetch error:", err));
  }, [token]);

  async function handleDelete(id) {
    try {
      const res = await fetch(`http://localhost:5000/api/tournaments/${id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });

      if (res.ok) {
        setTournaments(tournaments.filter((t) => t._id !== id));
      } else {
        alert("Delete failed. You might not have permission to remove this tournament.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  return (
    <div style={styles.page}>
      <Header />

      <div style={styles.content}>
        {/* Title row */}
        <div style={styles.titleRow}>
          <div>
            <h1 style={styles.pageTitle}>My Tournaments</h1>
            {user && (
              <p style={styles.welcomeText}>Welcome back, {user.username}!</p>
            )}
          </div>
          <button
            style={styles.addBtn}
            onClick={() => navigate("/add-tournament")}
          >
            + Create Tournament
          </button>
        </div>

        {/* Tournament list */}
        <div style={styles.list}>
          {tournaments.length > 0 ? (
            tournaments.map((t) => (
              <div key={t._id} style={styles.card}>
                <div style={styles.cardLeft}>
                  <h3 style={styles.cardName}>{t.name}</h3>
                  <div style={styles.cardStats}>
                    <span style={styles.stat}>📅 {t.start_date?.slice(0, 10)} → {t.end_date?.slice(0, 10)}</span>
                    <span style={styles.statDivider}>·</span>
                    <span style={styles.stat}>💰 ${t.starting_balance} starting balance</span>
                  </div>
                  {t.description && (
                    <p style={styles.description}>{t.description}</p>
                  )}
                </div>
                <div style={styles.cardRight}>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(t._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={styles.emptyMessage}>
              <p>You have no tournaments yet.</p>
              <p>Click <strong style={{ color: "#0F9FEA" }}>+ Create Tournament</strong> to get started!</p>
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
    fontFamily: "'Segoe UI', sans-serif",
    color: TEXT,
  },
  content: {
    maxWidth: "1250px",
    margin: "0 auto",
    padding: "40px 20px",
  },
  titleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
    borderBottom: "1px solid #3a3a3a",
    paddingBottom: "20px",
  },
  pageTitle: {
    margin: "0 0 4px",
    color: TEXT,
    fontSize: "2rem",
  },
  welcomeText: {
    margin: 0,
    color: "#888",
    fontSize: "0.95rem",
  },
  addBtn: {
    padding: "12px 24px",
    backgroundColor: BLUE,
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
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
    flexShrink: 0,
  },
  deleteBtn: {
    padding: "8px 20px",
    backgroundColor: "transparent",
    color: "#ff6b6b",
    border: "1px solid #ff6b6b",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.85rem",
  },
  emptyMessage: {
    textAlign: "center",
    padding: "60px 40px",
    color: "#666",
  },
};

export default Dashboard;