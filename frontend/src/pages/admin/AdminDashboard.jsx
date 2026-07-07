import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../assets/dashboard.css";

const API = "http://localhost:5000/api";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    institutes: 0,
    events: 0,
    departments: 0,
    groups: 0,
  });

  const [recentEvents, setRecentEvents] = useState([]);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!token || role !== "Admin") {
      navigate("/");
    } else {
      loadStats();
      loadRecentEvents();
    }
  }, []);

  const loadStats = async () => {
    try {
      const headers = { Authorization: "Bearer " + token };

      const inst = await axios.get(`${API}/institutes`, { headers });
      const events = await axios.get(`${API}/events`, { headers });
      const dept = await axios.get(`${API}/departments`);

      let totalGroups = 0;

      for (const event of events.data.data || []) {
        const grp = await axios.get(`${API}/events/${event._id}/groups`);
        totalGroups += grp.data.total || grp.data.data?.length || 0;
      }

      setStats({
        institutes: inst.data.total || inst.data.data?.length || 0,
        events: events.data.total || events.data.data?.length || 0,
        departments: dept.data.total || dept.data.data?.length || 0,
        groups: totalGroups,
      });

    } catch (err) {
      console.log(err);
    }
  };

  const loadRecentEvents = async () => {
    try {
      const res = await axios.get(`${API}/events`, {
        headers: { Authorization: "Bearer " + token },
      });

      setRecentEvents((res.data.data || []).slice(0, 5));

    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
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

              <li><Link className="nav-link active" to="/admin/dashboard">Dashboard</Link></li>
              <li><Link className="nav-link" to="/admin/users">Users</Link></li>
              <li><Link className="nav-link" to="/admin/institutes">Institutes</Link></li>
              <li><Link className="nav-link" to="/admin/departments">Departments</Link></li>
              <li><Link className="nav-link" to="/admin/events">Events</Link></li>
              <li><Link className="nav-link" to="/admin/groups">Groups</Link></li>
              <li><Link className="nav-link" to="/admin/participants">Participants</Link></li>
              <li><Link className="nav-link" to="/admin/winners">Winners</Link></li>
              <li><Link className="nav-link" to="/admin/reports">Reports</Link></li>

            </ul>
          </div>


          <div className="col-md-10 main-content">

            <h5 className="fw-bold mb-4">Dashboard Overview</h5>

            <div className="row mb-4">

              <div className="col-md-3">
                <div className="card dashboard-card text-center p-3">
                  <i className="fas fa-university fa-2x text-primary"></i>
                  <h6 className="mt-2">Institutes</h6>
                  <div className="stat-number text-primary">{stats.institutes}</div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card dashboard-card text-center p-3">
                  <i className="fas fa-calendar fa-2x text-success"></i>
                  <h6 className="mt-2">Events</h6>
                  <div className="stat-number text-success">{stats.events}</div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card dashboard-card text-center p-3">
                  <i className="fas fa-building fa-2x text-warning"></i>
                  <h6 className="mt-2">Departments</h6>
                  <div className="stat-number text-warning">{stats.departments}</div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card dashboard-card text-center p-3">
                  <i className="fas fa-layer-group fa-2x text-danger"></i>
                  <h6 className="mt-2">Groups</h6>
                  <div className="stat-number text-danger">{stats.groups}</div>
                </div>
              </div>

            </div>

            <div className="table-container">
              <h5 className="fw-bold mb-3">Recent Events</h5>

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
                    {recentEvents.map((event, index) => (
                      <tr key={index}>
                        <td>{event.EventName || "-"}</td>
                        <td>
                          {event.createdAt
                            ? new Date(event.createdAt).toLocaleDateString()
                            : "-"}
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

export default AdminDashboard;