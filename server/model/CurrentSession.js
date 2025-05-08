import mongoose, { Schema, model } from "mongoose";

// subschema for drivers and leaderboard array
const driverSchema = new Schema(
  {
    car: Number,
    name: String,
    laps: [Number],
    bestLap: Number,
    lapStartTime: Number,
  },
  { _id: false }
);

// schema for currentSession
const currentSessionSchema = new Schema({
  name: String,
  drivers: [driverSchema],
  isConfirmed: Boolean,
  isActive: Boolean,
  isFinished: Boolean,
  raceMode: String,
  startTime: Number,
  leaderBoard: [driverSchema],
  lapStartTime: Number,
});

const CurrentSession = model("CurrentSession", currentSessionSchema);

export default CurrentSession;


