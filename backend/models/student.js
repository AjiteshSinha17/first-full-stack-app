import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  studentId: String,
  name: String,
  email: String,
  phone: String,
});

export default mongoose.model("Student", studentSchema);