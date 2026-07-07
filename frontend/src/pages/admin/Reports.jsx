import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../../assets/dashboard.css";

const API = "http://localhost:5000/api";

const Reports = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [events, setEvents] = useState([]);
  const [institutes, setInstitutes] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedInstitute, setSelectedInstitute] = useState("");

  const [eventData, setEventData] = useState(null);
  const [instData, setInstData] = useState(null);

  useEffect(() => {
    if (!token) navigate("/");
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const resE = await axios.get(`${API}/events`);
      setEvents(resE.data.data || []);

      const resI = await axios.get(`${API}/institutes`, {
        headers: { Authorization: "Bearer " + token },
      });
      setInstitutes(resI.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEventChange = async (e) => {
    const id = e.target.value;
    setSelectedEvent(id);

    if (!id) {
      setEventData(null);
      return;
    }

    try {
      const res = await axios.get(`${API}/reports/event/${id}`);
      setEventData(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleInstituteChange = async (e) => {
    const id = e.target.value;
    setSelectedInstitute(id);

    if (!id) {
      setInstData(null);
      return;
    }

    try {
      const res = await axios.get(`${API}/reports/institute/${id}`);
      setInstData(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const generateEventPDF = () => {
    if (!eventData) return alert("No data");

    const doc = new jsPDF();
    const name =
      events.find((e) => e._id === selectedEvent)?.EventName || "";

    doc.setFontSize(18);
    doc.text("Event Performance Report", 14, 20);

    doc.setFontSize(12);
    doc.text(`Event Name: ${name}`, 14, 30);
    doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, 38);

    autoTable(doc, {
      startY: 45,
      head: [["Metric", "Value"]],
      body: [
        ["Total Registered Groups", eventData.totalGroups],
        ["Total Participants", eventData.totalParticipants],
      ],
    });

    doc.save(`Event_Report_${name}.pdf`);
  };

  const generateInstitutePDF = () => {
    if (!instData) return alert("No data");

    const doc = new jsPDF();
    const name =
      institutes.find((i) => i._id === selectedInstitute)
        ?.InstituteName || "";

    doc.setFontSize(18);
    doc.text("Institute Participation Report", 14, 20);

    doc.setFontSize(12);
    doc.text(`Institute Name: ${name}`, 14, 30);
    doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, 38);

    autoTable(doc, {
      startY: 45,
      head: [["Category", "Value"]],
      body: [
        ["Total Events Participated", instData.eventsCount],
        ["Total Participants", instData.participantsCount],
      ],
    });

    doc.save(`Institute_Report_${name}.pdf`);
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
              <li><Link className="nav-link" to="/admin/events">Events</Link></li>
              <li><Link className="nav-link" to="/admin/groups">Groups</Link></li>
              <li><Link className="nav-link" to="/admin/participants">Participants</Link></li>
              <li><Link className="nav-link" to="/admin/winners">Winners</Link></li>
              <li><Link className="nav-link active" to="/admin/reports">Reports</Link></li>
            </ul>
          </div>


          <div className="col-md-10 main-content">


            <div className="mb-4">
              <h5 className="fw-bold">Reports Management</h5>
            </div>

            <div className="table-container mb-4 p-4 shadow-sm rounded">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-semibold mb-0">Event Report</h6>

                {eventData && (
                  <button
                    className="btn btn-danger btn-sm btn-rounded"
                    onClick={generateEventPDF}
                  >
                    <i className="fas fa-file-pdf me-1"></i> Download PDF
                  </button>
                )}
              </div>

              <select
                className="form-control form-control-sm mb-3"
                value={selectedEvent}
                onChange={handleEventChange}
                style={{ height: "34px", fontSize: "13px" }}
              >
                <option value="">Select Event</option>
                {events.map((e) => (
                  <option key={e._id} value={e._id}>
                    {e.EventName}
                  </option>
                ))}
              </select>

              {eventData && (
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="stat-card bg-primary text-white text-center">
                      <h4>{eventData.totalGroups}</h4>
                      <p className="mb-0">Registered Groups</p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="stat-card bg-success text-white text-center">
                      <h4>{eventData.totalParticipants}</h4>
                      <p className="mb-0">Total Participants</p>
                    </div>
                  </div>
                </div>
              )}
            </div>


            <div className="table-container p-4 shadow-sm rounded">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-semibold mb-0">Institute Report</h6>

                {instData && (
                  <button
                    className="btn btn-danger btn-sm btn-rounded"
                    onClick={generateInstitutePDF}
                  >
                    <i className="fas fa-file-pdf me-1"></i> Download PDF
                  </button>
                )}
              </div>

              <select
                className="form-control form-control-sm mb-3"
                value={selectedInstitute}
                onChange={handleInstituteChange}
                style={{ height: "34px", fontSize: "13px" }}
              >
                <option value="">Select Institute</option>
                {institutes.map((i) => (
                  <option key={i._id} value={i._id}>
                    {i.InstituteName}
                  </option>
                ))}
              </select>

              {instData && (
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="stat-card bg-warning text-white text-center">
                      <h4>{instData.eventsCount}</h4>
                      <p className="mb-0">Events Participated</p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="stat-card bg-success text-white text-center">
                      <h4>{instData.participantsCount}</h4>
                      <p className="mb-0">Total Students</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Reports;