import { useState } from "react";
import axios from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();


  const submit = async () => {
    try {

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      const res = await axios.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful!");

      if (res.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/client/dashboard");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow w-full max-w-md">
        <h2 className="text-2xl  md:text-3xl text-sky-500 font-bold mb-6 text-center">Welcome Back</h2>

        <input
          placeholder="Email"
          className="input"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="input"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={submit}
          className="w-full bg-sky-500 text-white py-2 md:py-3 rounded mt-3 hover:bg-sky-600 transition"
        >
          Login
        </button>

        <p className="text-sm text-center mt-4">
          New here?{" "}
          <Link to="/register" className="text-sky-500">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}