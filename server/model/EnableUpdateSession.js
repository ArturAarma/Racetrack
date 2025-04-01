import mongoose, { Schema, model } from "mongoose";

// schema for enableUpdateSession
const enableUpdateSchema = new Schema({
  enableUpdateSession: { type: Boolean, default: false },
});

const EnableUpdateSession = model("EnableUpdateSession", enableUpdateSchema);

export default EnableUpdateSession;
