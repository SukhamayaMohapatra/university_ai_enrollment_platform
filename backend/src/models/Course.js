import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  totalSeats: { type: Number, required: true },
  reservedSeats: {
    General: { type: Number, required: true },
    OBC: { type: Number, required: true },
    SC: { type: Number, required: true },
    ST: { type: Number, required: true },
  },
  filledSeats: {
    General: { type: Number, default: 0 },
    OBC: { type: Number, default: 0 },
    SC: { type: Number, default: 0 },
    ST: { type: Number, default: 0 },
  },
});

export default mongoose.model("Course", courseSchema);
