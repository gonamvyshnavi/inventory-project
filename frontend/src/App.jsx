import { useState } from "react";

function App() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = async () => {
    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
      alert("Minimum price cannot be greater than maximum price");
      return;
    }

    setLoading(true);

    const params = new URLSearchParams();
    if (q) params.append("q", q);
    if (category) params.append("category", category);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (sort) params.append("sort", sort);

    try {
      const res = await fetch(`http://localhost:5000/search?${params}`);
      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      setResults(data);
    } catch (error) {
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>Zeerostock's Inventory Search</h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        {/* SEARCH INPUT + SUGGESTIONS */}
        <div style={{ position: "relative" }}>
          <input
            placeholder="Search product"
            value={q}
            onChange={(e) => {
              const value = e.target.value;
              setQ(value);

              if (value.length > 0) {
                const filtered = [
                  "Laptop",
                  "Phone",
                  "Chair",
                  "Table",
                  "Shoes",
                  "TV",
                  "Sofa",
                  "Watch",
                ].filter((item) =>
                  item.toLowerCase().includes(value.toLowerCase())
                );

                setSuggestions(filtered);
              } else {
                setSuggestions([]);
              }
            }}
            style={{
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              width: "200px",
            }}
          />

          {/* CLEAN SUGGESTIONS (NO BOX) */}
          {suggestions.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "40px",
                left: "0",
                width: "100%",
                zIndex: 1000,
              }}
            >
              {suggestions.map((item, index) => (
                <div
                  key={index}
                  style={{
                    padding: "6px 8px",
                    cursor: "pointer",
                    color: "#bbb",
                  }}
                  onClick={() => {
                    setQ(item);
                    setSuggestions([]);
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = "#bbb";
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        <select onChange={(e) => setCategory(e.target.value)}>
          <option value="">All</option>
          <option>Electronics</option>
          <option>Furniture</option>
          <option>Fashion</option>
        </select>

        <input
          type="number"
          placeholder="Min Price"
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max Price"
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <select onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>
        </select>

        <button onClick={handleSearch}>Search</button>
      </div>

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

      {!loading && results.length === 0 && (
        <p style={{ textAlign: "center", color: "gray" }}>
          No products found
        </p>
      )}

      {results.length > 0 && (
        <table border="1" style={{ margin: "auto" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.productName}</td>
                <td>{item.category}</td>
                <td>{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;