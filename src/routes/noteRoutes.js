const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  restoreNote,
  togglePin,
  toggleArchive,
} = require('../controllers/noteController');

// All note routes require authentication
router.use(authenticate);

// CRUD routes
router.post('/', createNote);
router.get('/', getAllNotes);
router.get('/:id', getNoteById);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

// Special actions
router.patch('/:id/restore', restoreNote);
router.patch('/:id/pin', togglePin);
router.patch('/:id/archive', toggleArchive);

module.exports = router;
