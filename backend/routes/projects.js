const router = require('express').Router();
const Project = require('../models/Project');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// Get all projects (all users can see all projects)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('createdBy', 'name email')
      .populate('members', 'name email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Create project (admin only)
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, description, members } = req.body;
    const project = await Project.create({
      name,
      description,
      createdBy: req.user.id,
      members
    });
    res.json(project);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Update project (admin only)
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(project);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Delete project (admin only)
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;