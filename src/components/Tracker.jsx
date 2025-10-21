import React, { useEffect, useState } from "react";

/*
Tracker:
- Dropdown of today's models + "Other" with inline input.
- Fields above each input (labels).
- Price + Add Tip button that updates total (tips separate).
- Records table with inline editing + delete.
- Export CSV includes tips and totals summary.
*/

export default function Tracker({ models = [], setModels, onBack }) {
  // records persisted
  const [records, setRecords] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("kk_records")) || [];
    } catch {
      return [];
    }
  });

  const [selectedModel, setSelectedModel] = useState(models[0] || "");
  const [otherModel, setOtherModel] = useState("");
  const [fanName, setFanName] = useState("");
  const [ppvSent, setPpvSent] = useState("No");
  const [sale, setSale] = useState("No");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  // tips stored separately
  const [tipInput, setTipInput] = useState("");
  const [tipsTotal, setTipsTotal] = useState(() => {
    const n = parseFloat(localStorage.getItem("kk_tips"));
    return Number.isFinite(n) ? n : 0;
  });

  // persist records + tips
  useEffect(() => {
    localStorage.setItem("kk_records", JSON.stringify(records));
  }, [records]);
  useEffect(() => {
    localStorage.setItem("kk_tips", String(tipsTotal));
  }, [tipsTotal]);

  // Add a record
  function addRecord() {
    const model =
      selectedModel === "Other" ? (otherModel || "").trim() : selectedModel;
    if (!model) return alert("Select or type a model name.");
    if (!fanName.trim()) return alert("Enter fan name / ID.");
    const p = parseFloat(price) || 0;
    const newRec = {
      id: Date.now().toString(36),
      model,
      fanName: fanName.trim(),
      ppvSent,
      sale,
      price: Number.isFinite(p) ? +p.toFixed(2) : 0,
      notes: notes.trim(),
      date: date || new Date().toISOString().slice(0, 10),
    };
    setRecords([newRec, ...records]);
    // clear form (keep selectedModel)
    setFanName("");
    setPpvSent("No");
    setSale("No");
    setPrice("");
    setNotes("");
  }

  // Add tip (adds only to tipsTotal)
  function addTip() {
    const t = parseFloat(tipInput);
    if (!Number.isFinite(t) || t <= 0) return;
    setTipsTotal((s) => +(s + t).toFixed(2));
    setTipInput("");
  }

  // Edit record inline
  function editRecord(id, field, value) {
    setRecords(
      records.map((r) =>
        r.id === id
          ? { ...r, [field]: field === "price" ? Number(value || 0) : value }
          : r
      )
    );
  }

  function deleteRecord(id) {
    if (!confirm("Delete this record?")) return;
    setRecords(records.filter((r) => r.id !== id));
  }

  function resetRecords() {
    if (!confirm("Clear all records?")) return;
    setRecords([]);
    setTipsTotal(0);
    localStorage.removeItem("kk_records");
    localStorage.removeItem("kk_tips");
  }

  // totals
  //   const totalPPV = records.reduce((s, r) => s + (parseFloat(r.price) || 0), 0);
  //   const totalSales = records.filter(r => r.sale === "Yes").length;
  //   const totalConvos = records.length;
  //   const totalEarnings = +(totalPPV + tipsTotal).toFixed(2);
  // totals
  const totalPPV = records
    .filter((r) => r.sale === "Yes") // only count when sale is Yes
    .reduce((s, r) => s + (parseFloat(r.price) || 0), 0);

  const totalSales = records.filter((r) => r.sale === "Yes").length;
  const totalConvos = records.length;
  const totalEarnings = +(totalPPV + tipsTotal).toFixed(2);

  // export CSV (records + tips summary)
  function exportCSV() {
    const headers = [
      "Model",
      "Fan Name",
      "PPV Sent",
      "Sale",
      "Price",
      "Notes",
      "Date",
    ];
    const rows = records.map((r) =>
      [
        `"${r.model.replace(/"/g, '""')}"`,
        `"${r.fanName.replace(/"/g, '""')}"`,
        r.ppvSent,
        r.sale,
        r.price,
        `"${(r.notes || "").replace(/"/g, '""')}"`,
        r.date,
      ].join(",")
    );
    const summary = ["", "", "", "", "", "", ""];
    const csv = [
      headers.join(","),
      ...rows,
      "",
      `Tips,${tipsTotal.toFixed(2)}`,
      `Total Earnings,${totalEarnings.toFixed(2)}`,
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kennedy_tracker.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  // allow quick adding of models if user wants
  function addModelQuick() {
    const name = prompt("Add a new model name:");
    if (!name) return;
    if (!models.includes(name)) {
      const next = [...models, name];
      setModels(next);
      localStorage.setItem("kk_models", JSON.stringify(next));
      setSelectedModel(name);
    } else {
      setSelectedModel(name);
    }
  }

  return (
    <div className="panel">
      <h1 className="panel-title">Kennedy’s Tracker</h1>
      <p className="panel-sub">
        Quickly log PPV sales — everything centered and tidy.
      </p>

      <div className="form-grid">
        <div className="field">
          <label className="label">Model</label>
          <select
            className="input"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="">-- Select model --</option>
            {models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
            <option value="Other">Other (type below)</option>
          </select>
          {selectedModel === "Other" && (
            <input
              className="input mt-sm"
              placeholder="Type model name"
              value={otherModel}
              onChange={(e) => setOtherModel(e.target.value)}
            />
          )}
          <button
            className="btn ghost"
            onClick={addModelQuick}
            style={{ marginTop: 8 }}
          >
            + Quick add model
          </button>
        </div>

        <div className="field">
          <label className="label">Fan Name / ID</label>
          <input
            className="input"
            value={fanName}
            onChange={(e) => setFanName(e.target.value)}
            placeholder="fan username or ID"
          />
        </div>

        <div className="field">
          <label className="label">PPV Price ($)</label>
          <input
            className="input"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="amount"
          />
        </div>

        <div className="field">
          <label className="label">PPV Sent?</label>
          <select
            className="input"
            value={ppvSent}
            onChange={(e) => setPpvSent(e.target.value)}
          >
            <option>No</option>
            <option>Yes</option>
          </select>
        </div>

        <div className="field">
          <label className="label">Sexting PPV Sale?</label>
          <select
            className="input"
            value={sale}
            onChange={(e) => setSale(e.target.value)}
          >
            <option>No</option>
            <option>Yes</option>
          </select>
        </div>

        <div className="field">
          <label className="label">Date</label>
          <input
            className="input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="field full">
          <label className="label">Notes</label>
          <input
            className="input"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="optional notes"
          />
        </div>

        <div className="field actions full">
          <button className="btn primary" onClick={addRecord}>
            Add Record
          </button>
          <button
            className="btn gray"
            onClick={() => {
              setFanName("");
              setPrice("");
              setPpvSent("No");
              setSale("No");
              setNotes("");
            }}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="tips-block">
        <div className="tips-inner">
          <div>
            <label className="label">Tip Amount ($)</label>
            <input
              className="input small"
              type="number"
              step="0.01"
              value={tipInput}
              onChange={(e) => setTipInput(e.target.value)}
              placeholder="e.g. 5.00"
            />
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <button className="btn success" onClick={addTip}>
              Add Tip
            </button>
            <div className="muted">
              Tips total: <strong>${tipsTotal.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="table-wrap">
        <table className="records-table" cellSpacing="0">
          <thead>
            <tr>
              <th>Model</th>
              <th>Fan</th>
              <th>PPV Sent</th>
              <th>Sale</th>
              <th>Price</th>
              <th>Notes</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 && (
              <tr>
                <td colSpan={8} className="muted">
                  No records yet
                </td>
              </tr>
            )}
            {records.map((r) => (
              <tr key={r.id}>
                <td>
                  <input
                    className="table-input"
                    value={r.model}
                    onChange={(e) => editRecord(r.id, "model", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="table-input"
                    value={r.fanName}
                    onChange={(e) =>
                      editRecord(r.id, "fanName", e.target.value)
                    }
                  />
                </td>
                <td>
                  <select
                    className="table-input"
                    value={r.ppvSent}
                    onChange={(e) =>
                      editRecord(r.id, "ppvSent", e.target.value)
                    }
                  >
                    <option>No</option>
                    <option>Yes</option>
                  </select>
                </td>
                <td>
                  <select
                    className="table-input"
                    value={r.sale}
                    onChange={(e) => editRecord(r.id, "sale", e.target.value)}
                  >
                    <option>No</option>
                    <option>Yes</option>
                  </select>
                </td>
                <td>
                  <input
                    className="table-input"
                    type="number"
                    value={r.price}
                    onChange={(e) => editRecord(r.id, "price", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="table-input"
                    value={r.notes}
                    onChange={(e) => editRecord(r.id, "notes", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="table-input"
                    type="date"
                    value={r.date}
                    onChange={(e) => editRecord(r.id, "date", e.target.value)}
                  />
                </td>
                <td>
                  <button
                    className="btn link"
                    onClick={() => deleteRecord(r.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="summary">
        <div>
          Conversations: <strong>{totalConvos}</strong>
        </div>
        <div>
          Sales: <strong>{totalSales}</strong>
        </div>
        <div>
          PPV Earnings: <strong>${totalPPV.toFixed(2)}</strong>
        </div>
        <div>
          Tips: <strong>${tipsTotal.toFixed(2)}</strong>
        </div>
        <div className="big">
          Total Earnings: <strong>${totalEarnings.toFixed(2)}</strong>
        </div>
      </div>

      <div className="panel-actions">
        <button className="btn gray" onClick={exportCSV}>
          Export CSV
        </button>
        <button className="btn danger" onClick={resetRecords}>
          Reset Records & Tips
        </button>
        <button className="btn link" onClick={onBack}>
          ← Back to Models
        </button>
      </div>
    </div>
  );
}
