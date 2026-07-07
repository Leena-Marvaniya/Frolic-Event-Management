import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import "../../assets/dashboard.css";


import defaultImage from "../../assets/hackthon.png";

const API = "http://localhost:5000/api";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);

  useEffect(() => {
    loadDetails();
  }, []);

  const loadDetails = async () => {
    try {
      const res = await axios.get(`${API}/events/${id}`);
      setEvent(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!event) return <div className="p-4">Loading...</div>;

  return (
    <>

      <nav className="navbar px-4">
        <span className="navbar-brand">
          <i className="fas fa-calendar-alt me-2"></i>
          Frolic Admin Panel
        </span>

        <div className="ms-auto text-white">
          <span>Admin</span>
          <button
            onClick={logout}
            className="btn btn-light btn-sm ms-3 btn-rounded"
          >
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


            <button
              onClick={() => navigate("/admin/events")}
              className="btn btn-secondary btn-sm rounded-pill mb-3"
            >
              ← Back
            </button>


            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">


              <img
                src={event.EventImage || defaultImage}
                onError={(e) => (e.target.src = defaultImage)}
                className="w-100"
                style={{ height: "320px", objectFit: "cover" }}
                alt="Event"
              />

              <div className="card-body p-4">


                <h2 className="fw-bold">{event.EventName}</h2>
                <p className="text-muted">{event.EventTagline}</p>

                <hr />

                <div className="row">
                  <div className="col-md-6">
                    <p><b>Department:</b> {event.DepartmentID?.DepartmentName || "N/A"}</p>
                    <p><b>Coordinator:</b> {event.EventCoOrdinatorID?.UserName || "N/A"}</p>
                    <p><b>Fees:</b> ₹ {event.EventFees}</p>
                  </div>

                  <div className="col-md-6">
                    <p><b>Min Participants:</b> {event.GroupMinParticipants}</p>
                    <p><b>Max Participants:</b> {event.GroupMaxParticipants}</p>
                    <p><b>Max Groups:</b> {event.MaxGroupsAllowed}</p>
                  </div>
                </div>

                <hr />

                <h5 className="fw-bold mb-2">Description</h5>
                <div className="bg-light p-3 rounded small">
                  {event.EventDescription || "No description available"}
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetails;