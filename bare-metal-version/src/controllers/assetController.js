const Asset = require("../models/Asset");

exports.createAsset = async (req, res) => {
  try {
    const doc = await Asset.create(req.body);
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
