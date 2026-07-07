import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../assets/dashboard.css";

const API = "http://localhost:5000/api";

const Participants = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [events, setEvents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [participants, setParticipants] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");

  const [institutes, setInstitutes] = useState([]);

  const [form, setForm] = useState({
    id: "",
    ParticipantName: "",
    ParticipantEnrollmentNumber: "",
    InstituteID: "",
    ParticipantCIty: "",
    ParticipantMobile: "",
    ParticipantEmail: "",
    IsGroupLeader: "false",
  });

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!token) navigate("/");
    loadEvents();
    loadInstitutes();
  }, []);

  const loadEvents = async () => {
    const res = await axios.get(`${API}/events`);
    setEvents(res.data.data || []);
  };

  const loadGroups = async (eventId) => {
    if (!eventId) return;

    const res = await axios.get(`${API}/events/${eventId}/groups`);
    setGroups(res.data.data || []);
  };

  const loadInstitutes = async () => {
    const res = await axios.get(`${API}/institutes`, {
      headers: { Authorization: "Bearer " + token },
    });
    setInstitutes(res.data.data || []);
  };

  const loadParticipants = async (groupId) => {
    if (!groupId) {
      setParticipants([]);
      return;
    }

    const res = await axios.get(`${API}/groups/${groupId}/participants`, {
      headers: { Authorization: "Bearer " + token },
    });

    setParticipants(res.data.data || []);
  };

  const handleEventChange = (e) => {
    const id = e.target.value;
    setSelectedEvent(id);
    setSelectedGroup("");
    setParticipants([]);
    loadGroups(id);
  };

  const handleGroupChange = (e) => {
    const id = e.target.value;
    setSelectedGroup(id);
    loadParticipants(id);
  };

  const leader = participants.filter(p => p.IsGroupLeader).length;
  const total = participants.length;
  const members = total - leader;

  const openAdd = () => {
    if (!selectedGroup) {
      alert("Select group first");
      return;
    }

    setForm({
      id: "",
      ParticipantName: "",
      ParticipantEnrollmentNumber: "",
      InstituteID: "",
      ParticipantCIty: "",
      ParticipantMobile: "",
      ParticipantEmail: "",
      IsGroupLeader: "false",
    });

    setShowModal(true);
  };

  const editParticipant = (p) => {
    setForm({
      id: p._id,
      ParticipantName: p.ParticipantName,
      ParticipantEnrollmentNumber: p.ParticipantEnrollmentNumber || "",
      ParticipantCIty: p.ParticipantCIty || "",
      ParticipantMobile: p.ParticipantMobile || "",
      ParticipantEmail: p.ParticipantEmail || "",
      IsGroupLeader: p.IsGroupLeader.toString(),
    });

    setShowModal(true);
  };

  const saveParticipant = async () => {

    if (!form.id && participants.length >= 5) {
      alert("Max 5 participants allowed");
      return;
    }


    if (form.IsGroupLeader === "true") {
      const alreadyLeader = participants.find(
        p => p.IsGroupLeader && p._id !== form.id
      );

      if (alreadyLeader) {
        alert("Only one leader allowed in a group");
        return;
      }
    }

    const selectedInstitute =
      institutes.find(i => i._id === form.InstituteID)?.InstituteName || "";

    const body = {
      ParticipantName: form.ParticipantName,
      ParticipantEnrollmentNumber: form.ParticipantEnrollmentNumber,
      ParticipantInsituteName: selectedInstitute,
      ParticipantCIty: form.ParticipantCIty,
      ParticipantMobile: form.ParticipantMobile,
      ParticipantEmail: form.ParticipantEmail,
      IsGroupLeader: form.IsGroupLeader === "true",
    };

    try {
      if (form.id) {
        await axios.put(`${API}/participants/${form.id}`, body, {
          headers: { Authorization: "Bearer " + token },
        });
      } else {
        await axios.post(`${API}/groups/${selectedGroup}/participants`, body, {
          headers: { Authorization: "Bearer " + token },
        });
      }

      setShowModal(false);
      loadParticipants(selectedGroup);
    } catch (err) {
      console.error(err);
      alert("Error saving participant");
    }
  };
  const deleteParticipant = async (id) => {
    if (!window.confirm("Delete?")) return;

    await axios.delete(`${API}/participants/${id}`, {
      headers: { Authorization: "Bearer " + token },
    });

    loadParticipants(selectedGroup);
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
              <li><Link className="nav-link" to="/admin/institutes">Institutes</Link></li>
              <li><Link className="nav-link" to="/admin/departments">Departments</Link></li>
              <li><Link className="nav-link" to="/admin/events">Events</Link></li>
              <li><Link className="nav-link" to="/admin/groups">Groups</Link></li>
              <li><Link className="nav-link active" to="/admin/participants">Participants</Link></li>
              <li><Link className="nav-link" to="/admin/winners">Winners</Link></li>
              <li><Link className="nav-link" to="/admin/reports">Reports</Link></li>
            </ul>
          </div>

          <div className="col-md-10 main-content">

            <div className="d-flex justify-content-between mb-4">
              <h5 className="fw-bold mb-0">Participants Management</h5>

              <button className="btn btn-primary btn-sm px-3 py-1 rounded-pill" onClick={openAdd}>
                <i className="fas fa-plus me-1"></i> Add Participants
              </button>
            </div>


            <select
              className="form-control mb-2 select-sm"
              value={selectedEvent}
              onChange={handleEventChange}
            >
              <option value="">Select Event</option>
              {events.map(e => (
                <option key={e._id} value={e._id}>{e.EventName}</option>
              ))}
            </select>

            <select
              className="form-control mb-3 select-sm"
              value={selectedGroup}
              onChange={handleGroupChange}
            >
              <option value="">Select Group</option>
              {groups.map(g => (
                <option key={g._id} value={g._id}>{g.GroupName}</option>
              ))}
            </select>

            <div className="stats-box">
              Leader: {leader} | Members: {members} | Total: {total} / 5
            </div>

            <div className="table-container">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Enrollment</th>
                    <th>Institute</th>
                    <th>City</th>
                    <th>Mobile</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {participants.map(p => (
                    <tr key={p._id}>
                      <td>{p.ParticipantName}</td>
                      <td>{p.ParticipantEnrollmentNumber}</td>
                      <td>{p.ParticipantInsituteName}</td>
                      <td>{p.ParticipantCIty}</td>
                      <td>{p.ParticipantMobile}</td>
                      <td>{p.IsGroupLeader ? "Leader" : "Member"}</td>

                      <td>
                        <button className="btn btn-warning btn-icon me-2" onClick={() => editParticipant(p)}>
                          <i className="fas fa-edit"></i>
                        </button>

                        <button className="btn btn-danger btn-icon" onClick={() => deleteParticipant(p._id)}>
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
                {form.id ? "Edit Participant" : "Add Participant"}
              </h6>

              <input
                className="form-control form-control-sm mb-2"
                placeholder="Name"
                value={form.ParticipantName}
                onChange={(e) => setForm({ ...form, ParticipantName: e.target.value })}
              />

              <input
                className="form-control form-control-sm mb-2"
                placeholder="Enrollment"
                value={form.ParticipantEnrollmentNumber}
                onChange={(e) => setForm({ ...form, ParticipantEnrollmentNumber: e.target.value })}
              />

              <select
                className="form-control form-control-sm mb-2"
                value={form.InstituteID}
                onChange={(e) => setForm({ ...form, InstituteID: e.target.value })}
              >
                <option value="">Select Institute</option>
                {institutes.map(i => (
                  <option key={i._id} value={i._id}>
                    {i.InstituteName}
                  </option>
                ))}
              </select>

              <input
                className="form-control form-control-sm mb-2"
                placeholder="City"
                value={form.ParticipantCIty}
                onChange={(e) => setForm({ ...form, ParticipantCIty: e.target.value })}
              />

              <input
                className="form-control form-control-sm mb-2"
                placeholder="Mobile"
                value={form.ParticipantMobile}
                onChange={(e) => setForm({ ...form, ParticipantMobile: e.target.value })}
              />

              <input
                className="form-control form-control-sm mb-2"
                placeholder="Email"
                value={form.ParticipantEmail}
                onChange={(e) => setForm({ ...form, ParticipantEmail: e.target.value })}
              />

              <select
                className="form-control form-control-sm mb-3"
                value={form.IsGroupLeader}
                onChange={(e) => setForm({ ...form, IsGroupLeader: e.target.value })}
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

export default Participants;