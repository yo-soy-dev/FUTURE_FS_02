// import { NavLink, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// export default function Sidebar() {
//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem("user"));

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     toast.success("Logged out successfully!");
//     navigate("/login");
//   };

//   return (

//     <div className="w-64 min-h-screen bg-slate-900 text-white fixed">
//       {/* Logo */}
//       <div className="p-6 text-2xl font-bold border-b border-slate-700">
//         Mini CRM
//       </div>

//       {/* Menu */}
//       <nav className="mt-6 flex flex-col gap-2 px-4">

//         {/* COMMON (Admin + Client) */}
//         <NavLink
//           to={
//             user?.role === "admin"
//               ? "/admin/dashboard"
//               : "/client/dashboard"
//           }
//           className={({ isActive }) =>
//             `px-4 py-2 rounded ${isActive ? "bg-blue-600" : "hover:bg-slate-800"
//             }`
//           }
//         >
//           Dashboard
//         </NavLink>

//         {/* ADMIN ONLY */}
//         {user?.role === "admin" && (
//           <>
//             <NavLink
//               to="/leads"
//               className={({ isActive }) =>
//                 `px-4 py-2 rounded ${isActive ? "bg-blue-600" : "hover:bg-slate-800"
//                 }`
//               }
//             >
//               Leads
//             </NavLink>

//             <NavLink
//               to="/inventory"
//               className={({ isActive }) =>
//                 `px-4 py-2 rounded ${isActive ? "bg-blue-600" : "hover:bg-slate-800"
//                 }`
//               }
//             >
//               Inventory
//             </NavLink>

//             <NavLink
//               to="/admin/interests"
//               className={({ isActive }) =>
//                 `px-4 py-2 rounded ${isActive ? "bg-blue-600" : "hover:bg-slate-800"
//                 }`
//               }
//             >
//               📩 Interest Requests
//             </NavLink>


//             <NavLink
//               to="/admin/support"
//               className={({ isActive }) =>
//                 `px-4 py-2 rounded ${isActive ? "bg-blue-600" : "hover:bg-slate-800"
//                 }`
//               }
//             >
//               Support Tickets
//             </NavLink>

//           </>
//         )}

//         {/* CLIENT ONLY */}
//         {user?.role === "client" && (
//           <NavLink
//             to="/client/profile"
//             className={({ isActive }) =>
//               `px-4 py-2 rounded ${isActive ? "bg-blue-600" : "hover:bg-slate-800"
//               }`
//             }
//           >
//             My Profile
//           </NavLink>
//         )}

//       </nav>

//       {/* Logout */}
//       <div className="absolute bottom-6 w-full px-4">
//         <button
//           onClick={logout}
//           className="w-full bg-red-600 py-2 rounded"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
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
      {/* Mobile Hamburger Button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-slate-900 text-white rounded"
        onClick={() => setOpen(!open)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-slate-900 text-white z-40
          transform md:translate-x-0 transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
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
                `px-4 py-2 rounded ${
                  isActive ? "bg-blue-600" : "hover:bg-slate-800"
                }`
              }
              onClick={() => setOpen(false)} // close menu on mobile
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

       <div className="px-4 mb-6">
          <button
            onClick={logout}
            className="w-full bg-red-600 py-2 rounded"
          >
            Logout
          </button>
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
