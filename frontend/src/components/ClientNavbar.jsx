import { useNavigate } from "react-router-dom";

export default function ClientNavbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between">
      <h1 className="font-bold text-lg">Mini CRM</h1>

      <button
        onClick={logout}
        className="text-red-500 text-sm"
      >
        Logout
      </button>
    </div>
  );
}
