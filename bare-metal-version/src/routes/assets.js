const router = require("express").Router();
const { createAsset } = require("../controllers/assetController");

router.post("/", createAsset);

module.exports = router;
