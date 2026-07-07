import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../assets/dashboard.css";


import defaultImage from "../../assets/hackthon.png";

const API = "http://localhost:5000/api";

const CoordinatorEvents = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [userName, setUserName] = useState("Coordinator");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = {
    Authorization: "Bearer " + token,
  };

  useEffect(() => {
    if (!token) navigate("/login");
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await axios.get(`${API}/auth/me`, { headers });
      setUserName(res.data.data.UserName);
      loadEvents(res.data.data._id);
    } catch (err) {
      console.log(err);
    }
  };

  const loadEvents = async (uid) => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/events`);
      const myEvents = (res.data.data || []).filter(
        (ev) =>
          ev.EventCoOrdinatorID &&
          ev.EventCoOrdinatorID._id === uid
      );

      setEvents(myEvents);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
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
          Frolic Coordinator Panel
        </span>

        <div className="ms-auto text-white">
          <span>{userName}</span>
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
              <li><Link className="nav-link" to="/coordinator">Dashboard</Link></li>
              <li><Link className="nav-link active" to="/coordinator/events">Events</Link></li>
              <li><Link className="nav-link" to="/groups">Groups</Link></li>
              <li><Link className="nav-link" to="/participants">Participants</Link></li>
              <li><Link className="nav-link" to="/winners">Winners</Link></li>
            </ul>
          </div>


          <div className="col-md-10 main-content">

            <h5 className="fw-bold mb-4">My Events</h5>

            {loading && <div>Loading events...</div>}
            {!loading && events.length === 0 && <p>No events assigned</p>}

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

                      <p><b>Fees : ₹ {ev.EventFees}</b></p>

                      <div className="d-flex justify-content-center mt-3">
                        <button
                          className="btn btn-info btn-sm btn-rounded w-100"
                          onClick={() =>
                            navigate(`/coordinator/events/${ev._id}`)
                          }
                        >
                          View Details
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
    </>
  );
};

export default CoordinatorEvents;