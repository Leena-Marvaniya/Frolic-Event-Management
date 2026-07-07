import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../assets/dashboard.css";

const API = "http://localhost:5000/api";

const CoordinatorWinners = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [events, setEvents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [winners, setWinners] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState("");

  const [form, setForm] = useState({
    id: "",
    GroupID: "",
    Sequence: "",
  });

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!token) navigate("/login");
    loadEvents();
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


  const loadWinners = async (eventId) => {
    if (!eventId) {
      setWinners([]);
      return;
    }

    await loadGroups(eventId);

    const res = await axios.get(`${API}/events/${eventId}/winners`);
    setWinners(res.data.data || []);
  };


  const handleEventChange = (e) => {
    const id = e.target.value;
    setSelectedEvent(id);
    loadWinners(id);
  };


  const openModal = () => {
    if (!selectedEvent) {
      alert("Select event first");
      return;
    }

    setForm({
      id: "",
      GroupID: "",
      Sequence: "",
    });

    setShowModal(true);
  };


  const editWinner = (w) => {
    setForm({
      id: w._id,
      GroupID: w.GroupID?._id,
      Sequence: w.Sequence,
    });

    setShowModal(true);
  };


  const saveWinner = async () => {
    const body = {
      GroupID: form.GroupID,
      Sequence: Number(form.Sequence),
    };

    if (form.id) {
      await axios.put(`${API}/winners/${form.id}`, body, {
        headers: { Authorization: "Bearer " + token },
      });
    } else {
      await axios.post(`${API}/events/${selectedEvent}/winners`, body, {
        headers: { Authorization: "Bearer " + token },
      });
    }

    setShowModal(false);
    loadWinners(selectedEvent);
  };


  const deleteWinner = async (id) => {
    if (!window.confirm("Delete winner?")) return;

    await axios.delete(`${API}/winners/${id}`, {
      headers: { Authorization: "Bearer " + token },
    });

    loadWinners(selectedEvent);
  };


  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>

      <nav className="navbar navbar-dark px-4">
        <span className="navbar-brand fw-bold">
          <i className="fas fa-calendar-alt me-2"></i>
          Frolic Coordinator Panel
        </span>

        <div className="ms-auto text-white">
          <span>Leena</span>
          <button onClick={logout} className="btn btn-light btn-sm ms-3 btn-rounded">
            Logout
          </button>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row">


          <div className="col-md-2 sidebar p-0">
            <ul className="nav flex-column mt-4">
              <li><Link className="nav-link" to="/coordinator">Dashboard</Link></li>
              <li><Link className="nav-link" to="/events">Events</Link></li>
              <li><Link className="nav-link" to="/groups">Groups</Link></li>
              <li><Link className="nav-link" to="/participants">Participants</Link></li>
              <li><Link className="nav-link active" to="/winners">Winners</Link></li>
            </ul>
          </div>


          <div className="col-md-10 main-content">

            <div className="d-flex justify-content-between mb-4">
              <h5 className="fw-bold mb-0">Winner Management</h5>

              <button
                className="btn btn-primary btn-sm px-3 py-1 rounded-pill"
                onClick={openModal}
              >
                <i className="fas fa-plus me-2"></i> Add Winner
              </button>
            </div>


            <select
              className="form-control form-control-sm mb-3"
              value={selectedEvent}
              onChange={handleEventChange}
              style={{ height: "32px", fontSize: "13px" }}
            >
              <option value="">Select Event</option>
              {events.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.EventName}
                </option>
              ))}
            </select>


            <div className="table-container">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Event</th>
                    <th>Group</th>
                    <th>Position</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {winners.map((w) => (
                    <tr key={w._id}>
                      <td>{w.EventID?.EventName}</td>
                      <td>{w.GroupID?.GroupName}</td>
                      <td>{w.Sequence}</td>

                      <td>
                        <button
                          className="btn btn-warning btn-icon me-2"
                          onClick={() => editWinner(w)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>

                        <button
                          className="btn btn-danger btn-icon"
                          onClick={() => deleteWinner(w._id)}
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
                {form.id ? "Edit Winner" : "Add Winner"}
              </h6>

              <select
                className="form-control form-control-sm mb-2"
                value={form.GroupID}
                onChange={(e) => setForm({ ...form, GroupID: e.target.value })}
              >
                <option value="">Select Group</option>
                {groups.map((g) => (
                  <option key={g._id} value={g._id}>
                    {g.GroupName}
                  </option>
                ))}
              </select>

              <select
                className="form-control form-control-sm mb-3"
                value={form.Sequence}
                onChange={(e) => setForm({ ...form, Sequence: e.target.value })}
              >
                <option value="">Select Position</option>
                <option value="1">1st</option>
                <option value="2">2nd</option>
                <option value="3">3rd</option>
              </select>

              <div className="text-end">
                <button className="btn btn-sm btn-secondary me-2"
                  onClick={() => setShowModal(false)}>
                  Cancel
                </button>

                <button className="btn btn-sm btn-success"
                  onClick={saveWinner}>
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

export default CoordinatorWinners;