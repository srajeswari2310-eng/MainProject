const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

const verifyToken = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.Middleware");


// User CRUD
router.post("/",
    verifyToken,
    authorizeRoles("admin"),
     userController.createUser);          // Create user
router.get("/", 
      verifyToken,
    authorizeRoles("admin"),
    userController.getUsers);             // Get all users
router.get("/:id", 
    verifyToken,
    authorizeRoles("admin", "user"),
    userController.getUserById);      // Get single user
router.put("/:id", 
      verifyToken,
    authorizeRoles("admin", "user"),
    userController.updateUser);       // Update user
router.delete("/:id", 
    verifyToken,
    authorizeRoles("admin"),
    userController.deleteUser);    // Delete user

//Vechile 
router.post("/:id/vehicles", 
     verifyToken,
    authorizeRoles("admin", "user"),
    userController.addVehicle);
router.put("/:id/vehicles/:vehicleId", 
     verifyToken,
    authorizeRoles("admin", "user"),
    userController.editVehicle);
router.delete("/:id/vehicles/:vehicleId", 
     verifyToken,
    authorizeRoles("admin", "user"),
    userController.deleteVehicle);



// Favorite Slot
router.post("/:id/favorites", 
      verifyToken,
    authorizeRoles("admin", "user"),
    userController.addFavoriteSlot);     // Add favorite slot
router.delete("/:id/favorites",
      verifyToken,
    authorizeRoles("admin", "user"),
     userController.removeFavoriteSlot); // Remove favorite slot

// Reserved Slot
router.post("/:id/reserved", 
      verifyToken,
    authorizeRoles("admin", "user"),
    userController.addReservedSlot);       // Add reserved slot
router.delete("/:id/reserved", 
      verifyToken,
    authorizeRoles("admin", "user"),
    userController.removeReservedSlot);  // Remove reserved slot

module.exports = router;
