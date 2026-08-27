await mongoose.connection.db.collection("metadata")
  .createIndex({ datasetName: 1 }, { unique: true });
