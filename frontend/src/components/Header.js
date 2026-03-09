import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Header() {
  const { token, user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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
      <div style={styles.headerContent}>
        {/* Left — Logo */}
        <Link to="/" style={styles.logo}>
          PaperTrader Arena
        </Link>

        {/* Center — Nav */}
        <nav style={styles.centerNav}>
          <Link
            to="/tournaments"
            style={styles.navLink}
            onMouseEnter={e => e.target.style.backgroundColor = "#333333"}
            onMouseLeave={e => e.target.style.backgroundColor = "transparent"}
          >
            Tournaments
          </Link>
        </nav>

        {/* Right — Auth */}
        <nav style={styles.rightNav}>
          {token ? (
            <div style={styles.dropdownWrapper} ref={dropdownRef}>
              <button
                style={styles.accountBtn}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user?.username}
                <span style={styles.caret}>{dropdownOpen ? "▲" : "▼"}</span>
              </button>

              {dropdownOpen && (
                <div style={styles.dropdown}>
                  <button
                    onClick={() => { navigate("/dashboard"); setDropdownOpen(false); }}
                    style={styles.dropdownItem}
                  >
                    Account
                  </button>
                  <div style={styles.dropdownDivider} />
                  <button onClick={handleLogout} style={styles.dropdownItemRed}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" style={styles.outline}>Login</Link>
              <Link to="/register" style={styles.filled}>Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

const BLUE = "#0F9FEA";
const BG = "#1A1A1A";
const TEXT = "#F9F9F9";

const styles = {
  header: {
    backgroundColor: BG,
    borderBottom: "1px solid #3a3a3a",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "64px",
    maxWidth: "1500px",
    margin: "0 auto",
    padding: "0 40px",
  },
  logo: {
    fontSize: "1.2rem",
    fontWeight: "700",
    color: TEXT,
    textDecoration: "none",
    letterSpacing: "-0.3px",
    whiteSpace: "nowrap",
  },
  centerNav: {
    display: "flex",
    gap: "32px",
    alignItems: "center",
  },
  navLink: {
    color: TEXT,
    textDecoration: "none",
    fontSize: "0.95rem",
    fontWeight: "500",
    padding: "6px 14px",
    borderRadius: "6px",
    backgroundColor: "transparent",
    transition: "background-color 0.2s",
  },
  rightNav: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  outline: {
    padding: "8px 20px",
    borderRadius: "6px",
    border: `2px solid ${BLUE}`,
    background: "transparent",
    color: BLUE,
    fontWeight: "600",
    fontSize: "0.9rem",
    textDecoration: "none",
  },
  filled: {
    padding: "8px 20px",
    borderRadius: "6px",
    background: BLUE,
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
    border: "none",
    background: "#333333",
    color: TEXT,
    fontWeight: "600",
    fontSize: "0.9rem",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  caret: {
    fontSize: "0.6rem",
    color: "#aaa",
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 4px)",
    right: 0,
    backgroundColor: "#333333",
    border: "none",
    borderRadius: "6px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
    width: "100%",
    minWidth: "unset",
    overflow: "hidden",
    boxSizing: "border-box",
  },
  dropdownItem: {
    width: "100%",
    padding: "8px 16px",
    background: "none",
    border: "none",
    textAlign: "center",
    cursor: "pointer",
    fontSize: "0.9rem",
    color: TEXT,
    fontWeight: "600",
    boxSizing: "border-box",
    whiteSpace: "nowrap",
  },
  dropdownDivider: {
    height: "1px",
    backgroundColor: "#444",
    margin: "0 8px",
  },
  dropdownItemRed: {
    width: "100%",
    padding: "8px 16px",
    background: "none",
    border: "none",
    textAlign: "center",
    cursor: "pointer",
    fontSize: "0.9rem",
    color: "#ff6b6b",
    fontWeight: "600",
    boxSizing: "border-box",
    whiteSpace: "nowrap",
  },
};

export default Header;