import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CarIcon, CalendarCheck2Icon, BoxIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-purple-100 p-8">
      {/* Başlık */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-extrabold text-blue-800 mb-4">
          Araç Servis Otomasyonu
        </h1>
        <p className="text-xl text-blue-600">
          Araçlarınızı yönetin, randevunuzu ayarlayın ve parça siparişi verin.
        </p>
      </motion.div>

      {/* İşlem Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Araçlarım */}
        <motion.div
          whileHover={{ scale: 1.04 }}
          className="transition-transform"
        >
          <Card className="bg-white rounded-xl shadow-md hover:shadow-2xl overflow-hidden">
            <CardContent className="p-8 text-center">
              <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-blue-100">
                <CarIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-blue-800 mb-2">
                Araçlarım
              </h2>
              <p className="text-blue-600 mb-6">
                Var olan araçlarınızı görüntüleyin ve yeni araç ekleyin.
              </p>
              <Link to="/profile">
                <Button className="px-6 py-2">Araçlarımı Gör</Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Randevu Al */}
        <motion.div
          whileHover={{ scale: 1.04 }}
          className="transition-transform"
        >
          <Card className="bg-white rounded-xl shadow-md hover:shadow-2xl overflow-hidden">
            <CardContent className="p-8 text-center">
              <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-purple-100">
                <CalendarCheck2Icon className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-semibold text-purple-800 mb-2">
                Randevu Al
              </h2>
              <p className="text-purple-600 mb-6">
                Araç servisi için tarih ve saati kolayca seçin.
              </p>
              <Link to="/randevu-al">
                <Button className="px-6 py-2">Randevu Al</Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Parça Satın Al */}
        <motion.div
          whileHover={{ scale: 1.04 }}
          className="transition-transform"
        >
          <Card className="bg-white rounded-xl shadow-md hover:shadow-2xl overflow-hidden">
            <CardContent className="p-8 text-center">
              <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-green-100">
                <BoxIcon className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-green-800 mb-2">
                Parça Satın Al
              </h2>
              <p className="text-green-600 mb-6">
                İhtiyacınız olan araç parçalarını sipariş edin.
              </p>
              <Link to="/araclar">
                <Button className="px-6 py-2">Parça Satın Al</Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
