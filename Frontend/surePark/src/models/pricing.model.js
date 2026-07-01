const pricingDetails = {
  location: "Chennai Mall 1",
  pricing: {
    shortTerm: {
      ratePerHour: 50, // INR
      gracePeriodMinutes: 15,
      benefits: [
        "Flexible hourly billing",
        "Convenient access to mall and nearby attractions",
        "Best for visits under 6 hours"
      ]
    },
    longTerm: {
      ratePerDay: 400, // INR
      ratePerWeek: 2500, // INR
      benefits: [
        "Discounted daily and weekly packages",
        "Secure monitored facilities",
        "Ideal for business travelers or extended city stays"
      ]
    },
    monthly: {
      ratePerMonth: 6000, // INR
      discountPercent: 10,
      benefits: [
        "Guaranteed reserved slot",
        "Priority access during peak hours",
        "Free vehicle wash once a month",
        "Best value for daily commuters"
      ]
    }
  }
};

export default pricingDetails;