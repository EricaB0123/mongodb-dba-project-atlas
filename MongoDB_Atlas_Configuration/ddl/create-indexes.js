import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);

  await mongoose.connection.db.collection("metadata")
    .createIndex({ datasetName: 1 }, { unique: true });

  await mongoose.connection.db.collection("assets")
    .createIndex({ datasetName: 1 });
  await mongoose.connection.db.collection("assets")
    .createIndex({ createdAt: 1 });

  await mongoose.connection.db.collection("batchRuns")
    .createIndex({ batchId: 1 }, { unique: true });
  await mongoose.connection.db.collection("batchRuns")
    .createIndex({ runStatus: 1 });
  await mongoose.connection.db.collection("batchRuns")
    .createIndex({ lifecycleStage: 1 });

  await mongoose.connection.db.collection("ingestQueue")
    .createIndex({ datasetName: 1 });
  await mongoose.connection.db.collection("ingestQueue")
    .createIndex({ status: 1 });

  console.log("Indexes created successfully");
  await mongoose.disconnect();
}

main().catch(console.error);
