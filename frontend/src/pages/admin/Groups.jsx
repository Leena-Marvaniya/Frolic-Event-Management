import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../assets/dashboard.css";

const API = "http://localhost:5000/api";

const Groups = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [events, setEvents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");

  const [form, setForm] = useState({
    id: "",
    GroupName: "",
    IsPaymentDone: "",
    IsPresent: "",
  });

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!token) navigate("/");
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const res = await axios.get(`${API}/events`);
    setEvents(res.data.data || []);
  };

  const loadGroups = async (eventId) => {
    if (!eventId) {
      setGroups([]);
      return;
    }

    const res = await axios.get(`${API}/events/${eventId}/groups`);
    setGroups(res.data.data || []);
  };

  const handleEventChange = (e) => {
    const id = e.target.value;
    setSelectedEvent(id);
    loadGroups(id);
  };

  const openAdd = () => {
    setForm({
      id: "",
      GroupName: "",
      IsPaymentDone: "",
      IsPresent: "",
    });
    setShowModal(true);
  };

  const editGroup = (g) => {
    setForm({
      id: g._id,
      GroupName: g.GroupName,
      IsPaymentDone: g.IsPaymentDone.toString(),
      IsPresent: g.IsPresent.toString(),
    });
    setShowModal(true);
  };

  const saveGroup = async () => {
    const body = {
      GroupName: form.GroupName,
      IsPaymentDone: form.IsPaymentDone === "true",
      IsPresent: form.IsPresent === "true",
    };

    if (form.id) {
      await axios.put(`${API}/groups/${form.id}`, body, {
        headers: { Authorization: "Bearer " + token },
      });
    } else {
      await axios.post(`${API}/events/${selectedEvent}/groups`, body, {
        headers: { Authorization: "Bearer " + token },
      });
    }

    setShowModal(false);
    loadGroups(selectedEvent);
  };

  const deleteGroup = async (id) => {
    if (!window.confirm("Delete?")) return;

    await axios.delete(`${API}/groups/${id}`, {
      headers: { Authorization: "Bearer " + token },
    });

    loadGroups(selectedEvent);
  };

  const togglePayment = async (id, current) => {
    await axios.put(
      `${API}/groups/${id}`,
      { IsPaymentDone: !current },
      { headers: { Authorization: "Bearer " + token } }
    );

    loadGroups(selectedEvent);
  };

  const toggleAttendance = async (id, current) => {
    await axios.put(
      `${API}/groups/${id}`,
      { IsPresent: !current },
      { headers: { Authorization: "Bearer " + token } }
    );

    loadGroups(selectedEvent);
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
              <li><Link className="nav-link active" to="/admin/groups">Groups</Link></li>
              <li><Link className="nav-link" to="/admin/participants">Participants</Link></li>
              <li><Link className="nav-link" to="/admin/winners">Winners</Link></li>
              <li><Link className="nav-link" to="/admin/reports">Reports</Link></li>
            </ul>
          </div>


          <div className="col-md-10 main-content">

            <div className="d-flex justify-content-between mb-4">
              <h5 className="fw-bold mb-0">Group Management</h5>
              <button className="btn btn-primary btn-sm px-3 py-1 rounded-pill" onClick={openAdd}>
                <i className="fas fa-plus me-1"></i> Add Group
              </button>
            </div>


            <div className="mb-3">
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

            </div>


            <div className="table-container">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Group Name</th>
                    <th>Event</th>
                    <th>Payment</th>
                    <th>Attendance</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {groups.map((g) => (
                    <tr key={g._id}>
                      <td>{g.GroupName}</td>
                      <td>{g.EventID?.EventName}</td>

                      <td>
                        <span className={`badge ${g.IsPaymentDone ? "badge-paid" : "badge-pending"}`}>
                          {g.IsPaymentDone ? "Paid" : "Pending"}
                        </span>
                        <button className="btn btn-sm btn-outline-success ms-2"
                          onClick={() => togglePayment(g._id, g.IsPaymentDone)}>
                          Toggle
                        </button>
                      </td>

                      <td>
                        <span className={`badge ${g.IsPresent ? "badge-present" : "badge-absent"}`}>
                          {g.IsPresent ? "Present" : "Absent"}
                        </span>
                        <button className="btn btn-sm btn-outline-info ms-2"
                          onClick={() => toggleAttendance(g._id, g.IsPresent)}>
                          Toggle
                        </button>
                      </td>

                      <td>
                        <button className="btn btn-warning btn-icon me-2" onClick={() => editGroup(g)}>
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-danger btn-icon" onClick={() => deleteGroup(g._id)}>
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
                {form.id ? "Edit Group" : "Add Group"}
              </h6>

              <input
                className="form-control form-control-sm mb-2"
                placeholder="Group Name"
                value={form.GroupName}
                onChange={(e) => setForm({ ...form, GroupName: e.target.value })}
              />

              <select
                className="form-control form-control-sm mb-2"
                value={form.IsPaymentDone}
                onChange={(e) => setForm({ ...form, IsPaymentDone: e.target.value })}
              >
                <option value="">Payment Status</option>
                <option value="false">Pending</option>
                <option value="true">Paid</option>
              </select>

              <select
                className="form-control form-control-sm mb-3"
                value={form.IsPresent}
                onChange={(e) => setForm({ ...form, IsPresent: e.target.value })}
              >
                <option value="">Attendance</option>
                <option value="false">Absent</option>
                <option value="true">Present</option>
              </select>

              <div className="text-end">
                <button className="btn btn-sm btn-secondary me-2" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-sm btn-success" onClick={saveGroup}>
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

export default Groups;