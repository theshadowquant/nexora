export interface TimeCheckOutput {
  hasExpired: boolean;
  remainingSeconds: number;
}

export interface FocusCheckOutput {
  triggerLockdownSubmit: boolean;
  warningsLeft: number;
}

export const ExamSimulator = {
  /**
   * Evaluates if the exam session duration has run out.
   */
  validateTimeRemaining(startedAt: Date, durationMinutes: number): TimeCheckOutput {
    const now = Date.now();
    const startTime = new Date(startedAt).getTime();
    const totalDurationMs = durationMinutes * 60 * 1000;
    const elapsedMs = now - startTime;
    const remainingMs = totalDurationMs - elapsedMs;

    if (remainingMs <= 0) {
      return { hasExpired: true, remainingSeconds: 0 };
    }

    return {
      hasExpired: false,
      remainingSeconds: Math.floor(remainingMs / 1000),
    };
  },

  /**
   * Tracks screen focus leaks (blur events) during lockdown examinations.
   * Auto-submits the exam if the student repeatedly leaves the page (exceeding threshold).
   */
  evaluateFocusWarnings(blurCount: number, threshold = 3): FocusCheckOutput {
    if (blurCount >= threshold) {
      return {
        triggerLockdownSubmit: true,
        warningsLeft: 0,
      };
    }

    return {
      triggerLockdownSubmit: false,
      warningsLeft: Math.max(0, threshold - blurCount),
    };
  },
};
