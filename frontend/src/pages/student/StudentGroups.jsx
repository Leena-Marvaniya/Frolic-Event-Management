import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import "../../assets/dashboard.css";

const API = "http://localhost:5000/api";

const StudentGroups = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const eventId = searchParams.get("eventId");

  const [userName, setUserName] = useState("Student");
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = {
    Authorization: "Bearer " + token,
  };


  useEffect(() => {
    if (!token || role !== "Student") {
      navigate("/");
      return;
    }

    if (!eventId) {
      alert("Event ID missing");
      navigate("/student/events");
      return;
    }

    loadUser();
    loadGroups();
  }, []);


  const loadUser = async () => {
    try {
      const res = await axios.get(`${API}/auth/me`, { headers });
      setUserName(res.data.data.UserName);
    } catch (err) {
      console.log(err);
    }
  };


  const loadGroups = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/events/${eventId}/groups`);
      setGroups(res.data.data || []);

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      alert("Error loading groups");
    }
  };


  const joinGroup = async (groupId) => {
    try {
      const res = await axios.post(
        `${API}/groups/${groupId}/join`,
        {},
        { headers }
      );

      if (res.data.success) {
        alert("Joined successfully ");
        navigate("/student/my-groups");
      }
    } catch (err) {
      console.log(err);

      const msg = err.response?.data?.message;

      if (msg === "You already joined this group") {
        alert(" You already joined this group");
        navigate("/student/my-groups");
      } else {
        alert(msg || "Error joining group");
      }
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
              className="btn btn-secondary btn-sm mb-3"
            >
              ← Back
            </button>

            <h5 className="fw-bold mb-4">Available Groups</h5>


            {loading && (
              <div className="text-center">
                <div className="spinner-border text-success"></div>
              </div>
            )}


            {!loading && groups.length === 0 && (
              <div className="text-center text-muted">
                No groups available
              </div>
            )}


            <div className="row">
              {!loading &&
                groups.map((g) => (
                  <div className="col-md-6 mb-4" key={g._id}>
                    <div className="card shadow-sm p-3 h-100">

                      <div className="d-flex justify-content-between align-items-center">

                        <div>
                          <h6 className="fw-bold mb-1">{g.GroupName}</h6>

                          <span
                            className={`badge ${g.IsPaymentDone ? "bg-success" : "bg-danger"
                              }`}
                          >
                            {g.IsPaymentDone ? "Paid" : "Payment Pending"}
                          </span>
                        </div>

                        <button
                          className="btn btn-primary btn-sm btn-rounded px-3 py-1"
                          style={{ fontSize: "12px" }}
                          onClick={() => joinGroup(g._id)}
                        >
                          <i className="fas fa-user-plus me-1"></i> Join
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

export default StudentGroups;