import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import "../../assets/dashboard.css";


import defaultImage from "../../assets/hackthon.png";

const API = "http://localhost:5000/api";

const StudentEventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [event, setEvent] = useState(null);
  const [userName, setUserName] = useState("");

  const headers = {
    Authorization: "Bearer " + token,
  };

  useEffect(() => {
    if (!token || role !== "Student") {
      navigate("/");
    }

    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await axios.get(`${API}/auth/me`, { headers });
      setUserName(res.data.data.UserName);
      loadDetails();
    } catch (err) {
      console.log(err);
    }
  };

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

  const createGroup = async () => {
    const name = prompt("Enter Group Name");
    if (!name) return;

    try {
      await axios.post(
        `${API}/events/${id}/groups`,
        { GroupName: name },
        { headers }
      );

      alert("Group Created ");
      navigate("/student/my-groups");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const joinGroup = () => {
    navigate(`/student/groups?eventId=${id}`);
  };

  if (!event) return <div className="p-4">Loading...</div>;

  return (
    <>
      <nav className="navbar px-4">
        <span className="navbar-brand">
          <i className="fas fa-calendar-alt me-2"></i>
          Frolic Student Panel
        </span>

        <div className="ms-auto text-white">
          <span>{userName}</span>
          <button onClick={logout} className="btn btn-light btn-sm ms-3 btn-rounded">
            Logout
          </button>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row">

          <div className="col-md-2 sidebar p-0">
            <ul className="nav flex-column mt-4">
              <li><Link className="nav-link" to="/student">Dashboard</Link></li>
              <li><Link className="nav-link active" to="/student/events">Events</Link></li>
              <li><Link className="nav-link" to="/student/my-groups">My Groups</Link></li>
              <li><Link className="nav-link" to="/student/participants">Participants</Link></li>
              <li><Link className="nav-link" to="/student/results">Results</Link></li>
            </ul>
          </div>

          <div className="col-md-10 main-content">

            <button
              onClick={() => navigate(-1)}
              className="btn btn-secondary btn-sm rounded-pill mb-3"
            >
              ← Back
            </button>

            <div className="card shadow-lg border-0">


              <img
                src={event.EventImage || defaultImage}
                onError={(e) => (e.target.src = defaultImage)}
                className="w-100 rounded-top"
                style={{ height: "300px", objectFit: "cover" }}
                alt=""
              />

              <div className="card-body">

                <h3 className="fw-bold">{event.EventName}</h3>
                <p className="text-muted">{event.EventTagline}</p>

                <hr />

                <div className="row">
                  <div className="col-md-6">
                    <p><b>Department:</b> {event.DepartmentID?.DepartmentName}</p>
                    <p><b>Coordinator:</b> {event.EventCoOrdinatorID?.UserName}</p>
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

                <div className="mt-4 d-flex justify-content-center gap-2">

                  <button
                    className="btn btn-success btn-sm px-3 btn-rounded"
                    onClick={createGroup}
                  >
                    Create
                  </button>

                  <button
                    className="btn btn-primary btn-sm px-3 btn-rounded"
                    onClick={joinGroup}
                  >
                    Join
                  </button>

                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default StudentEventDetails;