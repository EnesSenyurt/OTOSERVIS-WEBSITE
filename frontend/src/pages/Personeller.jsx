import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Personeller() {
  const { user, token, isLoading } = useAuth();
  const [personeller, setPersoneller] = useState([]);

  useEffect(() => {
    if (isLoading) return;
    if (!user || user.role !== "admin") return;

    axios
      .get("http://localhost:3001/personnel", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPersoneller(res.data))
      .catch((err) => console.error("Personeller alınamadı:", err));
  }, [user, isLoading, token]);

  if (isLoading) return <div className="p-6 text-blue-300">Yükleniyor...</div>;
  if (!user || user.role !== "admin")
    return (
      <div className="p-6 text-red-500 font-bold">
        Bu sayfaya sadece admin erişebilir.
      </div>
    );

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-900 via-black to-gray-800">
      <h1 className="text-5xl font-extrabold mb-10 text-blue-200 text-center">
        Personel Listesi
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {personeller.map((p) => (
          <div
            key={p.id}
            className="bg-black bg-opacity-60 rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition duration-300 border-l-4 border-blue-300"
          >
            <h2 className="text-2xl font-semibold mb-2 text-white">
              {p.name}
            </h2>
            <p className="mb-1 text-gray-300">
              <span className="font-medium">Pozisyon:</span> {p.position}
            </p>
            <p className="text-gray-400">
              <span className="font-medium">İletişim:</span>{" "}
              {p.contact?.trim() || "—"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
