const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }
});

const metadataSchema = new mongoose.Schema({
  datasetName: { type: String, required: true, unique: true },
  uploaderEmail: { type: String, required: true },
  fields: [fieldSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Metadata", metadataSchema);
