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

// subschema for sessions array and currentSession
const singleSessionSchema = new Schema({
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

// schema for sessions
const sessionsSchema = new Schema({
  sessions: [singleSessionSchema],
});

const Sessions = model("Sessions", sessionsSchema);

export default Sessions;

// const sampleSessions = [
//   {
//     name: "Session 1",
//     drivers: [
//       {
//         car: 1,
//         name: "Driver 1",
//         laps: [],
//         bestLap: null,
//       },
//       {
//         car: 2,
//         name: "Driver 2",
//         laps: [],
//         bestLap: null,
//       },
//     ],
//     isConfirmed: true,
//     isActive: false,
//     isFinished: false,
//     raceMode: "danger",
//     startTime: null,
//     leaderBoard: [],
//   },
//   {
//     name: "Session 2",
//     drivers: [
//       {
//         car: 1,
//         name: "Driver 5",
//         laps: [],
//         bestLap: null,
//       },
//       {
//         car: 2,
//         name: "Driver 6",
//         laps: [],
//         bestLap: null,
//       },
//     ],
//     isConfirmed: true,
//     isActive: false,
//     isFinished: false,
//     raceMode: "danger",
//     startTime: null,
//     leaderBoard: [],
//   },
// ];
