export const COPY = {
  credits: {
    noneRemaining: "You have no credits. Buy more or upgrade to Pro and save 60%.",
    uploadBlocked: "You have no credits available. Purchase more or upgrade to Pro.",
    perCredit: {
      regular: "$0.50 per credit",
      pro: "$0.20 per credit (60% savings)"
    },
    description: "Each credit allows one image upload (up to 10 trades). Credits never expire."
  },
  // NOTE: Plan details are now centralized in src/config/pricing.ts
  // This ensures consistency between landing page, select-plan, and upgrade pages
  upsells: {
    proDiscount: "Save 60% on credits with Pro — includes 30 monthly credits that never expire.",
    upgradeModal: {
      title: "Upgrade to Pro and Save 60% on Credits",
      benefits: [
        "Premium dashboard customization",
        "30 monthly credits (never expire)",
        "Premium widgets and analytics",
        "Enhanced XP system (faster progression)",
        "Priority support and early access"
      ]
    },
    proBanner: {
      title: "Save 60% with Pro",
      subtitle: "Pro users pay only $4 for 20 credits",
      bullets: [
        "Includes 30 monthly credits that never expire",
        "Premium dashboard customization",
        "Access to advanced widgets and analytics"
      ]
    }
  },
  errors: {
    noCredits: "You have no credits available. Purchase more or upgrade to Pro.",
    uploadTimeout: "Upload failed due to slow processing. Try a clearer screenshot or manual entry.",
    checkoutFailed: "Checkout failed. Please try again or contact support."
  }
};
