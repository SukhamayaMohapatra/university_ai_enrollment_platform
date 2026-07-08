import Student from "../models/Student.js";
import Course from "../models/Course.js";

export const runAllocationAlgorithm = async () => {
  await Student.updateMany({}, { allocatedCourse: null });
  const courses = await Course.find({});

  const courseState = {};
  courses.forEach((c) => {
    courseState[c.name] = {
      doc: c,
      filled: { General: 0, OBC: 0, SC: 0, ST: 0 },
    };
  });

  const students = await Student.find({}).sort({
    marks: -1,
    applicationDate: 1,
  });

  for (let student of students) {
    for (let pref of student.preferences) {
      if (!courseState[pref]) continue;
      const courseObj = courseState[pref];
      const cat = student.category;

      if (courseObj.filled[cat] < courseObj.doc.reservedSeats[cat]) {
        courseObj.filled[cat]++;
        student.allocatedCourse = pref;
        break;
      } else if (
        cat !== "General" &&
        courseObj.filled["General"] < courseObj.doc.reservedSeats["General"]
      ) {
        courseObj.filled["General"]++;
        student.allocatedCourse = pref;
        break;
      }
    }
    await student.save();
  }

  for (let key in courseState) {
    await Course.updateOne(
      { _id: courseState[key].doc._id },
      { $set: { filledSeats: courseState[key].filled } },
    );
  }
};
