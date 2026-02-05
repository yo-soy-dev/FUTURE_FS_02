import { useState } from "react";
import axios from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: ""});
  const navigate = useNavigate();

  const submit = async () => {
  try {
    await axios.post("/auth/register", form);
    navigate("/login");
  } catch (err) {
    console.error(err);
    alert("Registration failed");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow w-96">
        <h2 className="text-2xl text-sky-500 font-bold mb-4 text-center">Create Account</h2>

        <input
          placeholder="Name"
          className="input"
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

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
          className="w-full bg-sky-500 text-white py-2 rounded mt-3"
        >
          Register
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-sky-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}