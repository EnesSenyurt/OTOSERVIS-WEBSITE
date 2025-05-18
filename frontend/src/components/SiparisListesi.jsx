import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SiparisListesi() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
   axios.get("http://localhost:3001/admin/part-orders", {
     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
   })
      .then(res => setOrders(res.data))
      .catch(err => console.error("Sipariş alınamadı", err));
  }, []);

  const approve = async (id) => {
    await axios.put(
     `http://localhost:3001/admin/part-orders/${id}`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    setOrders(o => o.map(x => x.id === id ? { ...x, status: "approved" } : x));
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Parça Siparişleri</h2>
      <ul className="space-y-2">
        {orders.map(s => (
          <li key={s.id} className="border p-2 rounded flex justify-between">
            <div>
              #{s.id} — {s.user_name} • {s.part_name} (x{s.quantity}) • {new Date(s.order_date).toLocaleString()}
              <br/><small>Durum: {s.status}</small>
            </div>
            {s.status === "pending" && (
              <button
                onClick={() => approve(s.id)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Onayla
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
