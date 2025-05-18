import React, { useState } from "react";
import axios from "axios";

export default function ParcaEkle() {
  const [form, setForm] = useState({
    part_name: "", part_code: "", cost: "", stock: ""
  });
  const [msg, setMsg] = useState("");

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3001/admin/parts",
        form,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setMsg("Parça başarıyla eklendi.");
      setForm({ part_name:"", part_code:"", cost:"", stock:"" });
    } catch (err) {
      console.error(err);
      setMsg("Hata oluştu.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="part_name" placeholder="Parça Adı"  onChange={handleChange} value={form.part_name} required className="border p-2 w-full"/>
      <input name="part_code" placeholder="Kod"        onChange={handleChange} value={form.part_code} required className="border p-2 w-full"/>
      <input name="cost"      placeholder="Maliyet"    onChange={handleChange} value={form.cost}      required className="border p-2 w-full"/>
      <input name="stock"     placeholder="Stok Adedi" onChange={handleChange} value={form.stock}     required className="border p-2 w-full"/>
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Ekle
      </button>
      {msg && <p className="mt-2">{msg}</p>}
    </form>
  );
}
