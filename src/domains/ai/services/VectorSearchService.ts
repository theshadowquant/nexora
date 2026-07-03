import { prisma } from "@/lib/prisma";
import { ParentChunk } from "../engines/ChunkingEngine";
import { EmbeddingService } from "./EmbeddingService";
import crypto from "crypto";

export interface SearchResult {
  chunkId: string;
  chunkText: string;
  pageNumber: number;
  parentText: string;
  distance: number;
}

export const VectorSearchService = {
  /**
   * Processes and indexes document chunks in pgvector.
   */
  async saveNoteChunks(noteId: string, parentChunks: ParentChunk[]): Promise<void> {
    for (const parent of parentChunks) {
      const parentId = crypto.randomUUID();

      // 1. Insert Parent Chunk in database
      await prisma.$executeRawUnsafe(
        `INSERT INTO "NoteChunk" (id, "noteId", "chunkText", "pageNumber", "isParent", "parentId")
         VALUES ($1, $2, $3, $4, $5, $6)`,
        parentId,
        noteId,
        parent.text,
        1, // Default page
        true,
        null
      );

      // 2. Generate embeddings and save Child Chunks
      for (const child of parent.children) {
        const childId = crypto.randomUUID();
        
        // Generate embedding vector
        const embedding = await EmbeddingService.generateEmbedding(child.text);
        const vectorString = `[${embedding.join(",")}]`;

        // Save child with vector cast
        await prisma.$executeRawUnsafe(
          `INSERT INTO "NoteChunk" (id, "noteId", "chunkText", "pageNumber", "isParent", "parentId", embedding)
           VALUES ($1, $2, $3, $4, $5, $6, $7::vector)`,
          childId,
          noteId,
          child.text,
          1,
          false,
          parentId,
          vectorString
        );
      }
    }
  },

  /**
   * Executes a cosine similarity search against index vectors.
   */
  async searchSimilarChunks(noteId: string, queryText: string, limit = 3): Promise<SearchResult[]> {
    const queryEmbedding = await EmbeddingService.generateEmbedding(queryText);
    const vectorString = `[${queryEmbedding.join(",")}]`;

    // Query similar child chunks using pgvector Cosine Distance operator <=>
    const matches = await prisma.$queryRawUnsafe<any[]>(
      `SELECT id, "chunkText", "pageNumber", "parentId", (embedding <=> $1::vector) AS distance
       FROM "NoteChunk"
       WHERE "noteId" = $2 AND "isParent" = false
       ORDER BY distance ASC
       LIMIT $3`,
      vectorString,
      noteId,
      limit
    );

    const results: SearchResult[] = [];

    for (const match of matches) {
      let parentText = "";

      // Load parent context for synthesis
      if (match.parentId) {
        const parentRecord = await prisma.$queryRawUnsafe<any[]>(
          `SELECT "chunkText" FROM "NoteChunk" WHERE id = $1`,
          match.parentId
        );
        if (parentRecord.length > 0) {
          parentText = parentRecord[0].chunkText;
        }
      }

      results.push({
        chunkId: match.id,
        chunkText: match.chunkText,
        pageNumber: match.pageNumber,
        parentText,
        distance: match.distance,
      });
    }

    return results;
  },
};
