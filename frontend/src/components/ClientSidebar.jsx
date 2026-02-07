import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";

export default function ClientSidebar({ isOpen, onClose }) {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Logged out successfully!");
        navigate("/login");
    };

    const linkClass = ({ isActive }) =>
        `block px-4 py-2 rounded ${isActive ? "bg-teal-600 text-white" : "text-gray-200 hover:bg-gray-800"
        }`;

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
          fixed top-0 left-0 h-screen w-60 bg-black text-gray-200 shadow z-50
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:block
        `}
    
            >

                <div className="flex flex-col h-full">
                    <h2 className="text-2xl font-bold p-4 border-b border-gray-700"> Client Dashboard</h2>

                    <nav className="flex-1 px-3 py-4 space-y-2">
                        <NavLink to="/client/dashboard" className={linkClass}>Dashboard</NavLink>
                        <NavLink to="/client/profile" className={linkClass}>Profile</NavLink>
                        <NavLink to="/client/settings" className={linkClass}>Settings</NavLink>
                        <NavLink to="/client/activity" className={linkClass}>Activity</NavLink>
                        <NavLink to="/client/help" className={linkClass}>Help / FAQ</NavLink>
                    </nav>
                    <div className="p-4 border-t border-gray-700">
                        <button
                            onClick={logout}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
