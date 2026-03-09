const express = require("express");
const router = express.Router();
const Tournament = require("../models/Tournament");
const verifyToken = require("../middleware/authMiddleware");

// GET all tournaments (public)
router.get("/", async (req, res) => {
  try {
    const tournaments = await Tournament.find();
    res.json(tournaments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET only the logged-in user's tournaments
router.get("/my-tournaments", verifyToken, async (req, res) => {
  try {
    const tournaments = await Tournament.find({ owner: req.userId });
    res.json(tournaments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new tournament
router.post("/", verifyToken, async (req, res) => {
  try {
    const tournament = new Tournament({
      owner: req.userId,
      name: req.body.name,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      starting_balance: req.body.starting_balance,
      description: req.body.description,
    });
    await tournament.save();
    res.status(201).json(tournament);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a tournament (owner only)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament)
      return res.status(404).json({ message: "Tournament not found" });

    if (tournament.owner.toString() !== req.userId)
      return res.status(403).json({ message: "Forbidden: You do not own this tournament." });

    await Tournament.findByIdAndDelete(req.params.id);
    res.json({ message: "Tournament deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;