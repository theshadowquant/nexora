import { prisma } from "@/lib/prisma";

export interface UserContext {
  userId: string;
  role: string;
  college?: string;
  department?: string;
  semester?: number;
}

export interface FlagRules {
  roles?: string[];
  colleges?: string[];
  departments?: string[];
  semesters?: number[];
  userIds?: string[];
  percentage?: number; // Rollout percentage (0 to 100)
}

export const FeatureFlagService = {
  /**
   * Evaluates feature flags against fine-grained targeting segments.
   */
  async isEnabled(flagKey: string, context?: UserContext): Promise<boolean> {
    const flag = await prisma.featureFlag.findUnique({
      where: { key: flagKey },
    });

    if (!flag) {
      // Default to enabled if not registered to prevent development locks
      return true;
    }

    const status = flag.status.toUpperCase();

    if (status === "OFF") {
      return false;
    }

    if (status === "ON") {
      return true;
    }

    // For BETA or INTERNAL modes, if no context is provided, restrict feature
    if (!context) {
      return status === "BETA"; // BETA might be open to public if no rules constraint
    }

    // 1. Check basic role requirements
    if (status === "INTERNAL" && context.role !== "ADMIN") {
      return false;
    }

    // 2. Parse and evaluate custom JSON rules segment boundaries
    if (flag.rules) {
      try {
        const rules = (typeof flag.rules === "string" 
          ? JSON.parse(flag.rules) 
          : flag.rules) as FlagRules;

        // Specific user list check
        if (rules.userIds && rules.userIds.length > 0) {
          if (!rules.userIds.includes(context.userId)) {
            return false;
          }
        }

        // Roles checklist check
        if (rules.roles && rules.roles.length > 0) {
          if (!rules.roles.includes(context.role)) {
            return false;
          }
        }

        // College segment check
        if (rules.colleges && rules.colleges.length > 0) {
          if (!context.college || !rules.colleges.includes(context.college)) {
            return false;
          }
        }

        // Department segment check
        if (rules.departments && rules.departments.length > 0) {
          if (!context.department || !rules.departments.includes(context.department)) {
            return false;
          }
        }

        // Semesters segment check
        if (rules.semesters && rules.semesters.length > 0) {
          if (!context.semester || !rules.semesters.includes(context.semester)) {
            return false;
          }
        }

        // Deterministic rollout check
        if (rules.percentage !== undefined && rules.percentage >= 0 && rules.percentage < 100) {
          const userHash = this.hashUserId(context.userId, flagKey);
          if (userHash >= rules.percentage) {
            return false;
          }
        }
      } catch (err) {
        console.error(`Failed to parse targeting rules for flag ${flagKey}:`, err);
        // Fallback default status matching on error
        return status === "ON" || (status === "BETA" && context.role === "STUDENT");
      }
    }

    return true;
  },

  /**
   * Upserts the feature flag and custom JSON segment constraints.
   */
  async updateFlag(
    key: string,
    status: "ON" | "OFF" | "BETA" | "INTERNAL",
    rules?: FlagRules
  ) {
    const rulesValue = rules ? (rules as any) : null;
    return prisma.featureFlag.upsert({
      where: { key },
      update: { status, rules: rulesValue },
      create: { key, status, rules: rulesValue },
    });
  },

  /**
   * Helper to compute deterministic user hash rollouts (0-99).
   */
  hashUserId(userId: string, flagKey: string): number {
    let hash = 0;
    const str = userId + flagKey;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % 100;
  },
};
