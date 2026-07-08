import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  marks: { type: Number, required: true },
  category: {
    type: String,
    enum: ["General", "OBC", "SC", "ST"],
    required: true,
  },
  applicationDate: { type: Date, required: true },
  preferences: [{ type: String }],
  allocatedCourse: { type: String, default: null },
});

export default mongoose.model("Student", studentSchema);
