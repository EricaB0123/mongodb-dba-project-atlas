require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();
app.use(express.json());

connectDB();

app.use("/metadata", require("./routes/metadata"));
app.use("/assets", require("./routes/assets"));
app.use("/batch", require("./routes/batch"));
app.use("/ingest", require("./routes/ingest"));

app.listen(3000, () => console.log("Server running on port 3000"));
