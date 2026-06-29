const mongoose = require("mongoose");

// ✅ Slot Schema
const slotSchema = new mongoose.Schema({
  slotName: { 
    type: String, 
    required: true,    
  },
  occupied: { type: Boolean, default: false },
  user: { type: String, default: null },
  userVehicleNo: { type: String, default: null },
  reserved: { type: Boolean, default: false },
  reservedDetail: [
    {
      plan: { type: String, enum: ["shortTerm", "longTerm", "monthly"], default: null },
      startDate: { type: String, default: "" },
      endDate: { type: String, default: "" },
      startTime: { type: String, default: "" },
      endTime: { type: String, default: "" },
      user: { type: String, default: null },
      userVehicleNo: { type: String, default: null },
    },
  ],
  occupiedDt: { type: Date, default: null },
  available: { type: Boolean, default: true },
});

// ✅ Floor Schema
const floorSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,    
  },
  slots: [slotSchema],
  available: { type: Boolean, default: true },
});

// ✅ Parking Location Schema
const parkingSchema = new mongoose.Schema(
  {
    location: { type: String, required: true },
    coordinates: {
      type: [Number], // [latitude, longitude]
      required: true,
    },
    floors: [floorSchema],
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Parking = mongoose.model("Parking", parkingSchema);

module.exports = Parking;
