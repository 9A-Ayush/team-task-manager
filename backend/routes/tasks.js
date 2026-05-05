const router = require('express').Router();
const Task = require('../models/Task');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// Get all tasks (excludes soft-deleted)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tasks = req.user.role === 'admin'
      ? await Task.find({ deletedAt: null })
          .populate('project', 'name')
          .populate('assignedTo', 'name email')
          .populate('createdBy', 'name')
      : await Task.find({ assignedTo: req.user.id, deletedAt: null })
          .populate('project', 'name')
          .populate('assignedTo', 'name email')
          .populate('createdBy', 'name');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get trashed tasks (admin only)
router.get('/trash', authMiddleware, adminOnly, async (req, res) => {
  try {
    const tasks = await Task.find({ deletedAt: { $ne: null } })
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get tasks by project
router.get('/project/:projectId', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Create task (admin only)
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, project, assignedTo } = req.body;
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      project,
      assignedTo,
      createdBy: req.user.id
    });
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Update task status (members can update their own tasks)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    // Members can only update their own assigned tasks
    if (req.user.role === 'member' && 
        task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Soft delete task (admin only) — moves to trash
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, { deletedAt: new Date() });
    res.json({ msg: 'Task moved to trash' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Restore task from trash (admin only)
router.put('/:id/restore', authMiddleware, adminOnly, async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, { deletedAt: null });
    res.json({ msg: 'Task restored' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Permanently delete task (admin only)
router.delete('/:id/permanent', authMiddleware, adminOnly, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Task permanently deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;