const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  status:      { type: String, enum: ['todo', 'inprogress', 'done'], default: 'todo' },
  priority:    { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate:     { type: Date },
  project:     { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  assignedTo:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deletedAt:   { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);