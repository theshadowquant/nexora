export interface CourseGradeInput {
  grade: string;   // e.g. "S", "A", "B" or numeric marks
  credits: number;
}

export interface GradingStrategy {
  calculateSgpa(courses: CourseGradeInput[]): number;
  calculateCgpa(sgpas: number[]): number;
}

// 1. VTU Grading Strategy (10-Point Scale)
export const VtuGradingStrategy: GradingStrategy = {
  calculateSgpa(courses: CourseGradeInput[]): number {
    const gradePoints: Record<string, number> = {
      S: 10, O: 10,
      A: 9,
      B: 8,
      C: 7,
      D: 6,
      E: 4,
      F: 0,
    };

    let totalPoints = 0;
    let totalCredits = 0;

    for (const course of courses) {
      const g = course.grade.toUpperCase();
      const points = gradePoints[g] ?? 0;
      totalPoints += points * course.credits;
      totalCredits += course.credits;
    }

    if (totalCredits === 0) return 0.0;
    return parseFloat((totalPoints / totalCredits).toFixed(2));
  },

  calculateCgpa(sgpas: number[]): number {
    if (sgpas.length === 0) return 0.0;
    const sum = sgpas.reduce((acc, val) => acc + val, 0);
    return parseFloat((sum / sgpas.length).toFixed(2));
  },
};

// 2. NEP Grading Strategy (Alternative scale with different mappings)
export const NepGradingStrategy: GradingStrategy = {
  calculateSgpa(courses: CourseGradeInput[]): number {
    const gradePoints: Record<string, number> = {
      O: 10,
      "A+": 9,
      A: 8,
      "B+": 7,
      B: 6,
      C: 5,
      P: 4,
      F: 0,
    };

    let totalPoints = 0;
    let totalCredits = 0;

    for (const course of courses) {
      const g = course.grade.toUpperCase();
      const points = gradePoints[g] ?? 0;
      totalPoints += points * course.credits;
      totalCredits += course.credits;
    }

    if (totalCredits === 0) return 0.0;
    return parseFloat((totalPoints / totalCredits).toFixed(2));
  },

  calculateCgpa(sgpas: number[]): number {
    if (sgpas.length === 0) return 0.0;
    const sum = sgpas.reduce((acc, val) => acc + val, 0);
    return parseFloat((sum / sgpas.length).toFixed(2));
  },
};

// Strategy Resolver Factory
export const GradingEngine = {
  getStrategy(strategyName: "VTU" | "NEP" | "CBSE" | string): GradingStrategy {
    const name = strategyName.toUpperCase();
    if (name === "NEP") {
      return NepGradingStrategy;
    }
    // Default strategy: VTU 10-point scale
    return VtuGradingStrategy;
  },
};
