import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "../auth/Login";
import Register from "../auth/Register";
import ProtectedRoute from "../components/ProtectedRoute";
import { AnimatePresence } from "framer-motion";

// Tenant pages
import TenantDashboard from "../pages/tenant/Dashboard";
import TenantTickets from "../pages/tenant/Tickets";
import NewRequest from "../pages/tenant/NewRequest";
import TicketDetails from "../pages/tenant/TicketDetails";
import TenantProfile from "../pages/tenant/Profile";
import EditProfile from "../pages/tenant/EditProfile";

// Manager pages
import ManagerDashboard from "../pages/manager/Dashboard";
import ManagerTickets from "../pages/manager/Tickets";
import AssignTicket from "../pages/manager/AssignTicket";
import StaffDashboard from "../pages/staff/Dashboard";
import StaffTickets from "../pages/staff/Tickets";
import StaffTicketDetails from "../pages/staff/TicketDetails";
import PlannedFeature from "../pages/common/PlannedFeature";
import ManagerTenants from "../pages/manager/Tenants";
import ManagerProfile from "../pages/manager/Profile";
import ManagerEditProfile from "../pages/manager/EditProfile";
import TenantDetails from "../pages/manager/TenantDetails";

import LandingPage from "../pages/common/LandingPage";

export default function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        <Route path="/" element={<LandingPage />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Tenant Routes */}
        <Route
          path="/tenant/dashboard"
          element={
            <ProtectedRoute role="TENANT">
              <TenantDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tenant/tickets"
          element={
            <ProtectedRoute role="TENANT">
              <TenantTickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tenant/tickets/new"
          element={
            <ProtectedRoute role="TENANT">
              <NewRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tenant/tickets/:id"
          element={
            <ProtectedRoute role="TENANT">
              <TicketDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tenant/profile"
          element={
            <ProtectedRoute role="TENANT">
              <TenantProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tenant/profile/edit"
          element={
            <ProtectedRoute role="TENANT">
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tenant/payments"
          element={
            <ProtectedRoute role="TENANT">
              <PlannedFeature />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tenant/documents"
          element={
            <ProtectedRoute role="TENANT">
              <PlannedFeature />
            </ProtectedRoute>
          }
        />

        {/* Manager Routes */}
        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute role="MANAGER">
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/tickets"
          element={
            <ProtectedRoute role="MANAGER">
              <ManagerTickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/tickets/:id"
          element={
            <ProtectedRoute role="MANAGER">
              <AssignTicket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/profile"
          element={
            <ProtectedRoute role="MANAGER">
              <ManagerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/tenants"
          element={
            <ProtectedRoute role="MANAGER">
              <ManagerTenants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/profile/edit"
          element={
            <ProtectedRoute role="MANAGER">
              <ManagerEditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/tenants/:id"
          element={
            <ProtectedRoute role="MANAGER">
              <TenantDetails />
            </ProtectedRoute>
          }
        />

        {/* Staff Routes */}
        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute role="STAFF">
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/tickets"
          element={
            <ProtectedRoute role="STAFF">
              <StaffTickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/tickets/:id"
          element={
            <ProtectedRoute role="STAFF">
              <StaffTicketDetails />
            </ProtectedRoute>
          }
        />

      </Routes>
    </AnimatePresence>
  );
}