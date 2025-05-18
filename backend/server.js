
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "car_service_db"
});


function onlyAdmin(req, res, next) {
  
  if (req.user?.role === "admin") return next();
  return res.status(403).json({ message: "Sadece admin erişebilir." });
}



function authenticateToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}


app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Tüm alanlar gerekli" });
  try {
    const hashed = await bcrypt.hash(password, 10);
    db.query("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)", [name, email, hashed],
      (err) => {
        if (err) return res.status(500).json({ message: "Kayıt hatası" });
        res.json({ message: "Kayıt başarılı" });
      });
  } catch {
    res.status(500).json({ message: "Sunucu hatası" });
  }
});


app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ message: "Kullanıcı bulunamadı" });
    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(403).json({ message: "Şifre hatalı" });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  });
});


app.get("/vehicles", authenticateToken, (req, res) => {
  db.query("SELECT * FROM vehicles", (err, results) => {
    if (err) return res.status(500).json({ message: "Veri alınamadı" });
    res.json(results);
  });
});

app.post("/vehicles", authenticateToken, (req, res) => {
  const { owner_id, make, model, plate_number, year } = req.body;
  db.query("INSERT INTO vehicles (owner_id, make, model, plate_number, year) VALUES (?, ?, ?, ?, ?)",
    [owner_id, make, model, plate_number, year],
    (err) => {
      if (err) return res.status(500).json({ message: "Ekleme hatası" });
      res.json({ message: "Araç eklendi" });
    });
});


app.get("/profile", authenticateToken, (req, res) => {
  db.query("SELECT name, email FROM users WHERE id = ?", [req.user.id], (err, results) => {
    if (err) {
      console.error("Profil alınamadı:", err);
      return res.status(500).json({ message: "Profil alınamadı" });
    }
    if (results.length === 0) return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    res.json(results[0]);
  });
});


app.get("/parts", (req, res) => {
  db.query("SELECT * FROM vehicle_parts", (err, results) => {
    if (err) return res.status(500).json({ message: "Veri alınamadı" });
    res.json(results);
  });
});


app.get("/part-orders", authenticateToken, (req, res) => {
  db.query("SELECT * FROM part_orders", (err, results) => {
    if (err) return res.status(500).json({ message: "Veri alınamadı" });
    res.json(results);
  });
});

app.post("/part-orders", authenticateToken, (req, res) => {
  const { user_id, part_id, quantity } = req.body;

  
  db.query(
    "INSERT INTO part_orders (user_id, part_id, quantity) VALUES (?, ?, ?)",
    [user_id, part_id, quantity],
    (err) => {
      if (err) {
        console.error("Sipariş oluşturulamadı:", err);
        return res.status(500).json({ message: "Sipariş oluşturulamadı." });
      }

      
      db.query(
        "UPDATE vehicle_parts SET stock = stock - ? WHERE id = ?",
        [quantity, part_id],
        (err2, result2) => {
          if (err2) {
            console.error("Stok güncellemesi başarısız:", err2);
            
            return res
              .status(500)
              .json({ message: "Sipariş alındı, ancak stok güncellenemedi." });
          }

          return res.json({ message: "Sipariş alındı ve stok güncellendi." });
        }
      );
    }
  );
});


app.get("/services", (req, res) => {
  db.query("SELECT * FROM services", (err, results) => {
    if (err) return res.status(500).json({ message: "Veri alınamadı" });
    res.json(results);
  });
});


app.get("/service-records", authenticateToken, (req, res) => {
  const sql = `
    SELECT
      sr.id,
      CONCAT(
        v.plate_number, ' (',
        v.make, ' ', v.model, ', ',
        v.year, ')'
      ) AS vehicle,
      s.name                           AS service_name,
      DATE_FORMAT(
        sr.service_date,
        '%d.%m.%Y %H:%i:%s'
      )                                 AS service_date,
      p.name                           AS personnel_name,
      p.position                       AS personnel_position
    FROM service_records sr
    JOIN vehicles v   ON sr.vehicle_id   = v.id
    JOIN services s   ON sr.service_id   = s.id
    LEFT JOIN personnel p ON sr.personnel_id = p.id
    ORDER BY sr.service_date DESC
  `;
  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Randevular alınamadı:", err);
      return res.status(500).json({ message: "Veri alınamadı." });
    }
    res.json(rows);
  });
});


app.delete(
  "/service-records/:id",
  authenticateToken,
  onlyAdmin,
  (req, res) => {
    const { id } = req.params;
    db.query(
      "DELETE FROM service_records WHERE id = ?",
      [id],
      (err) => {
        if (err) {
          console.error("Randevu silme hatası:", err);
          return res.status(500).json({ message: "Silme başarısız." });
        }
        res.json({ message: "Randevu tamamlandı ve silindi." });
      }
    );
  }
);



app.post("/service-records", authenticateToken, (req, res) => {
  const { vehicle_id, service_id, created_by, notes, service_date } = req.body;

  
  db.query(
    "SELECT personnel_id FROM services WHERE id = ?",
    [service_id],
    (err, results) => {
      if (err) {
        console.error("Hizmet sorgu hatası:", err);
        return res.status(500).json({ message: "Sunucu hatası." });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Hizmet bulunamadı." });
      }
      const personnel_id = results[0].personnel_id;
      if (personnel_id == null) {
        return res
          .status(400)
          .json({ message: "Bu hizmete henüz personel atanmadı." });
      }

      
      const sql = `
        INSERT INTO service_records
          (vehicle_id, service_id, personnel_id, service_date, created_by, notes)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      db.query(
        sql,
        [vehicle_id, service_id, personnel_id, service_date, created_by, notes],
        (err2) => {
          if (err2) {
            console.error("Randevu eklenemedi:", err2);
            return res
              .status(500)
              .json({ message: "Randevu oluşturulamadı." });
          }
          res.json({ message: "Randevu başarıyla alındı." });
        }
      );
    }
  );
});



app.get("/personnel", (req, res) => {
  db.query("SELECT * FROM personnel", (err, results) => {
    if (err) return res.status(500).json({ message: "Veri alınamadı" });
    res.json(results);
  });
});



app.get(
  "/admin/part-orders",
  authenticateToken,
  onlyAdmin,
  (req, res) => {
    const sql = `
      SELECT 
        po.id,
        po.quantity,
        po.order_date,
        po.status,
        u.name   AS user_name,
        vp.part_name,
        vp.part_code,
        vp.cost
      FROM part_orders po
      JOIN users u ON po.user_id = u.id
      JOIN vehicle_parts vp ON po.part_id = vp.id
      ORDER BY po.order_date DESC
    `;
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ message: "Siparişler alınamadı." });
      res.json(results);
    });
  }
);



app.get(
  "/admin/services",
  authenticateToken,
  (req, res) => {
    const sql = `
      SELECT 
        s.id,
        s.name,
        s.description,
        s.standard_price,
        s.personnel_id,
        p.name AS personnel_name,
        p.position
      FROM services s
      LEFT JOIN personnel p ON s.personnel_id = p.id
      ORDER BY s.name
    `;
    db.query(sql, (err, rows) => {
      if (err) {
        console.error("Hizmet listesi alınamadı:", err);
        return res.status(500).json({ message: "Sunucu hatası." });
      }
      res.json(rows);
    });
  }
);


app.put(
  "/admin/services/:id/personnel",
  authenticateToken,
  onlyAdmin,
  (req, res) => {
    const serviceId = req.params.id;
    const { personnel_id } = req.body;
    db.query(
      "UPDATE services SET personnel_id = ? WHERE id = ?",
      [personnel_id || null, serviceId],
      (err) => {
        if (err) {
          console.error("Personel atama hatası:", err);
          return res.status(500).json({ message: "Atama başarısız." });
        }
        res.json({ message: "Personel başarıyla atandı." });
      }
    );
  }
);



app.post(
  "/admin/parts",
  authenticateToken,
  onlyAdmin,
  (req, res) => {
    const { part_name, part_code, cost, stock } = req.body;
    db.query(
      "INSERT INTO vehicle_parts (part_name, part_code, cost, stock) VALUES (?, ?, ?, ?)",
      [part_name, part_code, cost, stock],
      (err) => {
        if (err) {
          console.error("Parça ekleme hatası:", err);
          return res.status(500).json({ message: "Parça eklenemedi." });
        }
        res.json({ message: "Parça başarıyla eklendi." });
      }
    );
  }
);


app.get(
  "/admin/personeller",
  authenticateToken,
  onlyAdmin,
  (req, res) => {
    const sql = `
      SELECT 
        u.id   AS user_id,
        u.name,
        u.email,
        p.id   AS personnel_id,
        p.position
      FROM users u
      LEFT JOIN personnel p ON p.name = u.name
      ORDER BY u.name
    `;
    db.query(sql, (err, users) => {
      if (err) {
        console.error("Personel listesi alınamadı:", err);
        return res.status(500).json({ message: "Sunucu hatası." });
      }
      res.json(users);
    });
  }
);


app.post(
  "/admin/rol-ver/:id",
  authenticateToken,
  onlyAdmin,
  (req, res) => {
    const userId = req.params.id;
    const { position, contact = "" } = req.body;

    
    db.query(
      "SELECT name FROM users WHERE id = ?",
      [userId],
      (err, results) => {
        if (err || results.length === 0) {
          return res.status(404).json({ message: "Kullanıcı bulunamadı." });
        }
        const name = results[0].name;

        
        db.query(
          "INSERT INTO personnel (name, position, contact) VALUES (?, ?, ?)",
          [name, position, contact],
          (err2) => {
            if (err2) {
              console.error("Personel eklenemedi:", err2);
              return res.status(500).json({ message: "Personel eklenemedi." });
            }
            res.json({ message: "Personel başarıyla atandı." });
          }
        );
      }
    );
  }
);


app.put(
  "/admin/part-orders/:id",
  authenticateToken,
  onlyAdmin,
  (req, res) => {
    const { id } = req.params;
    db.query(
      "UPDATE part_orders SET status = 'approved' WHERE id = ?",
      [id],
      (err) => {
        if (err) return res.status(500).json({ message: "Onaylanamadı." });
        res.json({ message: "Sipariş onaylandı." });
      }
    );
  }
);


app.get(
  "/service-records",
  authenticateToken,
  (req, res) => {
    const sql = `
      SELECT 
        sr.id,
        sr.service_date,
        sr.notes,
        sr.personnel_id,
        v.plate_number, v.make, v.model, v.year,
        s.name AS service_name
      FROM service_records sr
      JOIN vehicles v ON sr.vehicle_id = v.id
      JOIN services s ON sr.service_id = s.id
      ORDER BY sr.service_date DESC
    `;
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ message: "Veri alınamadı." });
      res.json(results);
    });
  }
);


app.put(
  "/service-records/:id",
  authenticateToken,
  (req, res) => {
    const { id } = req.params;
    const { personnel_id } = req.body;
    db.query(
      "UPDATE service_records SET personnel_id = ? WHERE id = ?",
      [personnel_id, id],
      (err) => {
        if (err) return res.status(500).json({ message: "Atama başarısız." });
        res.json({ message: "Personel ataması güncellendi." });
      }
    );
  }
);


app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
