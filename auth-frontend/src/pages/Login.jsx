import { useState } from "react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", form, {
        withCredentials: true,
      });
      login(res.data.user, res.data.accessToken);
      navigate("/home");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="Enter your email"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          placeholder="Enter your password"
        />

        <Button type="submit">Login</Button>

        <p className="text-sm mt-4 text-center">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
