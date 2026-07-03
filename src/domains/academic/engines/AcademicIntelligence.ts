import { AttendancePredictor } from "./AttendancePredictor";

export interface SkipScenarioOutput {
  isSafe: boolean;
  newPercentage: number;
  advice: string;
}

export interface StudyPriorityOutput {
  subjectName: string;
  priorityScore: number; // 0 to 100
  reason: string;
}

export const AcademicIntelligence = {
  /**
   * Simulates the mathematical impact of skipping the next lecture session.
   * Answers: "What happens if I skip tomorrow?"
   */
  evaluateSkipScenario(
    presentCount: number,
    totalCount: number,
    targetThreshold = 75.0
  ): SkipScenarioOutput {
    // Simulate skipping: total increases by 1, present remains constant
    const simulatedTotal = totalCount + 1;
    const prediction = AttendancePredictor.predictAttendanceRisk(
      presentCount,
      simulatedTotal,
      targetThreshold
    );

    const isSafe = prediction.riskScore !== "HIGH";
    let advice = "";

    if (isSafe) {
      advice = `Skipping the next class is safe. Your attendance will sit at ${prediction.currentPercentage}%, which is still above your ${targetThreshold}% threshold.`;
    } else {
      advice = `Warning! Skipping the next class will drop your attendance to ${prediction.currentPercentage}%, violating your minimum ${targetThreshold}% threshold.`;
    }

    return {
      isSafe,
      newPercentage: prediction.currentPercentage,
      advice,
    };
  },

  /**
   * Ranks subjects for tonight's study session by combining attendance risk and mastery levels.
   */
  recommendStudyPriority(
    courses: Array<{
      subjectName: string;
      currentAttendance: number;
      conceptMasteryAverage: number; // 0 to 100
    }>
  ): StudyPriorityOutput[] {
    const recommendations: StudyPriorityOutput[] = [];

    for (const course of courses) {
      // Priority weights: low attendance (higher risk) and low mastery (greater need for study)
      const attendanceRiskWeight = Math.max(0, 100 - course.currentAttendance);
      const masteryDeficitWeight = 100 - course.conceptMasteryAverage;

      // Compound score (higher means higher study priority)
      const priorityScore = Math.round(0.4 * attendanceRiskWeight + 0.6 * masteryDeficitWeight);

      let reason = "";
      if (course.currentAttendance < 75.0) {
        reason = `High Priority: Attendance is critical at ${course.currentAttendance}%. Study to protect coursework eligibility.`;
      } else if (course.conceptMasteryAverage < 50.0) {
        reason = `Medium Priority: Mastery average is low (${course.conceptMasteryAverage}%). Study to consolidate concept gaps.`;
      } else {
        reason = `Low Priority: Stable parameters. Standard revision is recommended.`;
      }

      recommendations.push({
        subjectName: course.subjectName,
        priorityScore,
        reason,
      });
    }

    // Sort by priority score descending
    return recommendations.sort((a, b) => b.priorityScore - a.priorityScore);
  },
};
