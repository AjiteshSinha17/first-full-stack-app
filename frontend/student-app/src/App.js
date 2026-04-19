import { useState, useEffect } from "react";
import "./App.css";

const API = "http://localhost:5500/api";
const emptyForm = { studentId: "", name: "", email: "", phone: "" };

function App() {
  const [form, setForm] = useState(emptyForm);
  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // READ
  const fetchStudents = async () => {
    const res = await fetch(`${API}/students`);
    const data = await res.json();
    setStudents(data);
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // CREATE
  const handleCreate = async () => {
    if (!form.studentId || !form.name) {
      notify("Student ID and Name are required.");
      return;
    }
    await fetch(`${API}/add-student`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm(emptyForm);
    notify("Student added.");
    fetchStudents();
  };

  // UPDATE
  const handleUpdate = async () => {
    if (!form.studentId || !form.name) {
      notify("Student ID and Name are required.");
      return;
    }
    await fetch(`${API}/update-student/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm(emptyForm);
    setEditId(null);
    notify("Student updated.");
    fetchStudents();
  };

  // DELETE
  const handleDelete = async (id) => {
    await fetch(`${API}/delete-student/${id}`, { method: "DELETE" });
    setDeleteConfirm(null);
    notify("Student deleted.");
    fetchStudents();
  };

  const startEdit = (s) => {
    setEditId(s._id);
    setForm({ studentId: s.studentId, name: s.name, email: s.email, phone: s.phone });
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm(emptyForm);
  };

  return (
    <div className="app-wrapper">
      <h1>Student Manager</h1>

      {/* FORM */}
      <div className="form-section">
        <h2>{editId ? "Edit Student" : "Add Student"}</h2>

        <div className="form-grid">
          <input name="studentId" placeholder="Student ID" value={form.studentId} onChange={handleChange} />
          <input name="name"      placeholder="Name"       value={form.name}      onChange={handleChange} />
          <input name="email"     placeholder="Email"      value={form.email}     onChange={handleChange} />
          <input name="phone"     placeholder="Phone"      value={form.phone}     onChange={handleChange} />
        </div>

        {editId ? (
          <>
            <button id="btn-save"   onClick={handleUpdate}>Save</button>
            <button id="btn-cancel" className="secondary" onClick={cancelEdit}>Cancel</button>
          </>
        ) : (
          <button id="btn-add" onClick={handleCreate}>Add Student</button>
        )}
      </div>

      {/* TABLE */}
      <div>
        <h2>Student List ({students.length})</h2>

        {students.length === 0 ? (
          <div className="empty">No students found.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s._id} className={editId === s._id ? "editing-row" : ""}>
                  <td>{i + 1}</td>
                  <td>{s.studentId}</td>
                  <td>{s.name}</td>
                  <td>{s.email || "—"}</td>
                  <td>{s.phone || "—"}</td>
                  <td>
                    <button id={`edit-${s._id}`}   onClick={() => startEdit(s)}>Edit</button>
                    <button id={`delete-${s._id}`} className="danger" onClick={() => setDeleteConfirm(s._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* DELETE MODAL */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this student?</p>
            <button id="btn-confirm-delete" onClick={() => handleDelete(deleteConfirm)}>Yes, Delete</button>
            <button id="btn-cancel-delete"  className="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default App;