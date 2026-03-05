const express = require("express");
const router = express.Router();
const Plant = require("../models/Plant"); // omport plants model
const verifyToken = require("../middleware/authMiddleware"); // import JWT protector

// public view
// returns every plant from every user.
router.get("/", async (req, res) => {
  try {
    const plants = await Plant.find(); // No filter, returns all
    res.json(plants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// create
// adds a new plant and automatically assigns the 'owner' field
// using the ID extracted from the JWT token.
router.post("/", verifyToken, async (req, res) => {
  try {
    // explicitly mapping incoming request body to the schema
    const plant = new Plant({
      common_name: req.body.common_name,
      family: req.body.family,
      categories: req.body.categories,
      origin: req.body.origin,
      climate: req.body.climate,
      zone: req.body.zone,
      img_url: req.body.img_url,
      // the 'owner' must always come from the trusted decoded JWT, never the body
      owner: req.userId,
    });

    await plant.save();
    res.status(201).json(plant);
  } catch (err) {
    res.status(400).json({ message: "Error saving plant", error: err.message });
  }
});

// read (personalized)
// fetch only the plants belonging to the currently logged-in user
// this powers the "My Garden" view in your Dashboard
router.get("/my-plants", verifyToken, async (req, res) => {
  try {
    // we filter the database search by the owner ID extracted from the JWT
    const plants = await Plant.find({ owner: req.userId });
    res.json(plants);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// delete
// removes a plant, but only after verifying that the requester
//  is the actual owner of the document
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);

    // check if plant exists
    if (!plant) {
      return res.status(404).json({ message: "Plant not found" });
    }

    // authorization check: compare document owner ID to requester's ID
    if (plant.owner.toString() !== req.userId) {
      return res.status(403).json({
        message: "Forbidden: You do not have permission to delete this plant.",
      });
    }

    await Plant.findByIdAndDelete(req.params.id);
    res.json({ message: "Plant successfully deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
