export interface AttendancePredictionOutput {
  currentPercentage: number;
  riskScore: "HIGH" | "MEDIUM" | "LOW";
  skipsBuffer: number;         // Classes they can skip before hitting 75%
  consecutiveRequired: number; // Classes they must attend to hit 75%
}

export const AttendancePredictor = {
  /**
   * Forecasts attendance risk metrics and computes skips buffers.
   */
  predictAttendanceRisk(
    presentCount: number,
    totalCount: number,
    targetThreshold = 75.0
  ): AttendancePredictionOutput {
    if (totalCount === 0) {
      return {
        currentPercentage: 100.0,
        riskScore: "LOW",
        skipsBuffer: 0,
        consecutiveRequired: 0,
      };
    }

    const currentPercentage = parseFloat(((presentCount / totalCount) * 100).toFixed(1));
    const targetFraction = targetThreshold / 100;

    let skipsBuffer = 0;
    let consecutiveRequired = 0;

    if (currentPercentage >= targetThreshold) {
      // Skips calculation: y = floor((Present - target * Total) / target)
      skipsBuffer = Math.max(
        0,
        Math.floor((presentCount - targetFraction * totalCount) / targetFraction)
      );
    } else {
      // Consecutive required: x = ceil((target * Total - Present) / (1 - target))
      consecutiveRequired = Math.max(
        0,
        Math.ceil((targetFraction * totalCount - presentCount) / (1 - targetFraction))
      );
    }

    // Determine risk status
    let riskScore: AttendancePredictionOutput["riskScore"] = "LOW";
    if (currentPercentage < targetThreshold) {
      riskScore = "HIGH";
    } else if (skipsBuffer <= 2) {
      riskScore = "MEDIUM";
    }

    return {
      currentPercentage,
      riskScore,
      skipsBuffer,
      consecutiveRequired,
    };
  },
};
