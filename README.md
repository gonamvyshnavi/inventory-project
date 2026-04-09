# Inventory Search & Management System

## 📌 Overview

This project allows users to search inventory items and manage supplier inventory data.

It consists of:

* A search feature (Part A)
* A database-driven inventory system (Part B)

---

## 🅰️ Part A: Inventory Search

### Features

* Search by product name (partial match, case-insensitive)
* Filter by category
* Filter by price range (min & max)
* Combined filters supported
* Displays results in a table
* Shows "No results found" message
* Input validation for invalid price ranges

### Tech Used

* React (Vite)
* Node.js + Express

### Search Logic

Filtering is done dynamically using query parameters:

* If a parameter is present → filter applied
* If no filters → all data returned
* Case-insensitive matching using `toLowerCase()`

---

## 🅱️ Part B: Inventory Database

### Database Used

SQLite

### Why SQLite?

SQLite was chosen for simplicity and quick setup.
In real-world applications, MySQL or PostgreSQL can be used for scalability.

---

## Database Schema

### Suppliers Table

* id (Primary Key)
* name
* city

### Inventory Table

* id (Primary Key)
* supplier_id (Foreign Key)
* product_name
* quantity
* price

### Relationship

One supplier → Many inventory items

---

## APIs

### POST /supplier

Adds a new supplier

### POST /inventory

Adds inventory for a supplier
Validations:

* Supplier must exist
* Quantity ≥ 0
* Price > 0

### GET /inventory

Returns inventory grouped by supplier and sorted by total value

---

## ⭐ Important Query

Total inventory value is calculated using:

```
quantity × price
```

SQL Query:

```
SELECT s.name,
SUM(i.quantity * i.price) AS total_value
FROM suppliers s
JOIN inventory i ON s.id = i.supplier_id
GROUP BY s.id
ORDER BY total_value DESC;
```

---

## ⚡ Optimization Suggestion

For large datasets:

* Add index on `supplier_id`
* Use pagination for search results

---

## 🚀 How to Run

### Backend

```
cd backend
node server.js
```

### Frontend

```
cd frontend
npm run dev
```

---

## 📌 Conclusion

This project demonstrates:

* Full stack development (React + Node.js)
* API design
* Database handling
* Search optimization
* Clean UI & UX
