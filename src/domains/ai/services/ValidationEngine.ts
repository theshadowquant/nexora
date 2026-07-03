export const ValidationEngine = {
  /**
   * Assesses generated content confidence scores.
   * If confidence drops below 0.70, it signals a retrieval issue or hallucination check fail.
   */
  validateConfidence(confidence: number, threshold = 0.70): boolean {
    return confidence >= threshold;
  },

  /**
   * Grounding citation validator.
   * Validates if key concepts in the generated answer are grounded in the source chunk
   * by calculating keyword density matching (excluding standard grammatical stop words).
   */
  validateGroundedCitation(sourceChunkText: string, generatedText: string): {
    isGrounded: boolean;
    overlapScore: number;
    missingKeywords: string[];
  } {
    const stopWords = new Set([
      "the", "is", "at", "which", "on", "and", "a", "an", "to", "in", "of",
      "for", "with", "that", "this", "these", "those", "it", "its", "by", "from",
      "are", "was", "were", "be", "been", "have", "has", "had", "do", "does"
    ]);

    // Tokenize, lowercase, and filter keywords
    const getKeywords = (text: string) => {
      const words = text
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .split(/\s+/);
      return Array.from(new Set(words)).filter((word) => word.length > 3 && !stopWords.has(word));
    };

    const sourceKeywords = new Set(getKeywords(sourceChunkText));
    const generatedKeywords = getKeywords(generatedText);

    if (generatedKeywords.length === 0) {
      return { isGrounded: true, overlapScore: 1.0, missingKeywords: [] };
    }

    let matchedCount = 0;
    const missingKeywords: string[] = [];

    for (const word of generatedKeywords) {
      if (sourceKeywords.has(word)) {
        matchedCount++;
      } else {
        missingKeywords.push(word);
      }
    }

    const overlapScore = matchedCount / generatedKeywords.length;

    // Grounded threshold: at least 30% of key nouns/terms must overlap with source chunk
    const GROUNDED_THRESHOLD = 0.30;
    const isGrounded = overlapScore >= GROUNDED_THRESHOLD;

    return {
      isGrounded,
      overlapScore: parseFloat(overlapScore.toFixed(3)),
      missingKeywords,
    };
  },
};
