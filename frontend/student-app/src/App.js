import { useState, useEffect } from "react";

function App() {
  const [form, setForm] = useState({
    studentId: "",
    name: "",
    email: "",
    phone: ""
  });

  const [students, setStudents] = useState([]);

  // 📥 Fetch Students 
  const fetchStudents = async () => {
    const res = await fetch("http://localhost:5500/api/students");
    const data = await res.json();
    setStudents(data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //  Submit 
  const handleSubmit = async () => {
    await fetch("http://localhost:5500/api/add-student", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    fetchStudents();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Student Form</h2>

      <input name="studentId" placeholder="ID" onChange={handleChange} />
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="phone" placeholder="Phone" onChange={handleChange} />

      <button onClick={handleSubmit}>Submit</button>

      <h2>Student List</h2>

      {students.map((s, index) => (
        <div key={index} style={{ border: "1px solid", margin: "10px", padding: "10px" }}>
          <p>ID: {s.studentId}</p>
          <p>Name: {s.name}</p>
          <p>Email: {s.email}</p>
          <p>Phone: {s.phone}</p>
        </div>
      ))}
    </div>
  );
}

export default App;