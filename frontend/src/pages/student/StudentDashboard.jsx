import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../assets/dashboard.css";

const API = "http://localhost:5000/api";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [userName, setUserName] = useState("Student");
  const [events, setEvents] = useState([]);
  const [eventCount, setEventCount] = useState(0);
  const [groupCount, setGroupCount] = useState(0);
  const [paymentCount, setPaymentCount] = useState(0);

  const headers = {
    Authorization: "Bearer " + token,
  };


  useEffect(() => {
    if (!token || role !== "Student") {
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
      logout();
    }
  };


  const loadDashboard = async () => {
    try {

      const res = await axios.get(`${API}/events`, { headers });
      const eventsData = res.data.data || [];

      setEvents(eventsData);
      setEventCount(eventsData.length);


      let myGroups = [];

      try {
        const grpRes = await axios.get(`${API}/my-groups`, { headers });
        myGroups = grpRes.data.data || [];
      } catch (err) {
        console.log("Group error", err);
      }

      setGroupCount(myGroups.length);


      let pending = 0;
      myGroups.forEach((g) => {
        if (!g.IsPaymentDone) pending++;
      });

      setPaymentCount(pending);

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
    loadDashboard();
  }, []);

  return (
    <>

      <nav className="navbar navbar-dark px-4">
        <span className="navbar-brand fw-bold">
          <i className="fas fa-calendar-alt me-2"></i>
          Frolic Student Panel
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
                <Link className="nav-link active">

                  Dashboard
                </Link>
              </li>

              <li>
                <Link className="nav-link" to="/student/events">

                  Events
                </Link>
              </li>

              <li>
                <Link className="nav-link" to="/student/my-groups">

                  My Groups
                </Link>
              </li>

              <li>
                <Link className="nav-link" to="/student/participants">

                  Participants
                </Link>
              </li>

              <li>
                <Link className="nav-link" to="/student/results">

                  Results
                </Link>
              </li>

            </ul>
          </div>


          <div className="col-md-10 main-content">

            <h5 className="fw-bold mb-4">Student Dashboard</h5>

            <div className="row mb-4">


              <div className="col-md-4">
                <div className="card dashboard-card text-center p-3">
                  <i className="fas fa-calendar fa-2x text-success"></i>
                  <h6 className="mt-2">Total Events</h6>
                  <div className="stat-number text-success">
                    {eventCount}
                  </div>
                </div>
              </div>


              <div className="col-md-4">
                <div className="card dashboard-card text-center p-3">
                  <i className="fas fa-layer-group fa-2x text-danger"></i>
                  <h6 className="mt-2">My Groups</h6>
                  <div className="stat-number text-danger">
                    {groupCount}
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card dashboard-card text-center p-3">
                  <i className="fas fa-credit-card fa-2x text-primary"></i>
                  <h6 className="mt-2">Pending Payments</h6>
                  <div className="stat-number text-primary">
                    {paymentCount}
                  </div>
                </div>
              </div>

            </div>


            <div className="table-container">
              <h6 className="fw-bold mb-3">Latest Events</h6>

              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      <th>Fees</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {events.slice(0, 5).map((ev) => (
                      <tr key={ev._id}>
                        <td>{ev.EventName}</td>
                        <td>₹ {ev.EventFees}</td>
                        <td>
                          <span className="badge bg-success">Open</span>
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

export default StudentDashboard;