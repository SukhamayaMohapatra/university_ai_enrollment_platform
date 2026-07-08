import mongoose from "mongoose";
import dotenv from "dotenv";
import Student from "./src/models/Student.js";
import Course from "./src/models/Course.js";

dotenv.config();

const coursesData = [
  {
    name: "Computer Science",
    totalSeats: 120,
    reservedSeats: { General: 80, OBC: 15, SC: 10, ST: 15 },
  },
  {
    name: "Electronics",
    totalSeats: 120,
    reservedSeats: { General: 70, OBC: 30, SC: 10, ST: 10 },
  },
  {
    name: "Mechanical",
    totalSeats: 150,
    reservedSeats: { General: 70, OBC: 40, SC: 20, ST: 20 },
  },
  {
    name: "Civil Engineering",
    totalSeats: 150,
    reservedSeats: { General: 70, OBC: 30, SC: 10, ST: 10 },
  },
  {
    name: "Data Science",
    totalSeats: 100,
    reservedSeats: { General: 70, OBC: 30, SC: 10, ST: 10 },
  },
];

const categories = ["General", "OBC", "SC", "ST"];
const firstNames = [
  "Amit",
  "Priya",
  "Rohan",
  "Sneha",
  "Vikram",
  "Neha",
  "Rahul",
  "Pooja",
  "Karan",
  "Anjali",
  "Arjun",
  "Kavya",
];
const lastNames = [
  "Sharma",
  "Das",
  "Malik",
  "Murmu",
  "Singh",
  "Gupta",
  "Patel",
  "Kumar",
  "Reddy",
  "Yadav",
];

const generateStudents = (count) => {
  const students = [];
  for (let i = 1; i <= count; i++) {
    const shuffledCourses = [...coursesData].sort(() => 0.5 - Math.random());
    students.push({
      studentId: `STU-2026-${i.toString().padStart(3, "0")}`,
      name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      marks: Math.floor(Math.random() * (100 - 60 + 1)) + 60, // Marks between 60 and 100
      category: categories[Math.floor(Math.random() * categories.length)],
      applicationDate: new Date(
        Date.now() - Math.floor(Math.random() * 10000000000),
      ),
      preferences: [
        shuffledCourses[0].name,
        shuffledCourses[1].name,
        shuffledCourses[2].name,
      ],
      allocatedCourse: null,
    });
  }
  return students;
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/university_db",
    );
    console.log("MongoDB Connected. Wiping old data...");

    await Student.deleteMany();
    await Course.deleteMany();

    console.log("Injecting 5 Courses...");
    await Course.insertMany(coursesData);

    console.log("Generating and injecting 100 Students...");
    const students = generateStudents(100);
    await Student.insertMany(students);

    console.log("Database Seeding Completed Successfully!");
    process.exit();
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seedDatabase();
