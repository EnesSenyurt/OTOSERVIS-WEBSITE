import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function AdminRandevuListesi() {
  const { user, token, isLoading } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading || user?.role !== "admin") return;
    fetchData();
  }, [user, isLoading]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3001/service-records", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(res.data);
    } catch (err) {
      console.error("Randevular alınamadı:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/service-records/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setRecords(records.filter(r => r.id !== id));
    } catch (err) {
      console.error("Tamamlama hatası:", err);
      alert("Randevu silinemedi.");
    }
  };

  if (loading) return <div className="p-6">Yükleniyor...</div>;
  if (user?.role !== "admin")
    return <div className="p-6 text-red-600">Yetkisiz erişim</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Randevular</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Araç</th>
            <th className="p-2 border">Hizmet</th>
            <th className="p-2 border">Tarih</th>
            <th className="p-2 border">Personel</th>
            <th className="p-2 border">İşlem</th>
          </tr>
        </thead>
<tbody>
  {records.map(r => (
    <tr key={r.id} className="hover:bg-gray-50">
      <td className="p-2 border text-center">{r.id}</td>
      <td className="p-2 border">{r.vehicle}</td>
      <td className="p-2 border">{r.service_name}</td>
      <td className="p-2 border">{r.service_date}</td>
      <td className="p-2 border">
        {r.personnel_name
          ? `${r.personnel_name} (${r.personnel_position})`
          : "—"}
      </td>
      <td className="p-2 border text-center">
        <button
          onClick={() => handleComplete(r.id)}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Tamamlandı
        </button>
      </td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
}
