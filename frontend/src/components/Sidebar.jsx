import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="w-64 min-h-screen bg-slate-900 text-white fixed">
      {/* Logo */}
      <div className="p-6 text-2xl font-bold border-b border-slate-700">
        Mini CRM
      </div>

      {/* Menu */}
      <nav className="mt-6 flex flex-col gap-2 px-4">

        {/* COMMON (Admin + Client) */}
        <NavLink
          to={
            user?.role === "admin"
              ? "/admin/dashboard"
              : "/client/dashboard"
          }
          className={({ isActive }) =>
            `px-4 py-2 rounded ${isActive ? "bg-blue-600" : "hover:bg-slate-800"
            }`
          }
        >
          Dashboard
        </NavLink>

        {/* ADMIN ONLY */}
        {user?.role === "admin" && (
          <>
            <NavLink
              to="/leads"
              className={({ isActive }) =>
                `px-4 py-2 rounded ${isActive ? "bg-blue-600" : "hover:bg-slate-800"
                }`
              }
            >
              Leads
            </NavLink>

            <NavLink
              to="/inventory"
              className={({ isActive }) =>
                `px-4 py-2 rounded ${isActive ? "bg-blue-600" : "hover:bg-slate-800"
                }`
              }
            >
              Inventory
            </NavLink>

            <NavLink
              to="/admin/interests"
              className={({ isActive }) =>
                `px-4 py-2 rounded ${isActive ? "bg-blue-600" : "hover:bg-slate-800"
                }`
              }
            >
              📩 Interest Requests
            </NavLink>


            <NavLink
              to="/admin/support"
              className={({ isActive }) =>
                `px-4 py-2 rounded ${isActive ? "bg-blue-600" : "hover:bg-slate-800"
                }`
              }
            >
              Support Tickets
            </NavLink>

          </>
        )}

        {/* CLIENT ONLY */}
        {user?.role === "client" && (
          <NavLink
            to="/client/profile"
            className={({ isActive }) =>
              `px-4 py-2 rounded ${isActive ? "bg-blue-600" : "hover:bg-slate-800"
              }`
            }
          >
            My Profile
          </NavLink>
        )}

      </nav>

      {/* Logout */}
      <div className="absolute bottom-6 w-full px-4">
        <button
          onClick={logout}
          className="w-full bg-red-600 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
