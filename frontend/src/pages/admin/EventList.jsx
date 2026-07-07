import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../assets/dashboard.css";


import defaultImage from "../../assets/hackthon.png";

const API = "http://localhost:5000/api";

const EventList = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [events, setEvents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [coordinators, setCoordinators] = useState([]);

  const [form, setForm] = useState({
    id: "",
    EventName: "",
    EventTagline: "",
    EventImage: "",
    EventDescription: "",
    EventFees: "",
    GroupMinParticipants: "",
    GroupMaxParticipants: "",
    MaxGroupsAllowed: "",
    DepartmentID: "",
    EventCoOrdinatorID: "",
  });

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!token) navigate("/");
    loadEvents();
    loadDepartments();
    loadCoordinators();
  }, []);

  const loadEvents = async () => {
    const res = await axios.get(`${API}/events`);
    setEvents(res.data.data || []);
  };

  const loadDepartments = async () => {
    const res = await axios.get(`${API}/departments`);
    setDepartments(res.data.data || []);
  };

  const loadCoordinators = async () => {
    const res = await axios.get(`${API}/users/getall`, {
      headers: { Authorization: "Bearer " + token },
    });

    setCoordinators(res.data.data.filter((u) => u.Role === "Coordinator"));
  };

  const openAdd = () => {
    setForm({
      id: "",
      EventName: "",
      EventTagline: "",
      EventImage: "",
      EventDescription: "",
      EventFees: "",
      GroupMinParticipants: "",
      GroupMaxParticipants: "",
      MaxGroupsAllowed: "",
      DepartmentID: "",
      EventCoOrdinatorID: "",
    });
    setShowModal(true);
  };

  const editEvent = (ev) => {
    setForm({
      id: ev._id,
      ...ev,
      DepartmentID: ev.DepartmentID?._id,
      EventCoOrdinatorID: ev.EventCoOrdinatorID?._id,
    });
    setShowModal(true);
  };

  const saveEvent = async () => {
    try {
      const body = {
        EventName: form.EventName,
        EventTagline: form.EventTagline,
        EventImage: form.EventImage,
        EventDescription: form.EventDescription,
        EventFees: Number(form.EventFees) || 0,
        GroupMinParticipants: Number(form.GroupMinParticipants),
        GroupMaxParticipants: Number(form.GroupMaxParticipants),
        MaxGroupsAllowed: Number(form.MaxGroupsAllowed),
        DepartmentID: form.DepartmentID,
        EventCoOrdinatorID: form.EventCoOrdinatorID,
      };

      if (form.id) {
        await axios.put(`${API}/events/${form.id}`, body, {
          headers: { Authorization: "Bearer " + token },
        });
      } else {
        await axios.post(`${API}/events`, body, {
          headers: { Authorization: "Bearer " + token },
        });
      }

      alert("Event Saved");
      setShowModal(false);
      loadEvents();

    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Error saving event");
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete?")) return;

    await axios.delete(`${API}/events/${id}`, {
      headers: { Authorization: "Bearer " + token },
    });

    loadEvents();
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

        <div className="ms-auto text-white d-flex align-items-center">
          <span className="me-3">Admin</span>
          <button onClick={logout} className="btn btn-light btn-sm btn-rounded">
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
              <li><Link className="nav-link active" to="/admin/events">Events</Link></li>
              <li><Link className="nav-link" to="/admin/groups">Groups</Link></li>
              <li><Link className="nav-link" to="/admin/participants">Participants</Link></li>
              <li><Link className="nav-link" to="/admin/winners">Winners</Link></li>
              <li><Link className="nav-link" to="/admin/reports">Reports</Link></li>
            </ul>
          </div>


          <div className="col-md-10 main-content">

            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold">Event Management</h5>

              <button
                className="btn btn-primary btn-sm px-3 py-1 rounded-pill"
                onClick={openAdd}
              >
                <i className="fas fa-plus me-1"></i> Add Event
              </button>
            </div>


            <div className="row">
              {events.map((ev) => (
                <div className="col-md-4 mb-4" key={ev._id}>
                  <div className="card shadow-sm h-100">


                    <img
                      src={ev.EventImage || defaultImage}
                      onError={(e) => (e.target.src = defaultImage)}
                      style={{ height: "180px", objectFit: "cover" }}
                      className="rounded-top"
                      alt=""
                    />

                    <div className="card-body">
                      <h6 className="fw-bold">{ev.EventName}</h6>
                      <p className="text-muted small">{ev.EventTagline}</p><br></br>

                      <p><b>Fees : ₹ {ev.EventFees}</b></p><br></br>

                      <div className="d-flex justify-content-between">
                        <button className="btn btn-info btn-icon"
                          onClick={() => navigate(`/admin/events/${ev._id}`)}>
                          <i className="fas fa-eye"></i>
                        </button>

                        <button className="btn btn-warning btn-icon"
                          onClick={() => editEvent(ev)}>
                          <i className="fas fa-edit"></i>
                        </button>

                        <button className="btn btn-danger btn-icon"
                          onClick={() => deleteEvent(ev._id)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>


      {showModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-sm">
            <div className="modal-content p-3">

              <h6 className="fw-bold">{form.id ? "Edit Event" : "Add Event"}</h6>

              <input className="form-control form-control-sm mb-2" placeholder="Event Name"
                value={form.EventName}
                onChange={(e) => setForm({ ...form, EventName: e.target.value })} />

              <input className="form-control form-control-sm mb-2" placeholder="Tagline"
                value={form.EventTagline}
                onChange={(e) => setForm({ ...form, EventTagline: e.target.value })} />


              <input className="form-control form-control-sm mb-2" placeholder="Image URL"
                value={form.EventImage}
                onChange={(e) => setForm({ ...form, EventImage: e.target.value })} />

              {form.EventImage && (
                <img
                  src={form.EventImage}
                  onError={(e) => (e.target.src = defaultImage)}
                  style={{ height: "120px", objectFit: "cover", width: "100%", marginBottom: "10px", borderRadius: "10px" }}
                />
              )}

              <textarea className="form-control form-control-sm mb-2" placeholder="Description"
                value={form.EventDescription}
                onChange={(e) => setForm({ ...form, EventDescription: e.target.value })} />

              <input className="form-control form-control-sm mb-2" type="number" placeholder="Fees"
                value={form.EventFees}
                onChange={(e) => setForm({ ...form, EventFees: e.target.value })} />

              <input className="form-control form-control-sm mb-2" type="number" placeholder="Min Participants"
                value={form.GroupMinParticipants}
                onChange={(e) => setForm({ ...form, GroupMinParticipants: e.target.value })} />

              <input className="form-control form-control-sm mb-2" type="number" placeholder="Max Participants"
                value={form.GroupMaxParticipants}
                onChange={(e) => setForm({ ...form, GroupMaxParticipants: e.target.value })} />

              <input className="form-control form-control-sm mb-2" type="number" placeholder="Max Groups"
                value={form.MaxGroupsAllowed}
                onChange={(e) => setForm({ ...form, MaxGroupsAllowed: e.target.value })} />

              <select className="form-control form-control-sm mb-2"
                value={form.DepartmentID}
                onChange={(e) => setForm({ ...form, DepartmentID: e.target.value })}>
                <option value="">Select Department</option>
                {departments.map(d => (
                  <option key={d._id} value={d._id}>{d.DepartmentName}</option>
                ))}
              </select>

              <select className="form-control form-control-sm mb-3"
                value={form.EventCoOrdinatorID}
                onChange={(e) => setForm({ ...form, EventCoOrdinatorID: e.target.value })}>
                <option value="">Select Coordinator</option>
                {coordinators.map(c => (
                  <option key={c._id} value={c._id}>{c.UserName}</option>
                ))}
              </select>

              <div className="text-end">
                <button className="btn btn-sm btn-secondary me-2"
                  onClick={() => setShowModal(false)}>Cancel</button>

                <button className="btn btn-sm btn-success"
                  onClick={saveEvent}>Save</button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventList;