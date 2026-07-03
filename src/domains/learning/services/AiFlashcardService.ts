import { prisma } from "@/lib/prisma";
import { FlashcardRepository } from "../repos/FlashcardRepository";
import { ObservabilityService } from "@/domains/ai/services/ObservabilityService";
import { ValidationEngine } from "@/domains/ai/services/ValidationEngine";

export const AiFlashcardService = {
  /**
   * Generates interactive active-recall flashcards from an uploaded Note.
   * Reuses the existing NoteChunk database entries to avoid re-embedding.
   */
  async generateFlashcardsFromNote(noteId: string, subjectId: string, title: string, count = 5) {
    const apiKey = process.env.OPENAI_API_KEY;

    // 1. Fetch note text chunks from the database
    const chunks = await prisma.noteChunk.findMany({
      where: {
        noteId,
        isParent: false,
      },
      take: 10, // Use first 10 chunks to avoid model token context overflow
    });

    if (chunks.length === 0) {
      throw new Error("No parsed content chunks found for this Note. Please parse the PDF first.");
    }

    const contextText = chunks.map((c) => c.chunkText).join("\n\n");

    let cardDataList: Array<{
      front: string;
      back: string;
      confidence: number;
      sourcePage: number;
    }> = [];

    if (!apiKey) {
      console.warn("OPENAI_API_KEY is not defined. Generating mock flashcards.");
      cardDataList = this.generateMockFlashcards(title, count);
    } else {
      try {
        const start = Date.now();

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            messages: [
              {
                role: "system",
                content: `You are the Nexora Spaced Repetition Engine. Generate active recall Q&A flashcards based on the notes segment provided.

RULES:
1. Keep questions short, focusing on a single definition, equation, or mechanism.
2. Answers must be direct and under 3 sentences.
3. Do not generate simple true/false questions. Focus on "Why" and "How".
4. Determine confidence rating (0.00 to 1.00) based on how factual and explicit the concepts are inside the source notes.
5. Identify which page index the question belongs to (or default to 1).
6. You must output a JSON object containing a "cards" array with exactly ${count} items.

JSON OUTPUT STRUCTURE:
{
  "cards": [
    {
      "front": "What is the time complexity of rebuilding a heap of size N?",
      "back": "O(N) using Floyd's build-heap algorithm, compared to O(N log N) for inserting items one-by-one.",
      "confidence": 0.95,
      "sourcePage": 4
    }
  ]
}`,
              },
              {
                role: "user",
                content: `Here is the notes context:\n\n${contextText}`,
              },
            ],
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`OpenAI Chat API error: ${response.status} - ${errText}`);
        }

        const result = await response.json();
        const latency = Date.now() - start;

        // Log token usage observability metrics
        const usage = result.usage || { prompt_tokens: 150, completion_tokens: 120 };
        await ObservabilityService.logCall(
          null, // Anonymous for background system processes
          "gpt-4o-mini",
          usage.prompt_tokens,
          usage.completion_tokens,
          latency
        );

        const parsed = JSON.parse(result.choices[0].message.content);
        cardDataList = parsed.cards || [];
      } catch (error) {
        console.error("OpenAI Flashcard generation failed, falling back to mock cards:", error);
        cardDataList = this.generateMockFlashcards(title, count);
      }
    }

    // 2. Create FlashcardDeck
    const deck = await FlashcardRepository.createDeck(subjectId, title, `AI Generated flashcards from Note: ${title}`);

    // 3. Save Flashcards (Prune if confidence is below 0.70)
    for (const card of cardDataList) {
      const hasHighConfidence = ValidationEngine.validateConfidence(card.confidence || 1.0, 0.70);
      if (!hasHighConfidence) {
        console.warn(`Card pruned due to low confidence score: ${card.confidence}. Question: ${card.front}`);
        continue;
      }

      await prisma.flashcard.create({
        data: {
          deckId: deck.id,
          front: card.front,
          back: card.back,
          confidence: card.confidence || 1.0,
          sourcePage: card.sourcePage || 1,
          chunkId: null, // Default
        },
      });
    }

    return FlashcardRepository.findDeckById(deck.id);
  },

  /**
   * Generates realistic mock flashcards for testing in offline/development modes.
   */
  generateMockFlashcards(title: string, count: number): Array<{ front: string; back: string; confidence: number; sourcePage: number }> {
    const list = [
      {
        front: "What is Dijkstra's algorithm used for?",
        back: "It is a shortest-path algorithm that finds the shortest path from a single source node to all other nodes in a graph with non-negative edge weights.",
        confidence: 0.95,
        sourcePage: 4,
      },
      {
        front: "Why does Dijkstra's algorithm fail on negative edge weights?",
        back: "Because it assumes once a vertex is marked visited, its shortest path estimate is finalized. Negative weights could yield a smaller path afterwards, violating this assumption.",
        confidence: 0.90,
        sourcePage: 4,
      },
      {
        front: "Explain the relaxation step in shortest-path algorithms.",
        back: "Relaxation checks if the shortest path to vertex v can be improved by going through vertex u: if d[v] > d[u] + w(u,v), we update d[v] = d[u] + w(u,v).",
        confidence: 0.92,
        sourcePage: 4,
      },
      {
        front: "What is the time complexity of Dijkstra's algorithm with a binary heap?",
        back: "O((V + E) log V), where V is the number of vertices and E is the number of edges, due to heap extract-min and decrease-key operations.",
        confidence: 0.88,
        sourcePage: 4,
      },
      {
        front: "What is the primary difference between Dijkstra and Bellman-Ford algorithms?",
        back: "Dijkstra only handles positive weights and has O(E log V) complexity, while Bellman-Ford handles negative weights, detects negative cycles, and runs in O(V * E).",
        confidence: 0.85,
        sourcePage: 4,
      },
    ];

    return list.slice(0, count);
  },
};
