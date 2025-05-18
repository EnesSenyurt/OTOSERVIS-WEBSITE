import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:3001/login", {
        email,
        password,
      });

      if (!res.data.token || !res.data.user) {
        throw new Error("Sunucudan geçerli kullanıcı bilgisi alınamadı.");
      }

      login(res.data.token, res.data.user); 
      navigate("/"); 
    } catch (err) {
      console.error("Giriş hatası:", err);
      setError("Giriş başarısız. Bilgileri kontrol edin.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Giriş Yap</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border"
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Giriş Yap
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <p className="text-sm text-center mt-4">
  Hesabınız yok mu?{" "}
  <a href="/register" className="text-blue-600 hover:underline">Kayıt Ol</a>
</p>

    </div>
  );
}
