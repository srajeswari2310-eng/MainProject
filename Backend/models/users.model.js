const mongoose = require("mongoose");

// Vehicle Schema
const vehicleSchema = new mongoose.Schema({
  no: { type: String, required: true }, // vehicle number
});

// Favorite Slot Schema
const favoriteSlotSchema = new mongoose.Schema({
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: "Parking", required: true },
  floorId: { type: Number, required: true },
  slotId: { type: Number, required: true },
});

// Reserved Slot Schema
const reservedSlotSchema = new mongoose.Schema({
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: "Parking", required: true },
  floorId: { type: Number, required: true },
  slotId: { type: Number, required: true },
  plan: { type: String, enum: ["shortTerm", "longTerm", "monthly"], default: null },
  startDate: { type: String, default: "" },
  endDate: { type: String, default: "" },
  startTime: { type: String, default: "" },
  endTime: { type: String, default: "" },
  userVehicleNo: { type: String, default: null },
});

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },   
    role: { type: String, enum: ["user", "admin"], default: "user" },
    vehicles: [vehicleSchema],
    favoriteSlot: [favoriteSlotSchema],
    reservedSlot: [reservedSlotSchema],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
