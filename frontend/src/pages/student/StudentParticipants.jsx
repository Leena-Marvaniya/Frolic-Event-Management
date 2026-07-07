import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import "../../assets/dashboard.css";

const API = "http://localhost:5000/api";

const StudentParticipants = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const groupId = searchParams.get("groupId");

  const [userName, setUserName] = useState("Student");
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    ParticipantName: "",
    IsGroupLeader: "false",
  });

  const headers = {
    Authorization: "Bearer " + token,
  };

  useEffect(() => {
    if (!token || role !== "Student") {
      navigate("/");
      return;
    }

    if (!groupId) {
      navigate("/student/my-groups");
      return;
    }

    loadUser();
    loadParticipants();
  }, []);

  const loadUser = async () => {
    try {
      const res = await axios.get(`${API}/auth/me`, { headers });
      setUserName(res.data.data.UserName);
    } catch (err) {
      logout();
    }
  };

  const loadParticipants = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API}/groups/${groupId}/participants`,
        { headers }
      );
      setParticipants(res.data.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setForm({
      ParticipantName: "",
      IsGroupLeader: "false",
    });
    setShowModal(true);
  };

  const saveParticipant = async () => {
    if (!form.ParticipantName.trim()) {
      alert("Name required");
      return;
    }

    
    if (participants.length >= 5) {
      alert("Max 5 participants allowed");
      return;
    }

  
    if (form.IsGroupLeader === "true") {
      const alreadyLeader = participants.some((p) => p.IsGroupLeader);
      if (alreadyLeader) {
        alert("Only one leader allowed");
        return;
      }
    }

    const body = {
      ParticipantName: form.ParticipantName,
      IsGroupLeader: form.IsGroupLeader === "true",
    };

    try {
      await axios.post(
        `${API}/groups/${groupId}/participants`,
        body,
        { headers }
      );

      setShowModal(false);
      loadParticipants();
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  const deleteParticipant = async (id) => {
    if (!window.confirm("Delete?")) return;

    try {
      await axios.delete(`${API}/participants/${id}`, { headers });
      loadParticipants();
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  const goBack = () => navigate(-1);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <nav className="navbar px-4">
        <span className="navbar-brand fw-bold">
          <i className="fas fa-user-graduate me-2"></i>
          Frolic Student Panel
        </span>

        <div className="ms-auto text-white">
          <span>{userName}</span>
          <button onClick={logout} className="btn btn-light btn-sm ms-3">
            Logout
          </button>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row">

          <div className="col-md-2 sidebar p-0">
            <ul className="nav flex-column mt-4">
              <li><Link className="nav-link" to="/student">Dashboard</Link></li>
              <li><Link className="nav-link" to="/student/events">Events</Link></li>
              <li><Link className="nav-link" to="/student/my-groups">My Groups</Link></li>
              <li><Link className="nav-link active" to="#">Participants</Link></li>
              <li><Link className="nav-link" to="/student/results">Results</Link></li>
            </ul>
          </div>

          <div className="col-md-10 main-content">

            <div className="d-flex justify-content-between mb-4">
              <h5 className="fw-bold mb-4">Participants</h5>

              <div>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={openAdd}
                >
                  + Add Participants
                </button>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={goBack}
                >
                  Back
                </button>
              </div>
            </div>

            <div className="table-container">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {participants.map((p) => (
                    <tr key={p._id}>
                      <td>{p.ParticipantName}</td>
                      <td>{p.IsGroupLeader ? "Leader" : "Member"}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm p-1"
                          onClick={() => deleteParticipant(p._id)}
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

              <h6 className="fw-bold mb-3">Add Participant</h6>

              <input
                className="form-control form-control-sm mb-2"
                placeholder="Name"
                value={form.ParticipantName}
                onChange={(e) =>
                  setForm({ ...form, ParticipantName: e.target.value })
                }
              />

              <select
                className="form-control form-control-sm mb-3"
                value={form.IsGroupLeader}
                onChange={(e) =>
                  setForm({ ...form, IsGroupLeader: e.target.value })
                }
              >
                <option value="false">Member</option>
                <option value="true">Leader</option>
              </select>

              <div className="text-end">
                <button
                  className="btn btn-sm btn-secondary me-2"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-sm btn-success"
                  onClick={saveParticipant}
                >
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

export default StudentParticipants;