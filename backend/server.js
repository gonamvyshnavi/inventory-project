const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());

// -------------------- DATABASE --------------------
const db = new sqlite3.Database("./database.db");

// Create tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    city TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id INTEGER,
    product_name TEXT,
    quantity INTEGER,
    price REAL,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
  )`);
});

// -------------------- SAMPLE DATA (PART A) --------------------
const inventoryData = [
  { id: 1, productName: "Laptop", category: "Electronics", price: 50000 },
  { id: 2, productName: "Phone", category: "Electronics", price: 20000 },
  { id: 3, productName: "Chair", category: "Furniture", price: 3000 },
  { id: 4, productName: "Table", category: "Furniture", price: 7000 },
  { id: 5, productName: "Shoes", category: "Fashion", price: 2000 },
  { id: 6, productName: "TV", category: "Electronics", price: 40000 },
  { id: 7, productName: "Sofa", category: "Furniture", price: 15000 },
  { id: 8, productName: "Watch", category: "Fashion", price: 3000 }
];

// -------------------- SEARCH API --------------------
app.get("/search", (req, res) => {
  let { q, category, minPrice, maxPrice, sort } = req.query;

  let filtered = [...inventoryData];

  // Search by name
  if (q) {
  const searchText = q.trim().toLowerCase();

  filtered = filtered.filter(item =>
    item.productName.toLowerCase().includes(searchText)
  );
}
  // Filter by category
  if (category) {
    filtered = filtered.filter(item =>
      item.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Filter by price
  if (minPrice) {
    filtered = filtered.filter(item => item.price >= Number(minPrice));
  }

  if (maxPrice) {
    filtered = filtered.filter(item => item.price <= Number(maxPrice));
  }

  // Validation
  if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
    return res.status(400).json({ message: "Invalid price range" });
  }

  // ⭐ SORTING FEATURE
  if (sort === "low") {
    filtered.sort((a, b) => a.price - b.price);
  }

  if (sort === "high") {
    filtered.sort((a, b) => b.price - a.price);
  }

  res.json(filtered);
});

// -------------------- POST SUPPLIER --------------------
app.post("/supplier", (req, res) => {
  const { name, city } = req.body;

  db.run(
    "INSERT INTO suppliers (name, city) VALUES (?, ?)",
    [name, city],
    function (err) {
      if (err) return res.status(500).json(err);

      res.json({
        id: this.lastID,
        name,
        city
      });
    }
  );
});

// -------------------- POST INVENTORY --------------------
app.post("/inventory", (req, res) => {
  const { supplier_id, product_name, quantity, price } = req.body;

  if (quantity < 0 || price <= 0) {
    return res.status(400).json({ message: "Invalid quantity or price" });
  }

  // Check supplier exists
  db.get(
    "SELECT * FROM suppliers WHERE id = ?",
    [supplier_id],
    (err, row) => {
      if (!row) {
        return res.status(400).json({ message: "Supplier not found" });
      }

      db.run(
        "INSERT INTO inventory (supplier_id, product_name, quantity, price) VALUES (?, ?, ?, ?)",
        [supplier_id, product_name, quantity, price],
        function (err) {
          if (err) return res.status(500).json(err);

          res.json({ id: this.lastID });
        }
      );
    }
  );
});

// -------------------- GET INVENTORY (IMPORTANT QUERY) --------------------
app.get("/inventory", (req, res) => {
  db.all(
    `SELECT s.name,
     SUM(i.quantity * i.price) AS total_value
     FROM suppliers s
     JOIN inventory i ON s.id = i.supplier_id
     GROUP BY s.id
     ORDER BY total_value DESC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json(err);

      res.json(rows);
    }
  );
});

// -------------------- START SERVER --------------------
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});