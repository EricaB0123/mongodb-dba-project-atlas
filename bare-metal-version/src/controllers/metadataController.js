const Metadata = require("../models/Metadata");

exports.createMetadata = async (req, res) => {
  try {
    const doc = await Metadata.create(req.body);
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
