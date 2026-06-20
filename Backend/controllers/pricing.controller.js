const Pricing = require("../models/Pricing");

// ✅ Create pricing for a location
exports.createPricing = async (req, res) => {
  try {
    const pricing = new Pricing(req.body);
    await pricing.save();
    res.status(201).json(pricing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get all pricing records
exports.getPricings = async (req, res) => {
  try {
    const pricings = await Pricing.find().populate("location");
    res.json(pricings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get pricing by location ID
exports.getPricingByLocation = async (req, res) => {
  try {
    const pricing = await Pricing.findOne({ location: req.params.locationId }).populate("location");
    if (!pricing) return res.status(404).json({ error: "Pricing not found for this location" });
    res.json(pricing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update pricing by ID
exports.updatePricing = async (req, res) => {
  try {
    const pricing = await Pricing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("location");
    if (!pricing) return res.status(404).json({ error: "Pricing not found" });
    res.json(pricing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Delete pricing by ID
exports.deletePricing = async (req, res) => {
  try {
    const pricing = await Pricing.findByIdAndDelete(req.params.id);
    if (!pricing) return res.status(404).json({ error: "Pricing not found" });
    res.json({ message: "Pricing deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update specific plan (shortTerm, longTerm, monthly)
exports.updatePlan = async (req, res) => {
  try {
    const { planType } = req.params; // shortTerm | longTerm | monthly
    const updates = req.body;

    const pricing = await Pricing.findById(req.params.id);
    if (!pricing) return res.status(404).json({ error: "Pricing not found" });

    if (!["shortTerm", "longTerm", "monthly"].includes(planType)) {
      return res.status(400).json({ error: "Invalid plan type" });
    }

    Object.assign(pricing.pricing[planType], updates);
    await pricing.save();

    res.json(pricing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
