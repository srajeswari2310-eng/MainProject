const express = require("express");
const router = express.Router();
const parkingController = require("../controllers/parking.controller");
const reservationController = require('../controllers/reservation.controller');

const verifyToken = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.Middleware");


// Parking CRUD
router.post("/",
     verifyToken,
     authorizeRoles("admin"),
     parkingController.createParking);
router.get("/",
     verifyToken,
     authorizeRoles("admin","user"),
     parkingController.getParkings);

router.get("/:id",
     verifyToken,
     authorizeRoles("admin", "user"),
     parkingController.getParkingById);
router.put("/:id",
     verifyToken,
     authorizeRoles("admin"),
     parkingController.updateParking);

router.delete("/:id",
     verifyToken,
     authorizeRoles("admin"),
     parkingController.deleteParking);

// Floors
router.post("/:id/floors",
     verifyToken,
     authorizeRoles("admin"),
     parkingController.addFloor);

router.put("/:parkingId/floors/:floorId/availability",
      verifyToken,
     authorizeRoles("admin"),
      parkingController.toggleFloorAvailability);

// Slots
router.post("/:id/floors/:floorId/slots",
     verifyToken,
     authorizeRoles("admin"),
     parkingController.addSlot);
// 10 Slots
router.post("/:id/floors/:floorId/10slots",
     verifyToken,
     authorizeRoles("admin"),
     parkingController.add10Slot);

router.put("/:id/floors/:floorId/slots/:slotId",
     verifyToken,
     authorizeRoles("admin", "user"),
     parkingController.updateSlot);


     // GET route: parking details + reservations for a date
router.get("/parking/reservations", 
     verifyToken,
     authorizeRoles("admin", "user"),
     parkingController.getParkingWithReservations);
router.post("/reserve",
     verifyToken,
     authorizeRoles("admin", "user"),
     reservationController.reserveSlot);

router.delete("/parking/reserve",
     verifyToken,
     authorizeRoles("admin", "user"),
     reservationController.removeReservation);

module.exports = router;

