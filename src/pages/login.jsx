import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axios";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // POST request for login
      const response = await axios.post("/auth/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.status === "success") {
        // Store the authToken in localStorage
        localStorage.setItem("authToken", response.data.data);

        // Redirect to the home page on successful login
        navigate("/");
        window.location.reload();
      } else {
        setError(response.data.message); // Display any error message from the response
      }
    } catch (err) {
      console.log(err, "err");
      setError("Something went wrong! Please try again."); // Handle network or other errors
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <main className="bg-slate-50 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-10 m-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary">BRI-FINDER</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Selamat Datang Kembali, Admin
          </p>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit} // Bind form submission
          className="space-y-6"
        >
          <div>
            <label
              for="email"
              className="block text-sm font-semibold text-gray-600 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="contoh@email.com"
              className="w-full px-4 py-3 bg-slate-100 border-transparent rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition duration-300"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              for="password"
              className="block text-sm font-semibold text-gray-600 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-100 border-transparent rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition duration-300"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-xl hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-transform duration-300 hover:scale-105"
            disabled={loading}
          >
            {loading ? "Processing..." : "Masuk"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="font-semibold text-primary hover:text-secondary"
          >
            Daftar di sini
          </Link>
        </p>
      </div>
    </main>
  );
}
