import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../assets/dashboard.css";


import defaultImage from "../../assets/hackthon.png";

const API = "http://localhost:5000/api";

const StudentEvents = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [userName, setUserName] = useState("Student");
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const headers = {
    Authorization: "Bearer " + token,
  };

  useEffect(() => {
    if (!token || role !== "Student") {
      navigate("/");
    }

    loadUser();
    loadEvents();
  }, []);

  const loadUser = async () => {
    try {
      const res = await axios.get(`${API}/auth/me`, { headers });
      setUserName(res.data.data.UserName);
    } catch (err) {
      console.log(err);
    }
  };

  const loadEvents = async () => {
    try {
      const res = await axios.get(`${API}/events`);
      setEvents(res.data.data || []);
      setFiltered(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    let data = [...events];

    if (search) {
      data = data.filter((ev) =>
        ev.EventName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter === "free") data = data.filter((ev) => ev.EventFees === 0);
    if (filter === "paid") data = data.filter((ev) => ev.EventFees > 0);

    setFiltered(data);
  }, [search, filter, events]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

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

            <h5 className="fw-bold mb-4">Explore Events</h5>

            <div className="row">
              {filtered.map((ev) => (
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

                      <button
                        className="btn btn-primary btn-sm w-100"
                        onClick={() => navigate(`/student/events/${ev._id}`)}
                      >
                        View Details
                      </button>

                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default StudentEvents;