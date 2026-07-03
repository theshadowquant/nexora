export interface FlatTopicInput {
  id: string;
  isCompleted: boolean;
  parentId: string | null;
}

export const SyllabusEngine = {
  /**
   * Computes hierarchical coverage progress.
   * If a topic contains subtopics, its completion weight is the average completion of its children.
   */
  calculateCoverage(topics: FlatTopicInput[]): number {
    if (topics.length === 0) return 0.0;

    // Separate parents (main topics) from subtopics
    const parentTopics = topics.filter((t) => t.parentId === null);
    const subTopics = topics.filter((t) => t.parentId !== null);

    let totalProgress = 0;

    for (const parent of parentTopics) {
      // Find subtopics belonging to this parent
      const children = subTopics.filter((c) => c.parentId === parent.id);

      if (children.length === 0) {
        // Flat topic without hierarchy
        totalProgress += parent.isCompleted ? 1.0 : 0.0;
      } else {
        // Hierarchical topic: average progress of child subtopics
        const completedChildren = children.filter((c) => c.isCompleted).length;
        totalProgress += completedChildren / children.length;
      }
    }

    if (parentTopics.length === 0) return 0.0;
    const finalPercentage = (totalProgress / parentTopics.length) * 100;
    return parseFloat(finalPercentage.toFixed(1));
  },
};
