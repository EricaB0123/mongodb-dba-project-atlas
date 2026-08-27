const mongoose = require("mongoose");

const MetadataSchema = new mongoose.Schema({
  datasetName: { type: String, required: true },
  uploaderEmail: { type: String, required: true },
  fields: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Metadata", MetadataSchema);
