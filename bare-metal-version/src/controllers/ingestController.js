const IngestQueue = require("../models/IngestQueue");

exports.queueIngest = async (req, res) => {
  try {
    const doc = await IngestQueue.create(req.body);
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
