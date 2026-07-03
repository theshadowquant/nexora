export interface ChildChunk {
  text: string;
  startIndex: number;
  endIndex: number;
}

export interface ParentChunk {
  text: string;
  children: ChildChunk[];
}

export const ChunkingEngine = {
  /**
   * Chunks document text into Parent-Child structures.
   * Approximates 1 token = 4 characters.
   */
  chunkText(text: string, parentTokenSize = 1000, childTokenSize = 250, overlap = 50): ParentChunk[] {
    const parentCharLimit = parentTokenSize * 4;
    const childCharLimit = childTokenSize * 4;
    const overlapCharLimit = overlap * 4;

    const paragraphs = text.split(/\n\n+/);
    const parentChunks: ParentChunk[] = [];

    let currentParentText = "";

    for (const para of paragraphs) {
      if ((currentParentText + para).length > parentCharLimit && currentParentText !== "") {
        const parentString = currentParentText.trim();
        const children = this.createChildChunks(parentString, childCharLimit, overlapCharLimit);
        parentChunks.push({ text: parentString, children });

        currentParentText = para + "\n\n";
      } else {
        currentParentText += para + "\n\n";
      }
    }

    if (currentParentText.trim() !== "") {
      const parentString = currentParentText.trim();
      const children = this.createChildChunks(parentString, childCharLimit, overlapCharLimit);
      parentChunks.push({ text: parentString, children });
    }

    return parentChunks;
  },

  createChildChunks(parentText: string, childCharLimit: number, overlapCharLimit: number): ChildChunk[] {
    const childChunks: ChildChunk[] = [];
    const sentences = parentText.split(/(?<=[.!?])\s+/);

    let currentChunkText = "";
    let startIndex = 0;

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      if ((currentChunkText + sentence).length > childCharLimit && currentChunkText !== "") {
        const text = currentChunkText.trim();
        childChunks.push({
          text,
          startIndex,
          endIndex: startIndex + text.length,
        });

        // Slide window overlap (accumulate sentences backwards up to target overlap characters)
        const overlapSentences: string[] = [];
        let accumulatedOverlap = 0;
        let j = i - 1;
        while (j >= 0 && accumulatedOverlap < overlapCharLimit) {
          overlapSentences.unshift(sentences[j]);
          accumulatedOverlap += sentences[j].length;
          j--;
        }
        currentChunkText = overlapSentences.join(" ") + (overlapSentences.length > 0 ? " " : "") + sentence + " ";
        startIndex = Math.max(0, startIndex + text.length - accumulatedOverlap);
      } else {
        currentChunkText += sentence + " ";
      }
    }

    if (currentChunkText.trim() !== "") {
      const text = currentChunkText.trim();
      childChunks.push({
        text,
        startIndex,
        endIndex: startIndex + text.length,
      });
    }

    return childChunks;
  }
};
