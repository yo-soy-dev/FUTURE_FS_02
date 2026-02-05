import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ClientNavbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="bg-white shadow px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
      <h1 className="font-bold text-lg md:text-xl">Mini CRM</h1>

      <button
        onClick={logout}
        className="text-red-500 text-sm md:text-base px-2 md:px-4 py-1 md:py-2 border border-red-500 rounded hover:bg-red-50 transition"
      >
        Logout
      </button>
    </div>
  );
}
