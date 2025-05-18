import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function RandevuAl() {
  const { user, token, isLoading } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    vehicle_id: "",
    service_id: "",
    tarih: "",
    saat: "",
    not: ""
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoading || !user) return;

    axios
      .get("http://localhost:3001/vehicles", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res =>
        setVehicles(res.data.filter(v => v.owner_id === user.id))
      )
      .catch(err => console.error("Araçlar alınamadı:", err));

    axios
      .get("http://localhost:3001/services")
      .then(res => setServices(res.data))
      .catch(err => console.error("Hizmetler alınamadı:", err));
  }, [user, isLoading, token]);

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.vehicle_id || !form.service_id || !form.tarih || !form.saat) {
      return setError("Lütfen tüm zorunlu alanları doldurun.");
    }

    try {
      const service_date = `${form.tarih} ${form.saat}:00`;

      await axios.post(
        "http://localhost:3001/service-records",
        {
          vehicle_id: form.vehicle_id,
          service_id: form.service_id,
          created_by: user.id,
          notes: form.not,
          service_date
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Randevunuz başarıyla alındı.");
      setForm({ vehicle_id: "", service_id: "", tarih: "", saat: "", not: "" });
    } catch (err) {
      console.error("Randevu hatası:", err);
      setError(
        err.response?.data?.message ||
          "Randevu alınamadı. Lütfen tarih/saat formatını kontrol edin."
      );
    }
  };

  if (isLoading)
    return <div className="p-6 text-blue-300">Yükleniyor...</div>;
  if (!user)
    return (
      <div className="p-6 text-red-500 font-bold">
        Lütfen giriş yapın.
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-blue-900 via-black to-gray-800">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-black bg-opacity-70 border-l-4 border-blue-400 rounded-2xl shadow-2xl p-8 space-y-6"
      >
        <h2 className="text-2xl font-extrabold text-blue-200 text-center">
          Randevu Al
        </h2>

        <select
          name="vehicle_id"
          value={form.vehicle_id}
          onChange={handleChange}
          className="w-full bg-gray-900 bg-opacity-50 border border-gray-700 text-white placeholder-gray-400 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="">-- Araç Seç --</option>
          {vehicles.map(v => (
            <option key={v.id} value={v.id}>
              {v.plate_number} ({v.make} {v.model})
            </option>
          ))}
        </select>

        <select
          name="service_id"
          value={form.service_id}
          onChange={handleChange}
          className="w-full bg-gray-900 bg-opacity-50 border border-gray-700 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="">-- Hizmet Seç --</option>
          {services.map(s => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="tarih"
          value={form.tarih}
          onChange={handleChange}
          className="w-full bg-gray-900 bg-opacity-50 border border-gray-700 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="time"
          name="saat"
          value={form.saat}
          onChange={handleChange}
          className="w-full bg-gray-900 bg-opacity-50 border border-gray-700 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <textarea
          name="not"
          placeholder="Not (isteğe bağlı)"
          value={form.not}
          onChange={handleChange}
          className="w-full bg-gray-900 bg-opacity-50 border border-gray-700 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="w-full py-3 font-semibold rounded-2xl bg-blue-500 hover:bg-blue-600 transition duration-300 text-white"
        >
          Randevu Al
        </button>

        {success && (
          <p className="text-green-400 text-center">{success}</p>
        )}
        {error && <p className="text-red-400 text-center">{error}</p>}
      </form>
    </div>
  );
}
