const mongoose = require('mongoose');
const characterSchema = require('./characterModel').schema;
const gameSchema = mongoose.Schema(
  {
    _id: Number,
    playerst1: {
      type: [String],
    },
    playerst2: {
      type: [String],
    },
    division: {
      type: String,
      default: "Advanced",
    },
    bans: {
      type: [characterSchema],
      default: [],
    },
    bosses: {
      type: [String],
      default: ["Aeonblight Drake"],
    },
    result: {
      type: String,
      default: "Waiting", // can be "Waiting, Setup", "Progress", and "Finish", or a winning team (1 or 2, in format of a string)
    },
    team1: {
      type: String,
      default: "Team 1",
    },
    team2: {
      type: String,
      default: "Team 2",
    },
    timest1: {
      type: [Number],
      default: [0, 0, 0, 0, 0, 0, 0],
    },
    timest2: {
      type: [Number],
      default: [0, 0, 0, 0, 0, 0, 0],
    },
    pickst1: {
      type: [characterSchema],
      default: [],
    },
    pickst2: {
      type: [characterSchema],
      default: [],
    }
  },
  {
    timestamps: true,
  }
);

const game = mongoose.model("Game", gameSchema)
module.exports = game;