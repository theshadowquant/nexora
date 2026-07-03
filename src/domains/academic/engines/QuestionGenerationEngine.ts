import { ObservabilityService } from "@/domains/ai/services/ObservabilityService";

export interface GeneratedQuestion {
  questionText: string;
  options: string[]; // Empty for descriptive or coding
  correctAnswer: string;
  explanation: string;
  type: "MCQ" | "DESCRIPTIVE" | "CODING" | "FILL_BLANKS";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  conceptName: string;
}

export const QuestionGenerationEngine = {
  /**
   * Synthesizes questions from note chunks using OpenAI.
   */
  async generateQuestions(
    contextText: string,
    count = 3,
    format: "MCQ" | "DESCRIPTIVE" | "CODING" | "FILL_BLANKS" = "MCQ"
  ): Promise<GeneratedQuestion[]> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.warn("OPENAI_API_KEY is not defined. Falling back to mock question sets.");
      return this.generateMockQuestions(format, count);
    }

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
              content: `You are the Nexora Assessment Generator. Synthesize exactly ${count} highly technical questions from the context.

FORMAT INSTRUCTIONS:
- For MCQ: Generate 4 realistic options. The correctAnswer must match one option.
- For DESCRIPTIVE: Option list must be empty. The correctAnswer must outline the ideal key points.
- For CODING: Question text should include problem description, input format, and output format. Option list must be empty. The correctAnswer must be the ideal syntax solution code.
- For FILL_BLANKS: Option list must be empty. The correctAnswer must be the missing keyword.

OUTPUT JSON STRUCTURE:
{
  "questions": [
    {
      "questionText": "What is the Big O complexity of routing updates in DV?",
      "options": ["O(V)", "O(E)", "O(V * E)", "O(1)"],
      "correctAnswer": "O(V * E)",
      "explanation": "Because DV utilizes Bellman-Ford equation which has V * E operations.",
      "type": "${format}",
      "difficulty": "MEDIUM",
      "conceptName": "Distance Vector Routing"
    }
  ]
}`,
            },
            {
              role: "user",
              content: `Here is the source content:\n\n${contextText}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenAI API error: ${response.status} - ${errText}`);
      }

      const result = await response.json();
      const latency = Date.now() - start;

      // Log token metrics
      const usage = result.usage || { prompt_tokens: 150, completion_tokens: 150 };
      await ObservabilityService.logCall(
        null,
        "gpt-4o-mini",
        usage.prompt_tokens,
        usage.completion_tokens,
        latency
      );

      const parsed = JSON.parse(result.choices[0].message.content);
      return parsed.questions || [];
    } catch (error) {
      console.error("OpenAI Question generation failed, falling back to mock:", error);
      return this.generateMockQuestions(format, count);
    }
  },

  /**
   * Provides high-fidelity mock questions for offline test iterations.
   */
  generateMockQuestions(
    format: "MCQ" | "DESCRIPTIVE" | "CODING" | "FILL_BLANKS",
    count: number
  ): GeneratedQuestion[] {
    const mcqs: GeneratedQuestion[] = [
      {
        questionText: "Which layer of the OSI model determines route selection parameters?",
        options: ["Physical", "Data Link", "Network", "Transport"],
        correctAnswer: "Network",
        explanation: "The Network layer is responsible for logical addressing and packet routing choices.",
        type: "MCQ",
        difficulty: "EASY",
        conceptName: "OSI Network Layer",
      },
      {
        questionText: "What is the primary constraint of Dijkstra's algorithm?",
        options: [
          "Requires binary heaps",
          "Fails on graphs with negative edge weights",
          "Limited to undirected cycles",
          "Calculates all-pairs paths"
        ],
        correctAnswer: "Fails on graphs with negative edge weights",
        explanation: "Negative weights violate Dijkstra's greedy search criteria once nodes are visited.",
        type: "MCQ",
        difficulty: "MEDIUM",
        conceptName: "Dijkstra Edge Bounds",
      },
    ];

    const coding: GeneratedQuestion[] = [
      {
        questionText: "Write a function `isBalanced(root)` that returns true if a binary tree is height-balanced.",
        options: [],
        correctAnswer: "def isBalanced(root):\n    def check(node):\n        if not node: return 0\n        lh = check(node.left)\n        if lh == -1: return -1\n        rh = check(node.right)\n        if rh == -1: return -1\n        if abs(lh - rh) > 1: return -1\n        return max(lh, rh) + 1\n    return check(root) != -1",
        explanation: "Height balance requires that the left and right subtrees have height difference <= 1.",
        type: "CODING",
        difficulty: "HARD",
        conceptName: "Tree Balancing Check",
      },
    ];

    const source = format === "CODING" ? coding : mcqs;
    return source.slice(0, count);
  },
};
