import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem("trackerRecords");
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({
    modelName: "",
    fanName: "",
    ppvSent: "No",
    sextingSale: "No",
    notes: "",
    date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    localStorage.setItem("trackerRecords", JSON.stringify(records));
  }, [records]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAdd = () => {
    if (!form.modelName || !form.fanName) return;
    setRecords([...records, form]);
    setForm({
      ...form,
      fanName: "",
      notes: "",
      ppvSent: "No",
      sextingSale: "No",
    });
  };

  const handleEdit = (index, field, value) => {
    const updated = [...records];
    updated[index][field] = value;
    setRecords(updated);
  };

  const handleDelete = (index) => {
    const updated = records.filter((_, i) => i !== index);
    setRecords(updated);
  };

  const totalConvos = records.length;
  const totalSales = records.filter((r) => r.sextingSale === "Yes").length;

  return (
    <div className="container">
      <div className="tracker-card">
        <h1>Kennedy’s Tracker</h1>

        <div className="form">
          <input
            type="text"
            name="modelName"
            placeholder="Model Name"
            value={form.modelName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="fanName"
            placeholder="Fan Name / ID"
            value={form.fanName}
            onChange={handleChange}
          />
          <select name="ppvSent" value={form.ppvSent} onChange={handleChange}>
            <option>No</option>
            <option>Yes</option>
          </select>
          <select
            name="sextingSale"
            value={form.sextingSale}
            onChange={handleChange}
          >
            <option>No</option>
            <option>Yes</option>
          </select>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
          <input
            type="text"
            name="notes"
            placeholder="Notes"
            value={form.notes}
            onChange={handleChange}
          />
          <button onClick={handleAdd}>Add Record</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Model</th>
              <th>Fan</th>
              <th>PPV Sent</th>
              <th>Sale</th>
              <th>Date</th>
              <th>Notes</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, index) => (
              <tr key={index}>
                {Object.keys(r).map((field, i) => (
                  <td key={i}>
                    {field !== "date" && field !== "notes" && (
                      <input
                        type="text"
                        value={r[field]}
                        onChange={(e) =>
                          handleEdit(index, field, e.target.value)
                        }
                      />
                    )}
                    {field === "date" && (
                      <input
                        type="date"
                        value={r.date}
                        onChange={(e) =>
                          handleEdit(index, "date", e.target.value)
                        }
                      />
                    )}
                    {field === "notes" && (
                      <input
                        type="text"
                        value={r.notes}
                        onChange={(e) =>
                          handleEdit(index, "notes", e.target.value)
                        }
                      />
                    )}
                  </td>
                ))}
                <td>
                  <button onClick={() => handleDelete(index)}>✖</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="totals">
          <p>Total Conversations: {totalConvos}</p>
          <p>Total Sexting PPV Sales: {totalSales}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
