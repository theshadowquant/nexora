export const EmbeddingService = {
  /**
   * Generates a 1536-dimensional vector embedding for a given text segment.
   */
  async generateEmbedding(text: string): Promise<number[]> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // In development mode, if API key is not present, we fallback to a deterministic mock vector
      console.warn("OPENAI_API_KEY is not defined. Falling back to mock vector generation.");
      return this.generateMockVector(text);
    }

    try {
      const response = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "text-embedding-3-small",
          input: text,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI Embeddings API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      return result.data[0].embedding;
    } catch (error) {
      console.error("Failed to generate embedding from OpenAI:", error);
      throw error;
    }
  },

  /**
   * Generates a deterministic mock vector of size 1536 for development testing.
   */
  generateMockVector(text: string): number[] {
    const vector: number[] = [];
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    for (let i = 0; i < 1536; i++) {
      // Create value between -1.0 and 1.0 based on index and hash
      const val = Math.sin(hash + i) * 0.5;
      vector.push(parseFloat(val.toFixed(6)));
    }
    return vector;
  },
};
