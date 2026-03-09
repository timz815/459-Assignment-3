import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";

function TournamentDetail() {
  const { id } = useParams();
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tournament, setTournament] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isParticipant, setIsParticipant] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const tRes = await fetch("http://localhost:5000/api/tournaments/" + id);
        const tData = await tRes.json();
        setTournament(tData);

        if (user && tData.owner) {
          setIsOwner(tData.owner._id === user.id || tData.owner === user.id);
        }

        const pRes = await fetch("http://localhost:5000/api/tournaments/" + id + "/participants");
        const pData = await pRes.json();
        setParticipants(Array.isArray(pData) ? pData : []);

        if (user && Array.isArray(pData)) {
          const already = pData.some((p) => p.user?._id === user.id || p.user === user.id);
          setIsParticipant(already);
        }
      } catch (err) {
        console.error("Error fetching tournament:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, user]);

  async function handleJoin() {
    try {
      const res = await fetch("http://localhost:5000/api/tournaments/" + id + "/join", {
        method: "POST",
        headers: { Authorization: token },
      });
      const data = await res.json();
      if (res.ok) {
        setIsParticipant(true);
        const pRes = await fetch("http://localhost:5000/api/tournaments/" + id + "/participants");
        const pData = await pRes.json();
        setParticipants(pData);
      } else {
        alert(data.message || "Failed to join");
      }
    } catch (err) {
      console.error("Join error:", err);
    }
  }

  async function handleLeave() {
    try {
      const res = await fetch("http://localhost:5000/api/tournaments/" + id + "/leave", {
        method: "DELETE",
        headers: { Authorization: token },
      });
      const data = await res.json();
      if (res.ok) {
        setIsParticipant(false);
        const pRes = await fetch("http://localhost:5000/api/tournaments/" + id + "/participants");
        const pData = await pRes.json();
        setParticipants(pData);
      } else {
        alert(data.message || "Failed to leave");
      }
    } catch (err) {
      console.error("Leave error:", err);
    }
  }

  async function handleClose() {
    try {
      const res = await fetch("http://localhost:5000/api/tournaments/" + id + "/close", {
        method: "PATCH",
        headers: { Authorization: token },
      });
      const data = await res.json();
      if (res.ok) {
        setTournament(data);
      } else {
        alert(data.message || "Failed to update tournament status");
      }
    } catch (err) {
      console.error("Close/Open error:", err);
    }
  }

  async function handleDeleteTournament() {
    if (!window.confirm("Are you sure you want to delete this tournament? This cannot be undone.")) return;
    try {
      const res = await fetch("http://localhost:5000/api/tournaments/" + id, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      if (res.ok) {
        navigate("/tournaments");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete tournament");
      }
    } catch (err) {
      console.error("Delete tournament error:", err);
    }
  }

  function getStatusStyle(status) {
    switch (status) {
      case "open":   return { bg: "#0a3a4a", color: "#0F9FEA" };
      case "active": return { bg: "#0a3a1a", color: "#4caf50" };
      case "closed": return { bg: "#3a1a1a", color: "#ff6b6b" };
      case "ended":  return { bg: "#2a2a2a", color: "#888" };
      default:       return { bg: "#2a2a2a", color: "#888" };
    }
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <Header />
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div style={styles.page}>
        <Header />
        <div style={styles.loading}>Tournament not found.</div>
      </div>
    );
  }

  const { bg, color } = getStatusStyle(tournament.status);
  const canJoin = tournament.status === "open" || tournament.status === "active";

  return (
    <div style={styles.page}>
      <Header />

      <div style={styles.content}>
        <button style={styles.backBtn} onClick={() => navigate("/tournaments")}>
          ← Back to Tournaments
        </button>

        <div style={styles.tournamentHeader}>
          <div style={styles.titleRow}>
            <h1 style={styles.title}>{tournament.name}</h1>
            <span style={{ ...styles.badge, backgroundColor: bg, color }}>
              {tournament.status}
            </span>
          </div>

          <div style={styles.metaRow}>
            <span style={styles.meta}>{tournament.start_date?.slice(0, 10)} → {tournament.end_date?.slice(0, 10)}</span>
            <span style={styles.metaDivider}>·</span>
            <span style={styles.meta}>${tournament.starting_balance} starting balance</span>
            <span style={styles.metaDivider}>·</span>
            <span style={styles.meta}>{participants.length} participants</span>
            {tournament.owner?.username && (
              <>
                <span style={styles.metaDivider}>·</span>
                <span style={styles.meta}>Hosted by {tournament.owner.username}</span>
              </>
            )}
          </div>

          {tournament.description && (
            <p style={styles.description}>{tournament.description}</p>
          )}
        </div>

        <div style={styles.statusCard}>
          {!token ? (
            <div style={styles.statusRow}>
              <p style={styles.statusMsg}>Login to join this tournament.</p>
              <button style={styles.joinBtn} onClick={() => navigate("/login")}>
                Login to Join
              </button>
            </div>
          ) : isOwner ? (
            <div style={styles.statusRow}>
              <p style={styles.statusMsgBlue}>You created this tournament.</p>
              <div style={{ display: "flex", gap: "12px" }}>
                <button style={styles.closeBtn} onClick={handleClose}>
                  {tournament.status === "closed" ? "Open Joining" : "Close Joining"}
                </button>
                <button style={styles.deleteBtn} onClick={handleDeleteTournament}>
                  Delete Tournament
                </button>
              </div>
            </div>
          ) : isParticipant ? (
            <div style={styles.statusRow}>
              <p style={styles.statusMsgGreen}>✓ You are participating in this tournament.</p>
              {canJoin && (
                <button style={styles.leaveBtn} onClick={handleLeave}>
                  Leave Tournament
                </button>
              )}
            </div>
          ) : (
            <div style={styles.statusRow}>
              <p style={styles.statusMsg}>You are not part of this tournament.</p>
              {canJoin ? (
                <button style={styles.joinBtn} onClick={handleJoin}>
                  Join Tournament
                </button>
              ) : (
                <span style={styles.closedMsg}>Tournament is {tournament.status}</span>
              )}
            </div>
          )}
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            Participants
            <span style={styles.sectionCount}> ({participants.length})</span>
          </h2>

          {participants.length > 0 ? (
            <div style={styles.participantList}>
              {participants.map((p, index) => (
                <div key={p._id} style={styles.participantRow}>
                  <div style={styles.participantLeft}>
                    <span style={styles.rank}>#{index + 1}</span>
                    <span style={styles.username}>{p.user?.username || "Unknown"}</span>
                  </div>
                  <span style={styles.balance}>${p.cash_balance?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.empty}>
              <p>No participants yet. Be the first to join!</p>
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
  page: { minHeight: "100vh", backgroundColor: BG, color: TEXT, fontFamily: "'Segoe UI', sans-serif" },
  content: { maxWidth: "1250px", margin: "0 auto", padding: "40px 20px 80px" },
  loading: { textAlign: "center", padding: "80px", color: "#888" },
  backBtn: { background: "none", border: "none", color: BLUE, fontWeight: "600", fontSize: "0.9rem", cursor: "pointer", padding: "0 0 24px 0", display: "block" },
  tournamentHeader: { marginBottom: "24px" },
  titleRow: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px", flexWrap: "wrap" },
  title: { margin: 0, fontSize: "2rem", fontWeight: "700", color: TEXT },
  badge: { padding: "4px 14px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "600", whiteSpace: "nowrap" },
  metaRow: { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "12px" },
  meta: { fontSize: "0.9rem", color: "#aaa" },
  metaDivider: { color: "#444" },
  description: { color: "#888", fontSize: "0.95rem", marginTop: "12px", lineHeight: 1.6 },
  statusCard: { backgroundColor: "#2a2a2a", border: "1px solid #3a3a3a", borderRadius: "10px", padding: "20px 24px", marginBottom: "32px" },
  statusRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px" },
  statusMsg: { margin: 0, color: "#888", fontSize: "0.95rem" },
  statusMsgGreen: { margin: 0, color: "#4caf50", fontSize: "0.95rem", fontWeight: "600" },
  statusMsgBlue: { margin: 0, color: BLUE, fontSize: "0.95rem", fontWeight: "600" },
  joinBtn: { padding: "10px 24px", backgroundColor: BLUE, color: "#fff", border: "none", borderRadius: "6px", fontWeight: "600", fontSize: "0.95rem", cursor: "pointer", whiteSpace: "nowrap" },
  leaveBtn: { padding: "10px 24px", backgroundColor: "transparent", color: "#ff6b6b", border: "1px solid #ff6b6b", borderRadius: "6px", fontWeight: "600", fontSize: "0.95rem", cursor: "pointer", whiteSpace: "nowrap" },
  closeBtn: { padding: "10px 24px", backgroundColor: "transparent", color: "#ffaa55", border: "1px solid #ffaa55", borderRadius: "6px", fontWeight: "600", fontSize: "0.95rem", cursor: "pointer", whiteSpace: "nowrap" },
  deleteBtn: { padding: "10px 24px", backgroundColor: "transparent", color: "#ff6b6b", border: "1px solid #ff6b6b", borderRadius: "6px", fontWeight: "600", fontSize: "0.95rem", cursor: "pointer", whiteSpace: "nowrap" },
  closedMsg: { color: "#666", fontSize: "0.9rem", fontStyle: "italic" },
  section: {},
  sectionTitle: { fontSize: "1.2rem", fontWeight: "600", color: TEXT, marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid #3a3a3a" },
  sectionCount: { color: "#888", fontWeight: "400", fontSize: "1rem" },
  participantList: { display: "flex", flexDirection: "column", gap: "8px" },
  participantRow: { display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#252525", padding: "14px 20px", borderRadius: "8px" },
  participantLeft: { display: "flex", alignItems: "center", gap: "14px" },
  rank: { color: "#555", fontSize: "0.85rem", fontWeight: "600", minWidth: "28px" },
  username: { color: TEXT, fontWeight: "600", fontSize: "0.95rem" },
  balance: { color: "#4caf50", fontWeight: "700", fontSize: "0.95rem" },
  empty: { textAlign: "center", padding: "40px", color: "#666" },
};

export default TournamentDetail;