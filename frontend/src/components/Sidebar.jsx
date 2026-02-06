
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar({ open, setOpen }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const links = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/leads", label: "Leads" },
    { to: "/inventory", label: "Inventory" },
    { to: "/admin/interests", label: "📩 Interest Requests" },
    { to: "/admin/support", label: "Support Tickets" },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    navigate("/login");
  };


  return (
    <>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-slate-900 text-white z-40
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >

        <div className="flex flex-col h-full">
          <div>
            {/* Logo */}
            <div className="p-6 text-2xl font-bold border-b border-slate-700">
              Mini CRM
            </div>

            {/* Links */}
            <nav className="mt-6 flex flex-col gap-2 px-4">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded ${isActive ? "bg-teal-600" : "hover:bg-slate-800"
                    }`
                  }
                  onClick={() => setOpen(false)} // close menu on mobile
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="mt-auto px-4 pb-6">
            <button
              onClick={logout}
              className="w-full bg-red-600 hover:bg-red-700 py-2 rounded font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  );
}
