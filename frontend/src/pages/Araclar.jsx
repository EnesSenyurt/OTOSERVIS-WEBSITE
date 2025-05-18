import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function ParcaSatinal() {
  const { user, token } = useAuth();
  const [parts, setParts] = useState([]);
  const [qty, setQty] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:3001/parts")
      .then((res) => setParts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleOrder = async (partId) => {
    const quantity = parseInt(qty[partId], 10) || 1;
    try {
      await axios.post(
        "http://localhost:3001/part-orders",
        { user_id: user.id, part_id: partId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Siparişiniz alındı.");

      
      setParts((prev) =>
        prev.map((p) =>
          p.id === partId ? { ...p, stock: p.stock - quantity } : p
        )
      );
      setQty((prev) => ({ ...prev, [partId]: "" }));
    } catch (err) {
      console.error(err);
      alert("Sipariş verilemedi.");
    }
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <h2 className="text-2xl text-blue-400 font-bold mb-4">Parça Satın Al</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {parts.map((p) => (
          <div
            key={p.id}
            className="bg-gray-900 border border-blue-600 rounded-2xl shadow-lg p-6 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl text-white font-semibold mb-2">
                {p.part_name}
              </h3>
              <p className="text-sm text-blue-300 mb-1">Kod: {p.part_code}</p>
              <p className="text-sm text-blue-300 mb-1">
                Fiyat: {p.cost.toLocaleString()} ₺
              </p>
              <p className="text-sm text-white mb-3">Stok: {p.stock}</p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={p.stock}
                value={qty[p.id] || ""}
                onChange={(e) =>
                  setQty((prev) => ({
                    ...prev,
                    [p.id]: e.target.value,
                  }))
                }
                placeholder="Adet"
                className="w-16 bg-gray-800 text-white border border-blue-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleOrder(p.id)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl py-2 transition"
              >
                Sipariş Ver
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
