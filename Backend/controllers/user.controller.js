const userModel = require('../models/users.model');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const user = new userModel(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a vehicle
exports.addVehicle = async (req, res) => {
  try {
    const { no } = req.body;
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Check if vehicle already exists
    const exists = user.vehicles.some(v => v.no === no);
    if (exists) return res.status(400).json({ error: "Vehicle already exists" });

    user.vehicles.push({ no });
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Edit a vehicle by vehicle _id (check duplicate)
exports.editVehicle = async (req, res) => {
  try {
    const { no } = req.body;
    const { vehicleId } = req.params;
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const vehicle = user.vehicles.id(vehicleId);
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });

    // Check if another vehicle already has this number
    const exists = user.vehicles.some(v => v.no === no && v._id.toString() !== vehicleId);
    if (exists) return res.status(400).json({ error: "Vehicle already exists" });

    vehicle.no = no;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a vehicle by vehicle _id
exports.deleteVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const vehicle = user.vehicles.id(vehicleId);
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });

    user.vehicles.pull({ _id: vehicleId });
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Add favorite slot
exports.addFavoriteSlot = async (req, res) => {
  try {
    const { locationId, floorId, slotId } = req.body;
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.favoriteSlot.push({ locationId, floorId, slotId });
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Remove favorite slot
exports.removeFavoriteSlot = async (req, res) => {
  try {
    const { slotId } = req.body;
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.favoriteSlot = user.favoriteSlot.filter(slot => slot.slotId !== slotId);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Add reserved slot
exports.addReservedSlot = async (req, res) => {
  try {
    const { locationId, floorId, slotId, plan, startDate, endDate, startTime, endTime, userVehicleNo } = req.body;
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.reservedSlot.push({ locationId, floorId, slotId, plan, startDate, endDate, startTime, endTime, userVehicleNo });
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Remove reserved slot
exports.removeReservedSlot = async (req, res) => {
  try {
    const { slotId } = req.body;
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.reservedSlot = user.reservedSlot.filter(slot => slot.slotId !== slotId);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
