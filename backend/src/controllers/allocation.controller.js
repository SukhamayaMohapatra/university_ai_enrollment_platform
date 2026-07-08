import { runAllocationAlgorithm } from "../services/allocation.service.js";
import Student from "../models/Student.js";
import Course from "../models/Course.js";
import { executeMistralPrompt } from "../services/mistral.service.js";

export const processAllocation = async (req, res) => {
  try {
    await runAllocationAlgorithm();
    res.json({ message: "Allocation successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllocationDashboard = async (req, res) => {
  try {
    const students = await Student.find();
    const courses = await Course.find();
    res.json({ students, courses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const askAllocationAI = async (req, res) => {
  try {
    const { question } = req.body;
    const students = await Student.find();
    const courses = await Course.find();

    const context = JSON.stringify({
      courses: courses.map((c) => ({
        name: c.name,
        filled: c.filledSeats,
        total: c.totalSeats,
      })),
      students: students.map((s) => ({
        id: s.studentId,
        category: s.category,
        marks: s.marks,
        allocated: s.allocatedCourse,
      })),
    });

    const systemPrompt =
      "You are an AI assistant for a university allocation system. Answer questions strictly based on the provided JSON context.";
    const answer = await executeMistralPrompt(
      systemPrompt,
      `Context: ${context}\nQuestion: ${question}`,
    );

    res.json({ answer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
