import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import Leads from "./pages/Leads";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import Inventory from "./pages/Inventory";
import AdminSupport from "./pages/AdminSupport";
import InvestorPlans from "./pages/InvestorPlans";
import InterestRequests from "./pages/InterestRequests";



export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leads"
          element={
            <ProtectedRoute role="admin">
              <Leads />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute role="admin">
              <Inventory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/interests"
          element={
            <ProtectedRoute role="admin">
              <InterestRequests />
            </ProtectedRoute>
          }
        />


        <Route
          path="/admin/support"
          element={
            <ProtectedRoute role="admin">
              <AdminSupport />
            </ProtectedRoute>
          }
        />



        {/* CLIENT ROUTES */}
        <Route
          path="/client/dashboard"
          element={
            <ProtectedRoute role="client">
              <ClientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/plans"
          element={
            <ProtectedRoute role="client">
              <InvestorPlans />
            </ProtectedRoute>
          }
        />


        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
        <Route
          path="/admin"
          element={<Navigate to="/admin/dashboard" />}
        />

      </Routes>
    </BrowserRouter>
  );
}
