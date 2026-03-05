import { useContext, useEffect, useState } from "react";
import "./App.css";
import { AuthContext } from "./context/AuthContext";

function Dashboard() {
  const [plants, setPlants] = useState([]);
  const { token, user, logout } = useContext(AuthContext);

  // local state for the form, match models/Plant.js and database
  const [formData, setFormData] = useState({
    common_name: "",
    family: "",
    categories: "",
    origin: "",
    climate: "",
    img_url: "",
  });

  // initial load
  // fetches only the plants belonging to the logged-in user.
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/plants/my-plants", {
      headers: {
        Authorization: token,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not retrieve your garden data.");
        return res.json();
      })
      .then((data) => setPlants(data))
      .catch((err) => console.error("Fetch error:", err));
  }, [token]);

  // handle input changes for the controlled form
  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // create
  // adds a new plant
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/plants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const newPlant = await res.json();
        // update local state instantly for a smooth UI experience
        setPlants([...plants, newPlant]);
        // reset the form
        setFormData({
          common_name: "",
          family: "",
          categories: "",
          origin: "",
          climate: "",
          img_url: "",
        });
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to add plant");
      }
    } catch (err) {
      console.error("Submission error:", err);
    }
  }

  // delete
  // removes a plant after ownership verification on the server.
  async function handleDelete(id) {
    try {
      const res = await fetch(`http://localhost:5000/api/plants/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });

      if (res.ok) {
        setPlants(plants.filter((p) => p._id !== id));
      } else {
        alert(
          "Delete failed. You might not have permission to remove this item.",
        );
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  // helper function to clean image URLs.
  // extracts direct image links from Google Search redirects found in the CSV.
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
    <div className="page-container">
      <header className="main-header" style={styles.header}>
        <div>
          <h1>Plant Collection Dashboard</h1>
          {user && (
            <h3 style={styles.welcomeText}>Welcome back, {user.username}!</h3>
          )}
        </div>
        <button
          onClick={logout}
          className="delete-btn"
          style={styles.logoutBtn}
        >
          Logout
        </button>
      </header>

      <div className="content-wrapper">
        <div className="left-panel">
          <div className="card">
            <h3>Add New Plant</h3>
            <form onSubmit={handleSubmit} className="plant-form">
              <label>Common Name</label>
              <input
                name="common_name"
                value={formData.common_name}
                onChange={handleChange}
                placeholder="e.g. Janet Craig"
                required
              />

              <label>Family</label>
              <input
                name="family"
                value={formData.family}
                onChange={handleChange}
                placeholder="e.g. Liliaceae"
              />

              <label>Category</label>
              <input
                name="categories"
                value={formData.categories}
                onChange={handleChange}
                placeholder="e.g. Dracaena"
              />

              <label>Origin</label>
              <input
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                placeholder="e.g. Cultivar"
              />

              <label>Climate</label>
              <input
                name="climate"
                value={formData.climate}
                onChange={handleChange}
                placeholder="e.g. Tropical"
              />

              <label>Image URL</label>
              <input
                name="img_url"
                value={formData.img_url}
                onChange={handleChange}
                placeholder="http://..."
              />

              <button type="submit">Add to Garden</button>
            </form>
          </div>
        </div>

        <div className="right-panel">
          <h2 style={styles.gardenTitle}>My Garden ({plants.length} Plants)</h2>

          <div className="plant-grid">
            {plants.map((plant) => (
              <div key={plant._id} className="plant-card">
                <div className="image-container">
                  {plant.img_url ? (
                    <img
                      src={getCleanImageUrl(plant.img_url)}
                      alt={plant.common_name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/260x180?text=Image+Not+Found";
                      }}
                    />
                  ) : (
                    <div
                      className="placeholder"
                      style={styles.imagePlaceholder}
                    >
                      No Image Provided
                    </div>
                  )}
                </div>
                <div className="card-details">
                  <h3>{plant.common_name || "Unnamed Plant"}</h3>
                  <p>
                    <strong>Family:</strong> {plant.family || "N/A"}
                  </p>
                  <p>
                    <strong>Category:</strong> {plant.categories || "N/A"}
                  </p>
                  <p>
                    <small>Origin: {plant.origin || "N/A"}</small>
                  </p>
                  <p>
                    <small>Climate: {plant.climate || "N/A"}</small>
                  </p>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(plant._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {plants.length === 0 && (
              <div style={styles.emptyMessage}>
                <p>
                  Your garden is currently empty. Add your first plant using the
                  form on the left!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: {
    color: "#2e7d32",
    marginTop: "5px",
  },
  logoutBtn: {
    width: "auto",
    padding: "10px 25px",
    background: "#c62828",
    color: "white",
  },
  gardenTitle: {
    color: "#2e7d32",
    borderBottom: "2px solid #a5d6a7",
    paddingBottom: "10px",
    marginBottom: "20px",
  },
  imagePlaceholder: {
    color: "#999",
  },
  emptyMessage: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "40px",
    color: "#666",
  },
};

export default Dashboard;
