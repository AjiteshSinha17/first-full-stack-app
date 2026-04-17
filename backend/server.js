import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Student from "./models/Student.js";

const app = express();
app.use(express.json());
app.use(cors());


// MongoDB Connection 
mongoose.connect(
  "mongodb+srv://ajiteshsinha2004_db_user:SINHA1014@drximposter.ravfmoa.mongodb.net/studentDB"
)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log(err));



// ADD STUDENT 
app.post("/api/add-student", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.json({ message: "Student saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL STUDENTS 
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(5500, () => {
  console.log("Server running on port 5500");
});