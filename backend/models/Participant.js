const mongoose = require("mongoose");

const ParticipantSchema = new mongoose.Schema(
  {
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cash_balance: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// prevent a user from joining the same tournament twice
ParticipantSchema.index({ tournament: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Participant", ParticipantSchema);