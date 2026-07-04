const prisma = require('../config/db');
const { validationResult } = require('express-validator');

const createNote = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, tags } = req.body;

    const note = await prisma.note.create({
      data: {
        title,
        content,
        tags: tags || [],
        userId: req.userId,
      },
    });

    res.status(201).json({ message: 'Note created successfully', note });
  } catch (err) {
    next(err);
  }
};

const getAllNotes = async (req, res, next) => {
  try {
    const { search, tag, sort, archived } = req.query;

    const where = {
      userId: req.userId,
      deleted: false,
    };

    // Filter by archived status
    if (archived !== undefined) {
      where.archived = archived === 'true';
    }

    // Search by title
    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      };
    }

    // Filter by tag
    if (tag) {
      where.tags = {
        has: tag,
      };
    }

    // Sort order
    let orderBy = { createdAt: 'desc' };
    if (sort === 'updatedAt') {
      orderBy = { updatedAt: 'desc' };
    } else if (sort === 'createdAt') {
      orderBy = { createdAt: 'desc' };
    }

    const notes = await prisma.note.findMany({
      where,
      orderBy: [{ pinned: 'desc' }, orderBy],
    });

    res.json({ notes });
  } catch (err) {
    next(err);
  }
};

const getNoteById = async (req, res, next) => {
  try {
    const note = await prisma.note.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
        deleted: false,
      },
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({ note });
  } catch (err) {
    next(err);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if note exists and belongs to user
    const existing = await prisma.note.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
        deleted: false,
      },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const { title, content, tags } = req.body;

    const note = await prisma.note.update({
      where: { id: req.params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(tags !== undefined && { tags }),
      },
    });

    res.json({ message: 'Note updated successfully', note });
  } catch (err) {
    next(err);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    const existing = await prisma.note.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
        deleted: false,
      },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const note = await prisma.note.update({
      where: { id: req.params.id },
      data: { deleted: true },
    });

    res.json({ message: 'Note deleted successfully', note });
  } catch (err) {
    next(err);
  }
};

const restoreNote = async (req, res, next) => {
  try {
    const existing = await prisma.note.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
        deleted: true,
      },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Deleted note not found' });
    }

    const note = await prisma.note.update({
      where: { id: req.params.id },
      data: { deleted: false },
    });

    res.json({ message: 'Note restored successfully', note });
  } catch (err) {
    next(err);
  }
};

const togglePin = async (req, res, next) => {
  try {
    const existing = await prisma.note.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
        deleted: false,
      },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const note = await prisma.note.update({
      where: { id: req.params.id },
      data: { pinned: !existing.pinned },
    });

    res.json({ message: `Note ${note.pinned ? 'pinned' : 'unpinned'} successfully`, note });
  } catch (err) {
    next(err);
  }
};

const toggleArchive = async (req, res, next) => {
  try {
    const existing = await prisma.note.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
        deleted: false,
      },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const note = await prisma.note.update({
      where: { id: req.params.id },
      data: { archived: !existing.archived },
    });

    res.json({ message: `Note ${note.archived ? 'archived' : 'unarchived'} successfully`, note });
  } catch (err) {
    next(err);
  }
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
