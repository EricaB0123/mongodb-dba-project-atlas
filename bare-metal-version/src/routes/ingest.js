const router = require("express").Router();
const { queueIngest } = require("../controllers/ingestController");

router.post("/", queueIngest);

module.exports = router;
