import { NoteRepository, CreateNoteInput } from "../repos/NoteRepository";

export const NoteService = {
  async uploadNote(data: CreateNoteInput) {
    // 1. Validation parameters checks
    if (!data.title.trim()) {
      throw new Error("Note title cannot be empty");
    }
    if (!data.fileUrl.trim()) {
      throw new Error("Invalid file attachment url");
    }

    // 2. Write note details to repository
    const note = await NoteRepository.createNote(data);

    // 3. Dispatch Background Event (mocked console trigger or Upstash publish for now)
    console.log(`[Event: NoteUploaded] Note ID: ${note.id}, URL: ${note.fileUrl}`);

    return note;
  },

  async getNoteDetails(noteId: string) {
    const note = await NoteRepository.findNoteById(noteId);
    if (!note) {
      throw new Error("Study Note not found");
    }

    // Lazy update views statistic
    await NoteRepository.incrementViews(noteId);

    return note;
  },

  async getSubjectNotes(subjectId: string) {
    return NoteRepository.findNotesBySubject(subjectId);
  },
};
