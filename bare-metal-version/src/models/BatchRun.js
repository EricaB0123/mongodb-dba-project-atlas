const mongoose = require("mongoose");

const BatchRunSchema = new mongoose.Schema({
  batchId: { type: String, required: true },
  runStatus: { type: String, default: "pending" },
  lifecycleStage: { type: String, default: "created" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("BatchRun", BatchRunSchema);
