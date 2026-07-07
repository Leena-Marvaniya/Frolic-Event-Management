import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../assets/dashboard.css";

const API = "http://localhost:5000/api";

const StudentResults = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [userName, setUserName] = useState("Student");
  const [results, setResults] = useState([]);
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
      loadResults();
    } catch {
      logout();
    }
  };


  const loadResults = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/events`, { headers });
      const events = res.data.data || [];

      let allResults = [];

      for (let ev of events) {
        const winRes = await axios.get(
          `${API}/events/${ev._id}/winners`,
          { headers }
        );

        const winners = winRes.data.data || [];

        if (winners.length === 0) continue;

        winners.sort((a, b) => a.Sequence - b.Sequence);

        allResults.push({
          eventName: ev.EventName,
          winners,
        });
      }

      setResults(allResults);
    } catch (err) {
      console.log(err);
    } finally {
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
        <span className="navbar-brand fw-bold">
          <i className="fas fa-calendar-alt me-2"></i>
          Frolic Student Panel
        </span>

        <div className="ms-auto text-white">
          <span>{userName}</span>
          <button onClick={logout} className="btn btn-light btn-sm ms-3">
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
              <li><Link className="nav-link" to="/student/my-groups">My Groups</Link></li>
              <li><Link className="nav-link" to="/student/participants">Participants</Link></li>
              <li><Link className="nav-link active" to="/student/results">Results</Link></li>
            </ul>
          </div>


          <div className="col-md-10 main-content">

            <h5 className="fw-bold mb-4">Event Winners</h5>

            {loading && <div className="text-center">Loading results...</div>}

            {!loading && results.length === 0 && (
              <div className="text-center mt-5">
                <h5>No results declared yet</h5>
                <p className="text-muted">Please check again later</p>
              </div>
            )}

            {!loading && results.map((res, index) => {
              const first = res.winners.find(w => w.Sequence === 1);
              const second = res.winners.find(w => w.Sequence === 2);
              const third = res.winners.find(w => w.Sequence === 3);

              return (
                <div className="card shadow-sm p-4 mb-4" key={index}>

                  <h2 className="fw-bold text-center mb-4">
                    {res.eventName}
                  </h2>


                  <div className="row text-center align-items-end mb-4">


                    <div className="col-md-4">
                      {second && (
                        <div className="p-3 bg-light rounded">
                          <h4>🥈</h4>
                          <h6>2nd Place</h6>
                          <p className="mb-0 fw-bold">
                            {second.GroupID?.GroupName}
                          </p>
                        </div>
                      )}
                    </div>


                    <div className="col-md-4">
                      {first && (
                        <div className="p-4 bg-warning rounded shadow">
                          <h2>🥇</h2>
                          <h5 className="fw-bold">1st Place</h5>
                          <p className="mb-0 fw-bold">
                            {first.GroupID?.GroupName}
                          </p>
                        </div>
                      )}
                    </div>


                    <div className="col-md-4">
                      {third && (
                        <div className="p-3 bg-light rounded">
                          <h4>🥉</h4>
                          <h6>3rd Place</h6>
                          <p className="mb-0 fw-bold">
                            {third.GroupID?.GroupName}
                          </p>
                        </div>
                      )}
                    </div>

                  </div>


                  <table className="table table-bordered text-center">
                    <thead className="table-light">
                      <tr>
                        <th>Rank</th>
                        <th>Group Name</th>
                      </tr>
                    </thead>

                    <tbody>
                      {res.winners.map((w) => (
                        <tr key={w._id}>
                          <td>{w.Sequence}</td>
                          <td>{w.GroupID?.GroupName || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                </div>
              );
            })}

          </div>
        </div>
      </div>
    </>
  );
};

export default StudentResults;