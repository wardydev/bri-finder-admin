import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axios";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/auth/register", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.status === "success") {
        navigate("/login");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.log(err, "err");
      setError("Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-slate-50 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-10 m-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary">BRI-FINDER</h1>
          <p className="text-gray-500 mt-2 text-sm">Buat Akun Admin Baru</p>
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
              for="name"
              className="block text-sm font-semibold text-gray-600 mb-2"
            >
              Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Masukkan nama lengkap"
              className="w-full px-4 py-3 bg-slate-100 border-transparent rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition duration-300"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>
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
            disabled={loading} // Disable the button while loading
          >
            {loading ? "Processing..." : "Daftar"} {/* Display loading text */}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          Sudah punya akun?{" "}
          <Link
            to={"/login"}
            className="font-semibold text-primary hover:text-secondary"
          >
            Masuk di sini
          </Link>
        </p>
      </div>
    </main>
  );
}
