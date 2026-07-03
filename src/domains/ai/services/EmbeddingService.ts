export const EmbeddingService = {
  /**
   * Generates a 768-dimensional vector embedding using Google Gemini text-embedding-004.
   * Falls back to a deterministic mock vector if GEMINI_API_KEY is not set.
   */
  async generateEmbedding(text: string): Promise<number[]> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // In development mode, if API key is not present, fall back to a deterministic mock vector
      console.warn("GEMINI_API_KEY is not defined. Falling back to mock vector generation.");
      return this.generateMockVector(text);
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "models/text-embedding-004",
            content: { parts: [{ text }] },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini Embeddings API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      return result.embedding.values as number[];
    } catch (error) {
      console.error("Failed to generate embedding from Gemini:", error);
      throw error;
    }
  },

  /**
   * Generates a deterministic mock vector of size 768 for development / CI testing.
   * Gemini text-embedding-004 outputs 768 dimensions.
   */
  generateMockVector(text: string): number[] {
    const vector: number[] = [];
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    for (let i = 0; i < 768; i++) {
      const val = Math.sin(hash + i) * 0.5;
      vector.push(parseFloat(val.toFixed(6)));
    }
    return vector;
  },
};
