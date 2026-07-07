import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../assets/dashboard.css";

const API = "http://localhost:5000/api";

const Institutes = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [institutes, setInstitutes] = useState([]);
  const [coordinators, setCoordinators] = useState([]);

  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    image: "",
    coordinator: "",
  });

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!token || role !== "Admin") {
      navigate("/");
    } else {
      loadInstitutes();
      loadCoordinators();
    }
  }, []);

  const loadInstitutes = async () => {
    const res = await axios.get(`${API}/institutes`, {
      headers: { Authorization: "Bearer " + token },
    });
    setInstitutes(res.data.data || []);
  };

  const loadCoordinators = async () => {
    const res = await axios.get(`${API}/users/getall`, {
      headers: { Authorization: "Bearer " + token },
    });

    const filtered = (res.data.data || []).filter(
      (u) => u.Role === "Coordinator"
    );

    setCoordinators(filtered);
  };

  const openAdd = () => {
    setForm({
      id: "",
      name: "",
      description: "",
      image: "",
      coordinator: "",
    });
    setShowModal(true);
  };

  const editInstitute = (inst) => {
    setForm({
      id: inst._id,
      name: inst.InstituteName,
      description: inst.InsituteDescription || "",
      image: inst.InsituteImage || "",
      coordinator: inst.InsituteCoOrdinatorID?._id || "",
    });
    setShowModal(true);
  };

  const saveInstitute = async () => {
    const body = {
      InstituteName: form.name,
      InsituteDescription: form.description,
      InsituteImage: form.image,
      InsituteCoOrdinatorID: form.coordinator,
    };

    if (form.id) {
      await axios.put(`${API}/institutes/${form.id}`, body, {
        headers: { Authorization: "Bearer " + token },
      });
    } else {
      await axios.post(`${API}/institutes`, body, {
        headers: { Authorization: "Bearer " + token },
      });
    }

    setShowModal(false);
    loadInstitutes();
  };

  const deleteInstitute = async (id) => {
    if (!window.confirm("Delete institute?")) return;

    await axios.delete(`${API}/institutes/${id}`, {
      headers: { Authorization: "Bearer " + token },
    });

    loadInstitutes();
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
              <li><Link className="nav-link" to="/admin/users">Users</Link></li>
              <li><Link className="nav-link active" to="/admin/institutes">Institutes</Link></li>
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
              <h5 className="fw-bold mb-0">Institute Management</h5>


              <button
                className="btn btn-primary btn-sm px-3 py-1 rounded-pill"
                onClick={openAdd}
              >
                <i className="fas fa-plus me-1"></i> Add Institute
              </button>
            </div>

            <div className="table-container">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Coordinator</th>
                    <th>Created</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {institutes.map((inst) => (
                    <tr key={inst._id}>
                      <td>{inst.InstituteName}</td>
                      <td>{inst.InsituteDescription || "N/A"}</td>
                      <td>{inst.InsituteCoOrdinatorID?.UserName || "N/A"}</td>
                      <td>{new Date(inst.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => editInstitute(inst)}
                          className="btn btn-warning btn-icon me-2"
                        >
                          <i className="fas fa-edit"></i>
                        </button>

                        <button
                          onClick={() => deleteInstitute(inst._id)}
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
                {form.id ? "Edit Institute" : "Add Institute"}
              </h6>

              <input className="form-control form-control-sm mb-2" placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <textarea className="form-control form-control-sm mb-2" placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />


              <select className="form-control form-control-sm mb-3"
                value={form.coordinator}
                onChange={(e) => setForm({ ...form, coordinator: e.target.value })}
              >
                <option value="">Select Coordinator</option>
                {coordinators.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.UserName}
                  </option>
                ))}
              </select>

              <div className="text-end">
                <button className="btn btn-sm btn-secondary me-2" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-sm btn-success" onClick={saveInstitute}>
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

export default Institutes;