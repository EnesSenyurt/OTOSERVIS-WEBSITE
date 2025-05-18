import React, { useState } from "react";
import PersonelListesi from "../components/PersonelListesi";
import AracEkle from "../components/AracEkle";
import SiparisListesi from "../components/SiparisListesi";
import RandevuOnayla from "../components/RandevuOnayla";

export default function AdminPanel() {
  const [tab, setTab] = useState("personel");

  const tabStyle = (key) =>
    `px-5 py-2 rounded-md font-medium transition-colors duration-200
     ${tab === key
       ? "bg-blue-500 text-white shadow"
       : "bg-white text-blue-600 border border-blue-300 hover:bg-blue-100"}`;

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">
          Admin Paneli
        </h1>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button onClick={() => setTab("personel")} className={tabStyle("personel")}>
            👥 Personeller
          </button>
          <button onClick={() => setTab("arac")} className={tabStyle("arac")}>
            🧩 Araç Parçası Ekle
          </button>
          <button onClick={() => setTab("siparis")} className={tabStyle("siparis")}>
            🧾 Siparişler
          </button>
          <button onClick={() => setTab("randevu")} className={tabStyle("randevu")}>
            📅 Randevular
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-blue-100">
          {tab === "personel" && <PersonelListesi />}
          {tab === "arac" && <AracEkle />}
          {tab === "siparis" && <SiparisListesi />}
          {tab === "randevu" && <RandevuOnayla />}
        </div>
      </div>
    </div>
  );
}
