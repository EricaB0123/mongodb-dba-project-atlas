const router = require("express").Router();
const { createBatch } = require("../controllers/batchController");

router.post("/", createBatch);

module.exports = router;
