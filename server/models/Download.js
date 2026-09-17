const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'General' },
  price: { type: Number, default: 0 },
  fileName: { type: String, required: true },       // Original name
  storedFileName: { type: String },                 // Name on disk
  filePath: { type: String, required: true },       // Full path
  fileSize: { type: Number, default: 0 },
  fileType: { type: String, default: 'application/octet-stream' },
  isActive: { type: Boolean, default: true },
  downloadCount: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Download', downloadSchema);