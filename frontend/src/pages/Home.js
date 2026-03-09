import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <Header />

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <h1 style={styles.heroTitle}>Test Your Trading Skills in Stock Market Simulator Tournaments</h1>

          <button
            style={styles.ctaButton}
            onClick={() => navigate("/tournaments")}
          >
            View Tournaments
          </button>
        </div>
      </section>
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

  hero: {
    backgroundColor: BG,
    padding: "120px 20px",
  },

  heroInner: {
    maxWidth: "900px",
    margin: "0 auto",
  },

  heroTitle: {
    fontSize: "2.6rem",
    fontWeight: "700",
    color: TEXT,
    margin: "0 0 8px",
    lineHeight: 1.2,
  },

  heroText: {
    marginTop: "20px",
    color: "#aaa",
    fontSize: "1rem",
    maxWidth: "600px",
  },

  ctaButton: {
    marginTop: "40px",
    padding: "12px 28px",
    backgroundColor: BLUE,
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default Home;
