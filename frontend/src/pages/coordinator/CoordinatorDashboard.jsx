import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/dashboard.css";

const API = "http://localhost:5000/api";

const CoordinatorDashboard = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [userName, setUserName] = useState("Coordinator");
  const [events, setEvents] = useState([]);
  const [eventCount, setEventCount] = useState(0);
  const [groupCount, setGroupCount] = useState(0);
  const [participantCount, setParticipantCount] = useState(0);

  const headers = {
    Authorization: "Bearer " + token,
  };


  useEffect(() => {
    if (!token || role !== "Coordinator") {
      alert("Access denied");
      navigate("/");
    }
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
      const res = await axios.get(`${API}/events`, { headers });

      const eventsData = res.data.data || [];
      setEvents(eventsData);
      setEventCount(eventsData.length);

      let totalGroups = 0;
      let totalParticipants = 0;

      for (let event of eventsData) {

        const grpRes = await axios.get(
          `${API}/events/${event._id}/groups`,
          { headers }
        );

        const groups = grpRes.data.data || [];
        totalGroups += groups.length;


        for (let g of groups) {
          const partRes = await axios.get(
            `${API}/groups/${g._id}/participants`,
            { headers }
          );

          totalParticipants += partRes.data.data?.length || 0;
        }
      }

      setGroupCount(totalGroups);
      setParticipantCount(totalParticipants);
    } catch (err) {
      console.log(err);
      alert("Error loading dashboard");
    }
  };


  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    loadUser();
    loadEvents();
  }, []);

  return (
    <>

      <nav className="navbar navbar-dark px-4">
        <span className="navbar-brand fw-bold">
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
              <li>
                <a className="nav-link active">Dashboard</a>
              </li>

              <li>
                <a className="nav-link" onClick={() => navigate("/events")}>
                  Events
                </a>
              </li>

              <li>
                <a className="nav-link" onClick={() => navigate("/groups")}>
                  Groups
                </a>
              </li>

              <li>
                <a
                  className="nav-link"
                  onClick={() => navigate("/participants")}
                >
                  Participants
                </a>
              </li>

              <li>
                <a className="nav-link" onClick={() => navigate("/winners")}>
                  Winners
                </a>
              </li>
            </ul>
          </div>


          <div className="col-md-10 main-content">
            <h5 className="fw-bold mb-4">Coordinator Dashboard</h5>

            <div className="row mb-4">

              <div className="col-md-4">
                <div className="card dashboard-card text-center p-3">
                  <i className="fas fa-calendar fa-2x text-success"></i>
                  <h6 className="mt-2">Events</h6>
                  <div className="stat-number text-success">
                    {eventCount}
                  </div>
                </div>
              </div>


              <div className="col-md-4">
                <div className="card dashboard-card text-center p-3">
                  <i className="fas fa-layer-group fa-2x text-danger"></i>
                  <h6 className="mt-2">Groups</h6>
                  <div className="stat-number text-danger">
                    {groupCount}
                  </div>
                </div>
              </div>


              <div className="col-md-4">
                <div className="card dashboard-card text-center p-3">
                  <i className="fas fa-users fa-2x text-primary"></i>
                  <h6 className="mt-2">Participants</h6>
                  <div className="stat-number text-primary">
                    {participantCount}
                  </div>
                </div>
              </div>
            </div>


            <div className="table-container">
              <h6 className="fw-bold mb-3">My Events</h6>

              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {events.map((event) => (
                      <tr key={event._id}>
                        <td>{event.EventName}</td>
                        <td>
                          {new Date(event.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <span className="badge bg-success">Active</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CoordinatorDashboard;