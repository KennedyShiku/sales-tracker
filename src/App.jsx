import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem("kennedy_tracker_records_v1");
    return saved ? JSON.parse(saved) : [];
  });

  const [fan, setFan] = useState("");
  const [ppvSent, setPpvSent] = useState("No");
  const [sextSale, setSextSale] = useState("No");
  const [notes, setNotes] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("kennedy_tracker_records_v1", JSON.stringify(records));
  }, [records]);

  const totals = {
    total: records.length,
    sales: records.filter((r) => r.sextSale === "Yes").length,
  };

  function addRecord(e) {
    e.preventDefault();
    if (!fan.trim()) return alert("Enter Fan Name / ID");
    const newRecord = {
      id: crypto.randomUUID(),
      fan: fan.trim(),
      ppvSent,
      sextSale,
      notes: notes.trim(),
      createdAt: new Date().toLocaleString(),
    };
    setRecords([newRecord, ...records]);
    setFan("");
    setPpvSent("No");
    setSextSale("No");
    setNotes("");
  }

  function removeRecord(id) {
    if (!confirm("Delete this record?")) return;
    setRecords(records.filter((r) => r.id !== id));
  }

  function resetAll() {
    if (!confirm("Clear ALL records? This cannot be undone.")) return;
    setRecords([]);
  }

  function exportCSV() {
    if (records.length === 0) return alert("No records to export!");
    const headers = ["Fan Name / ID", "PPV Sent?", "Sexting PPV Sale?", "Notes", "Created At"];
    const rows = records.map((r) =>
      [r.fan, r.ppvSent, r.sextSale, r.notes, r.createdAt].join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kennedy_tracker_records.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = records.filter((r) => {
    if (filter === "sales") return r.sextSale === "Yes";
    if (filter === "nonsales") return r.sextSale === "No";
    return true;
  });

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Kennedy’s Tracker</h1>
          <p>Log your shift conversations — data saves automatically.</p>
        </div>
        <div className="totals">
          <p>Total Conversations: <strong>{totals.total}</strong></p>
          <p className="sales">Total Sexting PPV Sales: <strong>{totals.sales}</strong></p>
        </div>
      </header>

      <form className="add-form" onSubmit={addRecord}>
        <input
          value={fan}
          onChange={(e) => setFan(e.target.value)}
          placeholder="Fan Name / ID"
        />
        <select value={ppvSent} onChange={(e) => setPpvSent(e.target.value)}>
          <option>No</option>
          <option>Yes</option>
        </select>
        <select value={sextSale} onChange={(e) => setSextSale(e.target.value)}>
          <option>No</option>
          <option>Yes</option>
        </select>
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
        />
        <button type="submit" className="btn add">Add</button>
      </form>

      <div className="controls">
        <div>
          <label>Filter:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="sales">Only Sales</option>
            <option value="nonsales">Only Non-Sales</option>
          </select>
        </div>
        <div className="buttons">
          <button onClick={exportCSV}>Export CSV</button>
          <button onClick={resetAll} className="danger">Reset</button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Fan</th>
            <th>PPV Sent?</th>
            <th>Sexting PPV Sale?</th>
            <th>Notes</th>
            <th>When</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="6" className="empty">No records yet — add your first one above.</td>
            </tr>
          ) : (
            filtered.map((r) => (
              <tr key={r.id}>
                <td>{r.fan}</td>
                <td>{r.ppvSent}</td>
                <td className={r.sextSale === "Yes" ? "yes" : ""}>{r.sextSale}</td>
                <td>{r.notes}</td>
                <td>{r.createdAt}</td>
                <td>
                  <button onClick={() => removeRecord(r.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
