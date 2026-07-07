import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../assets/dashboard.css";

const API = "http://localhost:5000/api";

const UserDashboard = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "Student",
  });

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!token || role !== "Admin") {
      navigate("/");
    } else {
      loadUsers();
    }
  }, []);

  const loadUsers = async () => {
    const res = await axios.get(`${API}/users/getall`, {
      headers: { Authorization: "Bearer " + token },
    });
    setUsers(res.data.data || []);
  };

  const openAdd = () => {
    setForm({
      id: "",
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "Student",
    });
    setShowModal(true);
  };

  const editUser = (u) => {
    setForm({
      id: u._id,
      name: u.UserName,
      email: u.EmailAddress,
      phone: u.PhoneNumber || "",
      password: "",
      role: u.Role,
    });
    setShowModal(true);
  };

  const saveUser = async () => {
    const body = {
      UserName: form.name,
      EmailAddress: form.email,
      PhoneNumber: form.phone,
      UserPassword: form.password,
      Role: form.role,
    };

    if (form.id) {
      await axios.put(`${API}/users/update/${form.id}`, body, {
        headers: { Authorization: "Bearer " + token },
      });
    } else {
      await axios.post(`${API}/users/create`, body, {
        headers: { Authorization: "Bearer " + token },
      });
    }

    setShowModal(false);
    loadUsers();
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete user?")) return;

    await axios.delete(`${API}/users/delete/${id}`, {
      headers: { Authorization: "Bearer " + token },
    });

    loadUsers();
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const getRoleClass = (r) => {
    if (r === "Admin") return "role-admin";
    if (r === "Coordinator") return "role-coordinator";
    return "role-user";
  };

  return (
    <>

      <nav className="navbar px-4">
        <span className="navbar-brand">
          <i className="fas fa-calendar-alt me-2"></i>
          Frolic Admin Panel
        </span>

        <div className="ms-auto text-white">
          <span>Admin</span>
          <button onClick={logout} className="btn btn-light btn-sm ms-3 btn-rounded">
            Logout
          </button>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row">


          <div className="col-md-2 sidebar p-0">
            <ul className="nav flex-column mt-4">
              <li><Link className="nav-link" to="/admin/dashboard">Dashboard</Link></li>
              <li><Link className="nav-link active" to="/admin/users">Users</Link></li>
              <li><Link className="nav-link" to="/admin/institutes">Institutes</Link></li>
              <li><Link className="nav-link" to="/admin/departments">Departments</Link></li>
              <li><Link className="nav-link" to="/admin/events">Events</Link></li>
              <li><Link className="nav-link" to="/admin/groups">Groups</Link></li>
              <li><Link className="nav-link" to="/admin/participants">Participants</Link></li>
              <li><Link className="nav-link" to="/admin/winners">Winners</Link></li>
              <li><Link className="nav-link" to="/admin/reports">Reports</Link></li>
            </ul>
          </div>


          <div className="col-md-10 main-content">

            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">User Management</h5>


              <button
                className="btn btn-primary btn-sm px-3 py-1 rounded-pill"
                onClick={openAdd}
              >
                <i className="fas fa-plus me-1"></i> Add User
              </button>
            </div>

            <div className="table-container">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.UserName}</td>
                      <td>{u.EmailAddress}</td>
                      <td>{u.PhoneNumber || "-"}</td>
                      <td>
                        <span className={`role-badge ${getRoleClass(u.Role)}`}>
                          {u.Role}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => editUser(u)}
                          className="btn btn-warning btn-icon me-2"
                        >
                          <i className="fas fa-edit"></i>
                        </button>

                        <button
                          onClick={() => deleteUser(u._id)}
                          className="btn btn-danger btn-icon"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

          </div>
        </div>
      </div>


      {showModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-sm">
            <div className="modal-content p-3">

              <h6 className="fw-bold mb-3">
                {form.id ? "Edit User" : "Add User"}
              </h6>

              <input className="form-control form-control-sm mb-2" placeholder="Name"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

              <input className="form-control form-control-sm mb-2" placeholder="Email"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />

              <input className="form-control form-control-sm mb-2" placeholder="Phone"
                value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />

              <input className="form-control form-control-sm mb-2" placeholder="Password"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />

              <select className="form-control form-control-sm mb-3"
                value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option>Student</option>
                <option>Coordinator</option>
                <option>Admin</option>
              </select>

              <div className="text-end">
                <button className="btn btn-sm btn-secondary me-2" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-sm btn-success" onClick={saveUser}>
                  Save
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default UserDashboard;