const mongoose = require("mongoose");

const TournamentSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    starting_balance: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["open", "active", "closed", "ended"],
      default: "open",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tournament", TournamentSchema);