const mongoose = require("mongoose");

const IngestQueueSchema = new mongoose.Schema({
  datasetName: { type: String, required: true },
  status: { type: String, default: "queued" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("IngestQueue", IngestQueueSchema);
