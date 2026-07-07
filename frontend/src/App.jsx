import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/admin/UserDashboard";
import InstituteDashboard from "./pages/admin/InstituteDashboard";
import DepartmentDashboard from "./pages/admin/DepartmentDashboard";
import EventList from "./pages/admin/EventList";
import EventDetails from "./pages/admin/EventDetails";
import Groups from "./pages/admin/Groups";
import Participants from "./pages/admin/Participants";
import Winners from "./pages/admin/Winners";
import Reports from "./pages/admin/Reports";
import CoordinatorDashboard from "./pages/coordinator/CoordinatorDashboard";
import CoordinatorEvents from "./pages/coordinator/CoordinatorEvents";
import CoordinatorEventDetails from "./pages/coordinator/CoordinatorEventDetails";
import CoordinatorGroups from "./pages/coordinator/CoordinatorGroups";
import CoordinatorParticipants from "./pages/coordinator/CoordinatorParticipants";
import CoordinatorWinners from "./pages/coordinator/CoordinatorWinners";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentEvents from "./pages/student/StudentEvents";
import StudentEventDetails from "./pages/student/StudentEventDetails";
import StudentGroups from "./pages/student/StudentGroups";
import StudentMyGroups from "./pages/student/StudentMyGroups";
import StudentParticipants from "./pages/student/StudentParticipants";

import StudentResults from "./pages/student/StudentResults";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserDashboard />} />
        <Route path="/admin/institutes" element={<InstituteDashboard />} />
        <Route path="/admin/departments" element={<DepartmentDashboard />} />
        <Route path="/admin/events" element={<EventList />} />
        <Route path="/admin/events/:id" element={<EventDetails />} />
        <Route path="/admin/groups" element={<Groups />} />
        <Route path="/admin/participants" element={<Participants />} />
        <Route path="/admin/winners" element={<Winners />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/coordinator/dashboard" element={<CoordinatorDashboard />} />
        <Route path="/events" element={<CoordinatorEvents />} />
        <Route path="/coordinator/events/:id" element={<CoordinatorEventDetails />} />
        <Route path="/groups" element={<CoordinatorGroups />} />
        <Route path="/participants" element={<CoordinatorParticipants />} />
        <Route path="/winners" element={<CoordinatorWinners />} />



        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/events" element={<StudentEvents />} />
        <Route path="/student/events/:id" element={<StudentEventDetails />} />
        <Route path="/student/groups" element={<StudentGroups />} />
        <Route path="/student/my-groups" element={<StudentMyGroups />} />
        <Route path="/student/participants" element={<StudentParticipants />} />
        <Route path="/student/results" element={<StudentResults />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;