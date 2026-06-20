const mongoose = require("mongoose");

// ✅ Pricing Plan Schema
const pricingPlanSchema = new mongoose.Schema({
  ratePerHour: { type: Number },       // for shortTerm
  gracePeriodMinutes: { type: Number },
  ratePerDay: { type: Number },        // for longTerm
  ratePerWeek: { type: Number },
  ratePerMonth: { type: Number },      // for monthly
  discountPercent: { type: Number },
  benefits: [{ type: String }]
});

// ✅ Pricing Schema with Location Reference
const pricingSchema = new mongoose.Schema(
  {
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parking", // references your Parking schema
      required: true,
    },
    pricing: {
      shortTerm: pricingPlanSchema,
      longTerm: pricingPlanSchema,
      monthly: pricingPlanSchema,
    },
  },
  { timestamps: true }
);

const Pricing = mongoose.model("Pricing", pricingSchema);

module.exports = Pricing;
