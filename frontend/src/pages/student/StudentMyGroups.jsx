import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../assets/dashboard.css";

const API = "http://localhost:5000/api";

const StudentMyGroups = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

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
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await axios.get(`${API}/auth/me`, { headers });
      setUserName(res.data.data.UserName);
      loadGroups();
    } catch (err) {
      console.log(err);
    }
  };

 
  const loadGroups = async () => {
    try {
      setLoading(true);

      
      const res = await axios.get(`${API}/my-groups`, { headers });
      const data = res.data.data || [];

      
      const groupsWithParticipants = await Promise.all(
        data.map(async (g) => {
          try {
            const partRes = await axios.get(
              `${API}/groups/${g._id}/participants`,
              { headers }
            );

            return {
              ...g,
              eventName: g.EventID?.EventName || "",
              participants: partRes.data.data || [],
            };
          } catch {
            return {
              ...g,
              eventName: g.EventID?.EventName || "",
              participants: [],
            };
          }
        })
      );

      setGroups(groupsWithParticipants);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const pay = async (groupId) => {
    if (!window.confirm("Proceed to payment?")) return;

    try {
      const res = await axios.put(
        `${API}/groups/${groupId}`,
        { IsPaymentDone: true },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      if (res.data.success) {
        alert("Payment Successful");
        loadGroups();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const viewParticipants = (groupId) => {
    navigate(`/student/participants?groupId=${groupId}`);
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <nav className="navbar px-4">
        <span className="navbar-brand fw-bold">
          <i className="fas fa-calendar-alt me-2"></i> Frolic Student Panel
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
              <li><Link className="nav-link" to="/student/events">Events</Link></li>
              <li><Link className="nav-link active" to="/student/my-groups">My Groups</Link></li>
              <li><Link className="nav-link" to="/student/participants">Participants</Link></li>
              <li><Link className="nav-link" to="/student/results">Results</Link></li>
            </ul>
          </div>

          <div className="col-md-10 main-content">

            <h5 className="fw-bold mb-4">My Groups</h5>

            {loading && (
              <div className="text-center mb-3">
                Loading your groups...
              </div>
            )}

            {!loading && groups.length === 0 && (
              <div className="text-center mt-5">
                <h5>No groups joined yet</h5>
                <button
                  className="btn btn-success mt-2"
                  onClick={() => navigate("/student/events")}
                >
                  Browse Events
                </button>
              </div>
            )}

            <div className="row">
              {!loading &&
                groups.map((g) => (
                  <div className="col-md-6 mb-4 d-flex" key={g._id}>
                    <div className="card shadow border-0 p-3 w-100 h-100 d-flex flex-column">

                      <h6 className="fw-bold mb-1">{g.GroupName}</h6>

                      <p className="text-muted mb-2 small">
                        <i className="fas fa-calendar me-1"></i>
                        {g.eventName}
                      </p>

                      <p className="mb-2 small">
                        <b>Status:</b>{" "}
                        <span className={`badge ${g.IsPaymentDone ? "bg-success" : "bg-warning text-dark"}`}>
                          {g.IsPaymentDone ? "Paid" : "Pending"}
                        </span>
                      </p>

                      <hr />

                      <h6 className="small fw-semibold">
                        Participants ({g.participants.length})
                      </h6>

                      <ul className="small mb-2" style={{ maxHeight: "120px", overflowY: "auto" }}>
                        {g.participants.map((p, i) => (
                          <li key={i}>{p.ParticipantName}</li>
                        ))}
                      </ul>

                      <div className="mt-auto d-flex gap-2">

                        {!g.IsPaymentDone && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => pay(g._id)}
                          >
                            Pay
                          </button>
                        )}

                        <button
                          className="btn btn-info btn-sm text-white"
                          onClick={() => viewParticipants(g._id)}
                        >
                          Manage
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

export default StudentMyGroups;