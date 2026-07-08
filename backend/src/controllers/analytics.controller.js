import mongoose from "mongoose";
import csvtojson from "csvtojson";
import QueryHistory from "../models/QueryHistory.js";
import { executeMistralPrompt } from "../services/mistral.service.js";

export const uploadDataset = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No file uploaded. Please select a CSV file first." });
    }

    const jsonArray = await csvtojson().fromString(
      req.file.buffer.toString("utf8"),
    );

    if (jsonArray.length === 0) {
      return res.status(400).json({ error: "The uploaded CSV file is empty." });
    }

    const collectionName = `dataset_${Date.now()}`;
    const dynamicSchema = new mongoose.Schema({}, { strict: false });

    // FIX: Check if model already exists in Mongoose cache to prevent OverwriteModelError
    const DynamicModel =
      mongoose.models[collectionName] ||
      mongoose.model(collectionName, dynamicSchema, collectionName);

    await DynamicModel.insertMany(jsonArray);
    res.json({
      message: "Dataset uploaded",
      collectionName,
      count: jsonArray.length,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to upload dataset" });
  }
};

export const queryDataset = async (req, res) => {
  try {
    const { collectionName, prompt } = req.body;

    if (!collectionName) {
      return res
        .status(400)
        .json({ error: "No dataset selected. Please upload a dataset first." });
    }

    // FIX: Safely retrieve the dynamic model
    const dynamicSchema = new mongoose.Schema({}, { strict: false });
    const DynamicModel =
      mongoose.models[collectionName] ||
      mongoose.model(collectionName, dynamicSchema, collectionName);

    const sampleDoc = await DynamicModel.findOne();
    if (!sampleDoc) {
      return res.status(404).json({ error: "Dataset is empty or not found." });
    }

    const systemPrompt =
      "You are an expert MongoDB MQL generator. Convert natural language queries into valid JSON MongoDB aggregation arrays. Output ONLY raw JSON array. No markdown, no explanations.";
    const userPrompt = `Data Sample: ${JSON.stringify(sampleDoc)}\nCollection: ${collectionName}\nQuery: "${prompt}"\nOutput valid JSON array.`;

    const rawMistralOutput = await executeMistralPrompt(
      systemPrompt,
      userPrompt,
    );
    const mqlString = rawMistralOutput.replace(/```json|```/g, "").trim();

    let pipeline;
    try {
      pipeline = JSON.parse(mqlString);
    } catch (parseError) {
      return res
        .status(500)
        .json({
          error: "AI generated invalid JSON. Please try rewording your query.",
        });
    }

    const results = await DynamicModel.aggregate(pipeline);

    await QueryHistory.create({
      datasetName: collectionName,
      naturalLanguageQuery: prompt,
      generatedQuery: mqlString,
    });

    res.json({ pipeline, results });
  } catch (error) {
    console.error("Query Error:", error);
    res.status(500).json({ error: error.message || "Failed to execute query" });
  }
};

export const getHistory = async (req, res) => {
  try {
    const history = await QueryHistory.find().sort({ createdAt: -1 }).limit(10);
    res.json({ history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
