export interface MistakeDiagnosis {
  reason: "CONCEPTUAL" | "CALCULATION" | "CARELESS" | "SYNTAX";
  notesRecommendation: string | null;
  cardsRecommendation: string | null;
}

export const MistakeEngine = {
  /**
   * Diagnoses incorrect response answers to map revision recommendations.
   */
  diagnoseMistake(
    questionText: string,
    wrongAnswer: string,
    correctAnswer: string
  ): MistakeDiagnosis {
    const qLower = questionText.toLowerCase();
    const wLower = wrongAnswer.toLowerCase();

    let reason: MistakeDiagnosis["reason"] = "CONCEPTUAL";

    // 1. Diagnose mistake reason using keyword markers
    if (qLower.includes("calculate") || qLower.includes("evaluate") || qLower.includes("compute")) {
      // Numerical calculations
      if (wrongAnswer.match(/^\d+(\.\d+)?$/) && correctAnswer.match(/^\d+(\.\d+)?$/)) {
        reason = "CALCULATION";
      }
    } else if (qLower.includes("syntax") || qLower.includes("code") || qLower.includes("compile") || wLower.includes("syntaxerror")) {
      reason = "SYNTAX";
    } else if (wrongAnswer.trim().length === 0) {
      reason = "CARELESS"; // Skip/empty inputs
    }

    // 2. Recommend study resources based on concept text matching
    let notesRecommendation: string | null = null;
    let cardsRecommendation: string | null = null;

    if (qLower.includes("dijkstra") || qLower.includes("routing") || qLower.includes("network")) {
      notesRecommendation = "note-cn-m3";
      cardsRecommendation = "deck-cn";
    } else if (qLower.includes("relational") || qLower.includes("database") || qLower.includes("normal")) {
      notesRecommendation = "note-dbms-m1";
      cardsRecommendation = "deck-dbms";
    }

    return {
      reason,
      notesRecommendation,
      cardsRecommendation,
    };
  },
};
