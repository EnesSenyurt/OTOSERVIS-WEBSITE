import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function ServicesListesi() {
  const { token } = useAuth();
  const [services, setServices] = useState([]);
  const [personnel, setPersonnel] = useState([]);

  
  useEffect(() => {
    
    axios
      .get("http://localhost:3001/personnel", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setPersonnel(res.data))
      .catch(err => console.error("Personel alınamadı:", err));

    
   axios.get("http://localhost:3001/admin/services", {
     headers: { Authorization: `Bearer ${token}` }
   })
      .then(res => setServices(res.data))
      .catch(err => console.error("Hizmetler alınamadı:", err));
  }, [token]);

  
  const handleAssign = (serviceId, personnelId) => {
    axios
      .put(
        `http://localhost:3001/admin/services/${serviceId}/personnel`,
        { personnel_id: personnelId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setServices(s =>
          s.map(x =>
            x.id === serviceId ? { ...x, personnel_id: personnelId } : x
          )
        );
      })
      .catch(err => {
        console.error("Atama hatası:", err);
        alert("Personel atama işlemi başarısız.");
      });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Hizmetlere Personel Atama</h2>
      <table className="w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Hizmet</th>
            <th className="p-2 border">Açıklama</th>
            <th className="p-2 border">Fiyat</th>
            <th className="p-2 border">Atanan Personel</th>
          </tr>
        </thead>
        <tbody>
          {services.map(s => (
            <tr key={s.id} className="hover:bg-gray-50">
              <td className="p-2 border">{s.name}</td>
              <td className="p-2 border">{s.description || "—"}</td>
              <td className="p-2 border">+  {typeof s.standard_price === "number"
    ? s.standard_price.toFixed(2)
    : Number(s.standard_price).toFixed(2)}</td>
              <td className="p-2 border">
                <select
                  value={s.personnel_id || ""}
                  onChange={e => handleAssign(s.id, e.target.value)}
                  className="border p-1 rounded w-full"
                >
                  <option value="">— Seçilmedi —</option>
                  {personnel.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.position})
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
