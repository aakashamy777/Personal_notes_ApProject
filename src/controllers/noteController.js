// Note controller — logic will be added in Stage 3

const createNote = async (req, res, next) => {
  // TODO: Implement create note
};

const getAllNotes = async (req, res, next) => {
  // TODO: Implement get all notes
};

const getNoteById = async (req, res, next) => {
  // TODO: Implement get note by id
};

const updateNote = async (req, res, next) => {
  // TODO: Implement update note
};

const deleteNote = async (req, res, next) => {
  // TODO: Implement delete note (soft delete)
};

const restoreNote = async (req, res, next) => {
  // TODO: Implement restore deleted note
};

const togglePin = async (req, res, next) => {
  // TODO: Implement pin/unpin note
};

const toggleArchive = async (req, res, next) => {
  // TODO: Implement archive/unarchive note
};

module.exports = {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  restoreNote,
  togglePin,
  toggleArchive,
};
