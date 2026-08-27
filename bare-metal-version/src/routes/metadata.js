const router = require("express").Router();
const { createMetadata } = require("../controllers/metadataController");

router.post("/", createMetadata);

module.exports = router;
