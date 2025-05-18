import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, token, isLoading } = useAuth();
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [activeTab, setActiveTab] = useState("profile");
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({
    make: "",
    model: "",
    plate_number: "",
    year: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isLoading || !user) return;

    
    axios
      .get("http://localhost:3001/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setProfile(res.data))
      .catch(console.error);

    
    axios
      .get("http://localhost:3001/vehicles", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res =>
        setVehicles(res.data.filter(v => v.owner_id === user.id))
      )
      .catch(console.error);
  }, [isLoading, user, token]);

  const handleFormChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddVehicle = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post(
        "http://localhost:3001/vehicles",
        {
          owner_id: user.id,
          ...form
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setVehicles(prev => [...prev, { id: Date.now(), owner_id: user.id, ...form }]);
      setSuccess("Araç başarıyla eklendi.");
      setForm({ make: "", model: "", plate_number: "", year: "" });
    } catch (err) {
      console.error("Araç ekleme hatası:", err);
      setError("Araç eklenemedi. Lütfen tekrar deneyin.");
    }
  };

  if (isLoading) return <div className="p-6">Yükleniyor...</div>;
  if (!user) return <div className="p-6 text-red-600">Profil için giriş yapın.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Sekme Başlıkları */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${activeTab === "profile" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("profile")}
        >
          Profil
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "vehicles" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("vehicles")}
        >
          Araçlarım
        </button>
      </div>

      {/* Profil Sekmesi */}
      {activeTab === "profile" && (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Profil Bilgileri</h2>
          <p><strong>İsim:</strong> {profile.name}</p>
          <p><strong>E-posta:</strong> {profile.email}</p>
        </div>
      )}

      {/* Araçlarım Sekmesi */}
      {activeTab === "vehicles" && (
        <div className="bg-white p-6 rounded shadow space-y-6">
          <h2 className="text-xl font-semibold">Araçlarım</h2>

          {/* Mevcut Araçlar */}
          <ul className="space-y-2">
            {vehicles.map(v => (
              <li key={v.id} className="border p-2 rounded">
                {v.make} {v.model} – {v.plate_number} ({v.year})
              </li>
            ))}
            {vehicles.length === 0 && <li className="text-gray-500">Henüz araç eklemediniz.</li>}
          </ul>

          {/* Yeni Araç Formu */}
          <form onSubmit={handleAddVehicle} className="space-y-4 mt-4">
            <input
              name="make"
              value={form.make}
              onChange={handleFormChange}
              placeholder="Marka"
              required
              className="w-full border p-2 rounded"
            />
            <input
              name="model"
              value={form.model}
              onChange={handleFormChange}
              placeholder="Model"
              required
              className="w-full border p-2 rounded"
            />
            <input
              name="plate_number"
              value={form.plate_number}
              onChange={handleFormChange}
              placeholder="Plaka"
              required
              className="w-full border p-2 rounded"
            />
            <input
              type="number"
              name="year"
              value={form.year}
              onChange={handleFormChange}
              placeholder="Yıl"
              required
              className="w-full border p-2 rounded"
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
            >
              Araç Ekle
            </button>
            {success && <p className="text-green-600">{success}</p>}
            {error && <p className="text-red-600">{error}</p>}
          </form>
        </div>
      )}
    </div>
  );
}
