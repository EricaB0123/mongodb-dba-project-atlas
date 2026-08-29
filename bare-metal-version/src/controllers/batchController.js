const BatchRun = require("../models/BatchRun");

exports.createBatch = async (req, res) => {
  try {
    const doc = await BatchRun.create(req.body);
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
