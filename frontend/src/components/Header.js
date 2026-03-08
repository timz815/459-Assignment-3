import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Header() {
  const { token, user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // close dropdown if user clicks outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    setDropdownOpen(false);
    navigate("/");
  }

  return (
    <header style={styles.header}>
      <Link to={token ? "/dashboard" : "/"} style={styles.logo}>
        🌿 PlantCollection
      </Link>

      <nav style={styles.nav}>
        {token ? (
          /* ── logged in: show My Account dropdown ── */
          <div style={styles.dropdownWrapper} ref={dropdownRef}>
            <button
              style={styles.accountBtn}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              👤 {user?.username}
              <span style={styles.caret}>{dropdownOpen ? "▲" : "▼"}</span>
            </button>

            {dropdownOpen && (
              <div style={styles.dropdown}>
                <button onClick={handleLogout} style={styles.dropdownItem}>
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ── logged out: show Login + Sign Up ── */
          <>
            <Link to="/login" style={styles.outline}>Login</Link>
            <Link to="/register" style={styles.filled}>Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
}

const GREEN = "#2e7d32";
const BORDER = "#c8e6c9";

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 40px",
    height: "64px",
    backgroundColor: "#fff",
    borderBottom: `1px solid ${BORDER}`,
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  logo: {
    fontSize: "1.2rem",
    fontWeight: "700",
    color: GREEN,
    textDecoration: "none",
    letterSpacing: "-0.3px",
  },
  nav: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  outline: {
    padding: "8px 20px",
    borderRadius: "6px",
    border: `2px solid ${GREEN}`,
    background: "transparent",
    color: GREEN,
    fontWeight: "600",
    fontSize: "0.9rem",
    textDecoration: "none",
  },
  filled: {
    padding: "8px 20px",
    borderRadius: "6px",
    background: GREEN,
    color: "#fff",
    fontWeight: "600",
    fontSize: "0.9rem",
    textDecoration: "none",
  },
  dropdownWrapper: {
    position: "relative",
  },
  accountBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    borderRadius: "6px",
    border: `2px solid ${BORDER}`,
    background: "#fff",
    color: "#333",
    fontWeight: "600",
    fontSize: "0.9rem",
    cursor: "pointer",
  },
  caret: {
    fontSize: "0.6rem",
    color: "#888",
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    backgroundColor: "#fff",
    border: `1px solid ${BORDER}`,
    borderRadius: "8px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
    minWidth: "140px",
    overflow: "hidden",
  },
  dropdownItem: {
    width: "100%",
    padding: "12px 16px",
    background: "none",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "0.9rem",
    color: "#c62828",
    fontWeight: "600",
  },
};

export default Header;
