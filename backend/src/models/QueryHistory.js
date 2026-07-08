import mongoose from "mongoose";

const queryHistorySchema = new mongoose.Schema({
  datasetName: { type: String, required: true },
  naturalLanguageQuery: { type: String, required: true },
  generatedQuery: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("QueryHistory", queryHistorySchema);
