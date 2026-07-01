const Reservation = require("../models/reservation.model");
const User = require("../models/users.model");
const Parking = require("../models/parking.model");

// Reserve Slot Controller
exports.reserveSlot = async (req, res) => {
  try {
    const {
      userId,
      slotId,
      floorId,
      locationId,
      plan,
      startDate,
      endDate,
      startTime,
      endTime,
      userVehicleNo,
    } = req.body;

    // 1. Create Reservation
    const reservation = new Reservation({
        locationId,
        floorId,
      slotId,
      userId,
      userVehicleNo,
      plan,
      startDate,
      endDate,
      startTime,
      endTime,
    });
    await reservation.save();

    // 2. Push only reservationId into User
    await User.findByIdAndUpdate(
      userId,
      { $push: { reservedSlot: reservation._id } },
      { returnDocument: "after" }
    );

    // 3. Update Parking slot status
    const parking = await Parking.findById(locationId);
    if (!parking) {
      return res.status(404).json({ success: false, message: "Parking not found" });
    }

    const floor = parking.floors.id(floorId);
    if (!floor) {
      return res.status(404).json({ success: false, message: "Floor not found" });
    }

    const slot = floor.slots.id(slotId);
    if (!slot) {
      return res.status(404).json({ success: false, message: "Slot not found" });
    }

    slot.reserved = true;
    slot.reservedDetail.push(reservation._id); // keep reference
    await parking.save();

    return res.status(201).json({
      success: true,
      message: "Slot reserved successfully",
      reservation,
    });
  } catch (err) {
    console.error("Reservation Error:", err.message);
    res.status(500).json({ success: false, message: "Server error during reservation" });
  }
};

// Remove Reservation Controller
exports.removeReservation = async (req, res) => {
  try {
    const { userId, reservationId } = req.body;

    // 1. Find the reservation
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ success: false, message: "Reservation not found" });
    }

    const { locationId, floorId, slotId } = reservation;

    // 2. Remove reservation from User
    await User.findByIdAndUpdate(
      userId,
      { $pull: { reservedSlot: reservationId } },
      { returnDocument: "after" }
    );

    // 3. Update Parking slot status
    const parking = await Parking.findById(locationId);
    if (parking) {
      const floor = parking.floors.id(floorId);
      if (floor) {
        const slot = floor.slots.id(slotId);
        if (slot) {
          slot.reserved = false;
          slot.reservedDetail = slot.reservedDetail.filter(
            (id) => id.toString() !== reservationId.toString()
          );
        }
      }
      await parking.save();
    }

   // 4. Delete reservation document
    const deletedReservation = await Reservation.findByIdAndDelete(reservationId);

    // 5. Return updated user and deleted reservation details
    const updatedUser = await User.findById(userId)
      .populate({
        path: "reservedSlot",
        model: "Reservation",
      });

    return res.status(200).json({
      success: true,
      message: "Reservation removed successfully",
      user: updatedUser,
      reservation: deletedReservation,
    });
    
  } catch (err) {
    console.error("Remove Reservation Error:", err.message);
    res.status(500).json({ success: false, message: "Server error during reservation removal" });
  }
};


