const mongoose = require("mongoose");

const AssetSchema = new mongoose.Schema({
  datasetName: { type: String, required: true },
  data: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Asset", AssetSchema);
