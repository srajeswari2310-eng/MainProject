const express = require("express");
const router = express.Router();
const pricingController = require("../controllers/pricingController");

// Pricing CRUD
router.post("/", pricingController.createPricing);
router.get("/", pricingController.getPricings);
router.get("/location/:locationId", pricingController.getPricingByLocation);
router.put("/:id", pricingController.updatePricing);
router.delete("/:id", pricingController.deletePricing);

// Update specific plan
router.put("/:id/plan/:planType", pricingController.updatePlan);

module.exports = router;