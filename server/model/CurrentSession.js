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

// const sampleCurrentSession = {
//   name: "Test Session",
//   drivers: [
//     {
//       car: 1,
//       name: "Michael",
//       laps: [10.91, 1.24],
//       bestLap: 1.24,
//       lapStartTime: 1743399268782,
//     },
//   ],
//   isConfirmed: true,
//   isActive: true,
//   isFinished: false,
//   raceMode: "hazard",
//   startTime: 1743399256628,
//   leaderBoard: [
//     {
//       car: 1,
//       name: "1",
//       laps: [10.91, 1.24],
//       bestLap: 1.24,
//       lapStartTime: 1743399268782,
//     },
//   ],
//   lapStartTime: 1743399268782,
// };
