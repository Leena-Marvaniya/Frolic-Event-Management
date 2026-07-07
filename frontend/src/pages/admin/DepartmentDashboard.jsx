import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../assets/dashboard.css";

const API = "http://localhost:5000/api";

const Departments = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [departments, setDepartments] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [users, setUsers] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    image: "",
    institute: "",
    coordinator: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      loadDepartments();
      loadInstitutes();
      loadUsers();
    }
  }, []);

  const loadDepartments = async () => {
    const res = await axios.get(`${API}/departments`, {
      headers: { Authorization: "Bearer " + token },
    });
    setDepartments(res.data.data || []);
  };

  const loadInstitutes = async () => {
    const res = await axios.get(`${API}/institutes`, {
      headers: { Authorization: "Bearer " + token },
    });
    setInstitutes(res.data.data || []);
  };

  const loadUsers = async () => {
    const res = await axios.get(`${API}/users/getall`, {
      headers: { Authorization: "Bearer " + token },
    });

    const onlyCoordinators = (res.data.data || []).filter(
      (u) => u.Role === "Coordinator"
    );

    setUsers(onlyCoordinators);
  };

  const openAdd = () => {
    setForm({
      id: "",
      name: "",
      description: "",
      image: "",
      institute: "",
      coordinator: "",
    });
    setShowModal(true);
  };

  const editDepartment = (d) => {
    setForm({
      id: d._id,
      name: d.DepartmentName,
      description: d.DepartmentDescription,
      image: d.DepartmentImage,
      institute: d.InstituteID?._id || "",
      coordinator: d.DepartmentCoOrdinatorID?._id || "",
    });
    setShowModal(true);
  };

  const saveDepartment = async () => {
    const body = {
      DepartmentName: form.name,
      DepartmentDescription: form.description,
      DepartmentImage: form.image,
      InstituteID: form.institute,
      DepartmentCoOrdinatorID: form.coordinator,
    };

    if (form.id) {
      await axios.put(`${API}/departments/${form.id}`, body, {
        headers: { Authorization: "Bearer " + token },
      });
    } else {
      await axios.post(`${API}/departments`, body, {
        headers: { Authorization: "Bearer " + token },
      });
    }

    setShowModal(false);
    loadDepartments();
  };

  const deleteDepartment = async (id) => {
    if (!window.confirm("Delete department?")) return;

    await axios.delete(`${API}/departments/${id}`, {
      headers: { Authorization: "Bearer " + token },
    });

    loadDepartments();
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>

      <nav className="navbar px-4">
        <span className="navbar-brand">
          <i className="fas fa-calendar-alt me-2"></i>
          Frolic Admin Panel
        </span>

        <div className="ms-auto text-white">
          <span>{role}</span>
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
              <li><Link className="nav-link" to="/admin/users">Users</Link></li>
              <li><Link className="nav-link" to="/admin/institutes">Institutes</Link></li>
              <li><Link className="nav-link active" to="/admin/departments">Departments</Link></li>
              <li><Link className="nav-link" to="/admin/events">Events</Link></li>
              <li><Link className="nav-link" to="/admin/groups">Groups</Link></li>
              <li><Link className="nav-link" to="/admin/participants">Participants</Link></li>
              <li><Link className="nav-link" to="/admin/winners">Winners</Link></li>
              <li><Link className="nav-link" to="/admin/reports">Reports</Link></li>
            </ul>
          </div>


          <div className="col-md-10 main-content">

            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Department Management</h5>

              {role === "Admin" && (
                <button
                  className="btn btn-primary btn-sm px-3 py-1 rounded-pill"
                  onClick={openAdd}
                >
                  <i className="fas fa-plus me-1"></i> Add Department
                </button>
              )}
            </div>

            <div className="table-container">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Institute</th>
                    <th>Coordinator</th>
                    <th>Created</th>
                    {role === "Admin" && <th>Action</th>}
                  </tr>
                </thead>

                <tbody>
                  {departments.map((d) => (
                    <tr key={d._id}>
                      <td>{d.DepartmentName}</td>
                      <td>{d.InstituteID?.InstituteName}</td>
                      <td>{d.DepartmentCoOrdinatorID?.UserName}</td>
                      <td>{new Date(d.createdAt).toLocaleDateString()}</td>

                      {role === "Admin" && (
                        <td>
                          <button
                            onClick={() => editDepartment(d)}
                            className="btn btn-warning btn-icon me-2"
                          >
                            <i className="fas fa-edit"></i>
                          </button>

                          <button
                            onClick={() => deleteDepartment(d._id)}
                            className="btn btn-danger btn-icon"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      )}
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
                {form.id ? "Edit Department" : "Add Department"}
              </h6>

              <input
                className="form-control form-control-sm mb-2"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <textarea
                className="form-control form-control-sm mb-2"
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              
              <select
                className="form-control form-control-sm mb-2"
                value={form.institute}
                onChange={(e) => setForm({ ...form, institute: e.target.value })}
              >
                <option value="">Select Institute</option>
                {institutes.map((i) => (
                  <option key={i._id} value={i._id}>
                    {i.InstituteName}
                  </option>
                ))}
              </select>

              <select
                className="form-control form-control-sm mb-3"
                value={form.coordinator}
                onChange={(e) => setForm({ ...form, coordinator: e.target.value })}
              >
                <option value="">Select Coordinator</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.UserName}
                  </option>
                ))}
              </select>

              <div className="text-end">
                <button
                  className="btn btn-sm btn-secondary me-2"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-sm btn-success" onClick={saveDepartment}>
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

export default Departments;