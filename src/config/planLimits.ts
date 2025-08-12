// Enhanced Secure Plan Configuration - Fixed Version
export type SubscriptionPlan = "Free" | "Basic" | "Pro";
export type UsageType =
  | "resume_tailors_used"
  | "cover_letters_used"
  | "job_searches_used"
  | "one_click_tailors_used"
  | "ats_checks_used";

// Internal configuration (never exposed to client directly)
const INTERNAL_PLAN_CONFIG = {
  Free: {
    resume_tailors_used: 5,
    cover_letters_used: 3,
    job_searches_used: 10,
    one_click_tailors_used: 2,
    ats_checks_used: 3,
    price: 0,
    features: [
      "Basic resume tailoring",
      "Limited cover letters",
      "Basic job search",
    ],
    displayName: "Free Tier",
    popular: false,
  },
  Basic: {
    resume_tailors_used: 50,
    cover_letters_used: 25,
    job_searches_used: 100,
    one_click_tailors_used: 20,
    ats_checks_used: 40,
    price: 199,
    features: [
      "Enhanced resume tailoring",
      "Professional cover letters",
      "Advanced job search",
      "Email support",
    ],
    displayName: "Basic Plan",
    popular: true,
  },
  Pro: {
    resume_tailors_used: -1, // Unlimited
    cover_letters_used: -1,
    job_searches_used: -1,
    one_click_tailors_used: -1,
    ats_checks_used: -1,
    price: 499,
    features: [
      "Unlimited everything",
      "Priority support",
      "API access",
      "Custom integrations",
      "Analytics dashboard",
    ],
    displayName: "Pro Plan",
    popular: false,
  },
} as const;

// Using built-in crypto instead of crypto-js
const generateConfigHash = (config: typeof INTERNAL_PLAN_CONFIG): string => {
  const configString = JSON.stringify(config);

  // Use built-in crypto for hashing (available in both Node.js and modern browsers)
  if (typeof window === "undefined") {
    // Server-side (Node.js)
    const crypto = require("crypto");
    return crypto.createHash("sha256").update(configString).digest("hex");
  } else {
    // Client-side (Browser) - simple hash for verification
    let hash = 0;
    for (let i = 0; i < configString.length; i++) {
      const char = configString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }
};

// Security: Server-side encryption using built-in crypto (Node.js only)
const encryptPlanConfig = (config: typeof INTERNAL_PLAN_CONFIG): string => {
  if (typeof window !== "undefined") {
    // Client-side: return placeholder hash instead of encryption
    return generateConfigHash(config);
  }

  // Server-side: Use Node.js built-in crypto
  try {
    const crypto = require("crypto");
    const key =
      process.env.PLAN_CONFIG_SECRET || "default-dev-key-change-in-production";
    const algorithm = "aes-256-cbc";

    // Create a key from the secret (ensure it's 32 bytes for AES-256)
    const keyBuffer = crypto.createHash("sha256").update(key).digest();
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);
    let encrypted = cipher.update(JSON.stringify(config), "utf8", "hex");
    encrypted += cipher.final("hex");

    // Combine IV and encrypted data
    return iv.toString("hex") + ":" + encrypted;
  } catch (error) {
    console.error("Encryption failed, using hash fallback:", error);
    return generateConfigHash(config);
  }
};

// Security: Decrypt plan configuration (server-side only)
const decryptPlanConfig = (
  encryptedConfig: string
): typeof INTERNAL_PLAN_CONFIG => {
  if (typeof window !== "undefined") {
    throw new Error("Decryption not available on client-side");
  }

  try {
    const crypto = require("crypto");
    const key =
      process.env.PLAN_CONFIG_SECRET || "default-dev-key-change-in-production";
    const algorithm = "aes-256-cbc";

    // Extract IV and encrypted data
    const [ivHex, encryptedData] = encryptedConfig.split(":");
    if (!ivHex || !encryptedData) {
      throw new Error("Invalid encrypted config format");
    }
    const iv = Buffer.from(ivHex, "hex");

    // Create key from secret
    const keyBuffer = crypto.createHash("sha256").update(key).digest();

    const decipher = crypto.createDecipheriv(algorithm, keyBuffer, iv);
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Failed to decrypt plan configuration:", error);
    throw new Error("Invalid plan configuration");
  }
};

// Public interface for plan information (safe for client-side)
export interface PlanInfo {
  displayName: string;
  price: number;
  features: readonly string[]; // Use readonly string[] for features
  popular: boolean;
  isUnlimited: (usageType: UsageType) => boolean;
}

// **FIXED**: A mapped type must be a 'type' alias, not an 'interface'.
export type SecurePlanLimits = {
  [K in UsageType]: number;
};

// Security: Server-side only plan access
export const getServerSidePlanConfig = (): typeof INTERNAL_PLAN_CONFIG => {
  if (typeof window !== "undefined") {
    throw new Error("Plan configuration access denied on client-side");
  }
  return INTERNAL_PLAN_CONFIG;
};

// Security: Safe client-side plan information (no limits exposed)
export const getPlanInfo = (plan: SubscriptionPlan): PlanInfo => {
  const config = INTERNAL_PLAN_CONFIG[plan];

  return {
    displayName: config.displayName,
    price: config.price,
    features: config.features,
    popular: config.popular,
    isUnlimited: (usageType: UsageType) => config[usageType] === -1,
  };
};

// Security: Validate plan limits server-side only
export const validatePlanLimit = (
  plan: SubscriptionPlan,
  usageType: UsageType,
  currentUsage: number
): { isValid: boolean; limit: number; exceeded: boolean } => {
  if (typeof window !== "undefined") {
    throw new Error("Plan validation must be done server-side");
  }

  const config = INTERNAL_PLAN_CONFIG[plan];
  const limit = config[usageType];

  return {
    isValid: true,
    limit,
    exceeded: limit !== -1 && currentUsage >= limit,
  };
};

// Client-safe plan validation (calls server)
export const validateUsageClientSide = async (
  plan: SubscriptionPlan,
  usageType: UsageType,
  currentUsage: number
): Promise<{ canUse: boolean; limit: number; remaining: number }> => {
  try {
    const response = await fetch("/api/validate-usage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, usageType, currentUsage }),
    });

    if (!response.ok) {
      throw new Error("Validation failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Usage validation error:", error);
    // Fail secure - deny usage if validation fails
    return { canUse: false, limit: 0, remaining: 0 };
  }
};

// ADDED: Client-side plan limit display (safe, no enforcement)
export const getDisplayLimits = (plan: SubscriptionPlan): SecurePlanLimits => {
  // These are for display purposes only - real enforcement happens server-side
  const config = INTERNAL_PLAN_CONFIG[plan];

  return {
    resume_tailors_used: config.resume_tailors_used,
    cover_letters_used: config.cover_letters_used,
    job_searches_used: config.job_searches_used,
    one_click_tailors_used: config.one_click_tailors_used,
    ats_checks_used: config.ats_checks_used,
  };
};

// ADDED: Plan comparison utility
export const comparePlans = (): Array<{
  plan: SubscriptionPlan;
  info: PlanInfo;
  limits: SecurePlanLimits;
}> => {
  return (["Free", "Basic", "Pro"] as SubscriptionPlan[]).map((plan) => ({
    plan,
    info: getPlanInfo(plan),
    limits: getDisplayLimits(plan),
  }));
};

// Utility: Get all plan names
export const getAllPlans = (): SubscriptionPlan[] => ["Free", "Basic", "Pro"];

// ADDED: Plan upgrade path
export const getUpgradePath = (
  currentPlan: SubscriptionPlan
): SubscriptionPlan[] => {
  const planHierarchy: SubscriptionPlan[] = ["Free", "Basic", "Pro"];
  const currentIndex = planHierarchy.indexOf(currentPlan);
  return planHierarchy.slice(currentIndex + 1);
};

// ADDED: Plan feature comparison
export const getPlanFeatureDiff = (
  fromPlan: SubscriptionPlan,
  toPlan: SubscriptionPlan
): {
  newFeatures: string[];
  limitIncreases: Array<{ type: UsageType; from: number; to: number }>;
} => {
  const fromConfig = INTERNAL_PLAN_CONFIG[fromPlan];
  const toConfig = INTERNAL_PLAN_CONFIG[toPlan];

  // **FIXED**: Cast `fromConfig.features` to `readonly string[]` to satisfy the `includes` method,
  // which expects a more general type than the specific literal types inferred by `as const`.
  const newFeatures = toConfig.features.filter(
    (feature) => !(fromConfig.features as readonly string[]).includes(feature)
  );

  const usageTypes: UsageType[] = [
    "resume_tailors_used",
    "cover_letters_used",
    "job_searches_used",
    "one_click_tailors_used",
    "ats_checks_used",
  ];

  const limitIncreases = usageTypes
    .filter(
      (type) => toConfig[type] === -1 || toConfig[type] > fromConfig[type]
    )
    .map((type) => ({
      type,
      from: fromConfig[type],
      to: toConfig[type],
    }));

  return { newFeatures, limitIncreases };
};

// Development helper (only available in dev)
if (typeof process !== "undefined" && process.env.NODE_ENV === "development") {
  (globalThis as any).__APPLYFORGE_PLAN_DEBUG__ = {
    viewLimits: () => INTERNAL_PLAN_CONFIG,
    testValidation: validatePlanLimit,
    generateHash: generateConfigHash,
    comparePlans: comparePlans,
  };

  console.log(
    "%c🔐 Plan Configuration Loaded",
    "color: #10B981; font-weight: bold;",
    "Hash:",
    generateConfigHash(INTERNAL_PLAN_CONFIG).slice(0, 8)
  );
}
