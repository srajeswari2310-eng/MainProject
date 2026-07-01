const mongoose = require("mongoose");

// Reservation Schema
const reservationSchema = new mongoose.Schema({
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: "Parking", required: true },
  floorId: { type: mongoose.Schema.Types.ObjectId, required: true }, // reference to floor._id
  slotId: { type: mongoose.Schema.Types.ObjectId, required: true }, // reference to slot._id
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userVehicleNo: { type: String, required: true },
  plan: { type: String, enum: ["shortTerm", "longTerm", "monthly"], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
}, { timestamps: true });

const Reservation = mongoose.model("Reservation", reservationSchema);
module.exports = Reservation;
