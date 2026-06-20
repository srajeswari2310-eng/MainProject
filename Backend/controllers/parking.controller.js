const parkingModle = require("../models/parking.model");

// Create a new parking location
exports.createParking = async (req, res) => {
  try {
    const parking = new parkingModle(req.body);
    await parking.save();
    res.status(201).json(parking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all parking locations
exports.getParkings = async (req, res) => {
  try {
    const parkings = await parkingModle.find();
    res.json(parkings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single parking location by ID
exports.getParkingById = async (req, res) => {
  try {
    const parking = await parkingModle.findById(req.params.id);
    if (!parking) return res.status(404).json({ error: "Parking not found" });
    res.json(parking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update parking location
exports.updateParking = async (req, res) => {
  try {
    const parking = await parkingModle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!parking) return res.status(404).json({ error: "Parking not found" });
    res.json(parking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete parking location
exports.deleteParking = async (req, res) => {
  try {
    const parking = await parkingModle.findByIdAndDelete(req.params.id);
    if (!parking) return res.status(404).json({ error: "Parking not found" });
    res.json({ message: "Parking deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a floor to a parking location
exports.addFloor = async (req, res) => {
  try {
    const { name } = req.body;
    const parking = await parkingModle.findById(req.params.id);
    if (!parking) return res.status(404).json({ error: "Parking not found" });

    parking.floors.push({ name, slots: [] });
    await parking.save();
    res.json(parking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Add a slot to a floor
exports.addSlot = async (req, res) => {
  try {
    const { floorId } = req.params;
    const { slotName } = req.body;

    const parking = await parkingModle.findById(req.params.id);
    if (!parking) return res.status(404).json({ error: "Parking not found" });

    const floor = parking.floors.id(floorId);
    if (!floor) return res.status(404).json({ error: "Floor not found" });

    floor.slots.push({ slotName });
    await parking.save();
    res.json(parking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update slot occupancy/reservation
exports.updateSlot = async (req, res) => {
  try {
    const { floorId, slotId } = req.params;
    const updates = req.body;

    const parking = await parkingModle.findById(req.params.id);
    if (!parking) return res.status(404).json({ error: "Parking not found" });

    const floor = parking.floors.id(floorId);
    if (!floor) return res.status(404).json({ error: "Floor not found" });

    const slot = floor.slots.id(slotId);
    if (!slot) return res.status(404).json({ error: "Slot not found" });

    Object.assign(slot, updates);
    await parking.save();
    res.json(parking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
