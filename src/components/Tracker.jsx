// import React, { useEffect, useState } from "react";

// /*
// Tracker:
// - Dropdown of today's models + "Other" with inline input.
// - Fields above each input (labels).
// - Price + Add Tip button that updates total (tips separate).
// - Records table with inline editing + delete.
// - Export CSV includes tips and totals summary.
// */

// export default function Tracker({ models = [], setModels, onBack }) {
//   // records persisted
//   const [records, setRecords] = useState(() => {
//     try {
//       return JSON.parse(localStorage.getItem("kk_records")) || [];
//     } catch {
//       return [];
//     }
//   });

//   const [selectedModel, setSelectedModel] = useState(models[0] || "");
//   const [otherModel, setOtherModel] = useState("");
//   const [fanName, setFanName] = useState("");
//   const [ppvSent, setPpvSent] = useState("No");
//   const [sale, setSale] = useState("No");
//   const [price, setPrice] = useState("");
//   const [notes, setNotes] = useState("");
//   const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

//   // tips stored separately
//   const [tipInput, setTipInput] = useState("");
//   const [tipsTotal, setTipsTotal] = useState(() => {
//     const n = parseFloat(localStorage.getItem("kk_tips"));
//     return Number.isFinite(n) ? n : 0;
//   });

//   // persist records + tips
//   useEffect(() => {
//     localStorage.setItem("kk_records", JSON.stringify(records));
//   }, [records]);
//   useEffect(() => {
//     localStorage.setItem("kk_tips", String(tipsTotal));
//   }, [tipsTotal]);

//   // Add a record
//   function addRecord() {
//     const model =
//       selectedModel === "Other" ? (otherModel || "").trim() : selectedModel;
//     if (!model) return alert("Select or type a model name.");
//     if (!fanName.trim()) return alert("Enter fan name / ID.");
//     const p = parseFloat(price) || 0;
//     const newRec = {
//       id: Date.now().toString(36),
//       model,
//       fanName: fanName.trim(),
//       ppvSent,
//       sale,
//       price: Number.isFinite(p) ? +p.toFixed(2) : 0,
//       notes: notes.trim(),
//       date: date || new Date().toISOString().slice(0, 10),
//     };
//     setRecords([newRec, ...records]);
//     // clear form (keep selectedModel)
//     setFanName("");
//     setPpvSent("No");
//     setSale("No");
//     setPrice("");
//     setNotes("");
//   }

//   // Add tip (adds only to tipsTotal)
//   function addTip() {
//     const t = parseFloat(tipInput);
//     if (!Number.isFinite(t) || t <= 0) return;
//     setTipsTotal((s) => +(s + t).toFixed(2));
//     setTipInput("");
//   }

//   // Edit record inline
//   function editRecord(id, field, value) {
//     setRecords(
//       records.map((r) =>
//         r.id === id
//           ? { ...r, [field]: field === "price" ? Number(value || 0) : value }
//           : r
//       )
//     );
//   }

//   function deleteRecord(id) {
//     if (!confirm("Delete this record?")) return;
//     setRecords(records.filter((r) => r.id !== id));
//   }

//   function resetRecords() {
//     if (!confirm("Clear all records?")) return;
//     setRecords([]);
//     setTipsTotal(0);
//     localStorage.removeItem("kk_records");
//     localStorage.removeItem("kk_tips");
//   }

//   // totals
//   //   const totalPPV = records.reduce((s, r) => s + (parseFloat(r.price) || 0), 0);
//   //   const totalSales = records.filter(r => r.sale === "Yes").length;
//   //   const totalConvos = records.length;
//   //   const totalEarnings = +(totalPPV + tipsTotal).toFixed(2);
//   // totals
//   const totalPPV = records
//     .filter((r) => r.sale === "Yes") // only count when sale is Yes
//     .reduce((s, r) => s + (parseFloat(r.price) || 0), 0);

//   const totalSales = records.filter((r) => r.sale === "Yes").length;
//   const totalConvos = records.length;
//   const totalEarnings = +(totalPPV + tipsTotal).toFixed(2);

//   // export CSV (records + tips summary)
//   function exportCSV() {
//     const headers = [
//       "Model",
//       "Fan Name",
//       "PPV Sent",
//       "Sale",
//       "Price",
//       "Notes",
//       "Date",
//     ];
//     const rows = records.map((r) =>
//       [
//         `"${r.model.replace(/"/g, '""')}"`,
//         `"${r.fanName.replace(/"/g, '""')}"`,
//         r.ppvSent,
//         r.sale,
//         r.price,
//         `"${(r.notes || "").replace(/"/g, '""')}"`,
//         r.date,
//       ].join(",")
//     );
//     const summary = ["", "", "", "", "", "", ""];
//     const csv = [
//       headers.join(","),
//       ...rows,
//       "",
//       `Tips,${tipsTotal.toFixed(2)}`,
//       `Total Earnings,${totalEarnings.toFixed(2)}`,
//     ].join("\n");
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "kennedy_tracker.csv";
//     a.click();
//     URL.revokeObjectURL(url);
//   }

//   // allow quick adding of models if user wants
//   function addModelQuick() {
//     const name = prompt("Add a new model name:");
//     if (!name) return;
//     if (!models.includes(name)) {
//       const next = [...models, name];
//       setModels(next);
//       localStorage.setItem("kk_models", JSON.stringify(next));
//       setSelectedModel(name);
//     } else {
//       setSelectedModel(name);
//     }
//   }

//   return (
//     <div className="panel">
//       <h1 className="panel-title">Kennedy’s Tracker</h1>
//       <p className="panel-sub">
//         Quickly log PPV sales — everything centered and tidy.
//       </p>

//       <div className="form-grid">
//         <div className="field">
//           <label className="label">Model</label>
//           <select
//             className="input"
//             value={selectedModel}
//             onChange={(e) => setSelectedModel(e.target.value)}
//           >
//             <option value="">-- Select model --</option>
//             {models.map((m) => (
//               <option key={m} value={m}>
//                 {m}
//               </option>
//             ))}
//             <option value="Other">Other (type below)</option>
//           </select>
//           {selectedModel === "Other" && (
//             <input
//               className="input mt-sm"
//               placeholder="Type model name"
//               value={otherModel}
//               onChange={(e) => setOtherModel(e.target.value)}
//             />
//           )}
//           <button
//             className="btn ghost"
//             onClick={addModelQuick}
//             style={{ marginTop: 8 }}
//           >
//             + Quick add model
//           </button>
//         </div>

//         <div className="field">
//           <label className="label">Fan Name / ID</label>
//           <input
//             className="input"
//             value={fanName}
//             onChange={(e) => setFanName(e.target.value)}
//             placeholder="fan username or ID"
//           />
//         </div>

//         <div className="field">
//           <label className="label">PPV Price ($)</label>
//           <input
//             className="input"
//             type="number"
//             step="0.01"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//             placeholder="amount"
//           />
//         </div>

//         <div className="field">
//           <label className="label">PPV Sent?</label>
//           <select
//             className="input"
//             value={ppvSent}
//             onChange={(e) => setPpvSent(e.target.value)}
//           >
//             <option>No</option>
//             <option>Yes</option>
//           </select>
//         </div>

//         <div className="field">
//           <label className="label">Sexting PPV Sale?</label>
//           <select
//             className="input"
//             value={sale}
//             onChange={(e) => setSale(e.target.value)}
//           >
//             <option>No</option>
//             <option>Yes</option>
//           </select>
//         </div>

//         <div className="field">
//           <label className="label">Date</label>
//           <input
//             className="input"
//             type="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//           />
//         </div>

//         <div className="field full">
//           <label className="label">Notes</label>
//           <input
//             className="input"
//             value={notes}
//             onChange={(e) => setNotes(e.target.value)}
//             placeholder="optional notes"
//           />
//         </div>

//         <div className="field actions full">
//           <button className="btn primary" onClick={addRecord}>
//             Add Record
//           </button>
//           <button
//             className="btn gray"
//             onClick={() => {
//               setFanName("");
//               setPrice("");
//               setPpvSent("No");
//               setSale("No");
//               setNotes("");
//             }}
//           >
//             Clear
//           </button>
//         </div>
//       </div>

//       <div className="tips-block">
//         <div className="tips-inner">
//           <div>
//             <label className="label">Tip Amount ($)</label>
//             <input
//               className="input small"
//               type="number"
//               step="0.01"
//               value={tipInput}
//               onChange={(e) => setTipInput(e.target.value)}
//               placeholder="e.g. 5.00"
//             />
//           </div>
//           <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
//             <button className="btn success" onClick={addTip}>
//               Add Tip
//             </button>
//             <div className="muted">
//               Tips total: <strong>${tipsTotal.toFixed(2)}</strong>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="table-wrap">
//         <table className="records-table" cellSpacing="0">
//           <thead>
//             <tr>
//               <th>Model</th>
//               <th>Fan</th>
//               <th>PPV Sent</th>
//               <th>Sale</th>
//               <th>Price</th>
//               <th>Notes</th>
//               <th>Date</th>
//               <th></th>
//             </tr>
//           </thead>
//           <tbody>
//             {records.length === 0 && (
//               <tr>
//                 <td colSpan={8} className="muted">
//                   No records yet
//                 </td>
//               </tr>
//             )}
//             {records.map((r) => (
//               <tr key={r.id}>
//                 <td>
//                   <input
//                     className="table-input"
//                     value={r.model}
//                     onChange={(e) => editRecord(r.id, "model", e.target.value)}
//                   />
//                 </td>
//                 <td>
//                   <input
//                     className="table-input"
//                     value={r.fanName}
//                     onChange={(e) =>
//                       editRecord(r.id, "fanName", e.target.value)
//                     }
//                   />
//                 </td>
//                 <td>
//                   <select
//                     className="table-input"
//                     value={r.ppvSent}
//                     onChange={(e) =>
//                       editRecord(r.id, "ppvSent", e.target.value)
//                     }
//                   >
//                     <option>No</option>
//                     <option>Yes</option>
//                   </select>
//                 </td>
//                 <td>
//                   <select
//                     className="table-input"
//                     value={r.sale}
//                     onChange={(e) => editRecord(r.id, "sale", e.target.value)}
//                   >
//                     <option>No</option>
//                     <option>Yes</option>
//                   </select>
//                 </td>
//                 <td>
//                   <input
//                     className="table-input"
//                     type="number"
//                     value={r.price}
//                     onChange={(e) => editRecord(r.id, "price", e.target.value)}
//                   />
//                 </td>
//                 <td>
//                   <input
//                     className="table-input"
//                     value={r.notes}
//                     onChange={(e) => editRecord(r.id, "notes", e.target.value)}
//                   />
//                 </td>
//                 <td>
//                   <input
//                     className="table-input"
//                     type="date"
//                     value={r.date}
//                     onChange={(e) => editRecord(r.id, "date", e.target.value)}
//                   />
//                 </td>
//                 <td>
//                   <button
//                     className="btn link"
//                     onClick={() => deleteRecord(r.id)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="summary">
//         <div>
//           Conversations: <strong>{totalConvos}</strong>
//         </div>
//         <div>
//           Sales: <strong>{totalSales}</strong>
//         </div>
//         <div>
//           PPV Earnings: <strong>${totalPPV.toFixed(2)}</strong>
//         </div>
//         <div>
//           Tips: <strong>${tipsTotal.toFixed(2)}</strong>
//         </div>
//         <div className="big">
//           Total Earnings: <strong>${totalEarnings.toFixed(2)}</strong>
//         </div>
//       </div>

//       <div className="panel-actions">
//         <button className="btn gray" onClick={exportCSV}>
//           Export CSV
//         </button>
//         <button className="btn danger" onClick={resetRecords}>
//           Reset Records & Tips
//         </button>
//         <button className="btn link" onClick={onBack}>
//           ← Back to Models
//         </button>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/*
Tracker:
- Dropdown of today's models + "Other" with inline input.
- Fields above each input (labels).
- Price + Add Tip button that updates total (tips separate).
- Records table with inline editing + delete.
- Export CSV includes tips and totals summary.
- Thin horizontal daily goal progress bar (reads kk_goal from localStorage).
- Wizard levels with toasts for level-ups.
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

  // load goal from localStorage (set in ModelSetup)
  const [goal, setGoal] = useState(() => {
    const g = localStorage.getItem("kk_goal");
    const n = parseFloat(g);
    return Number.isFinite(n) ? n : 0;
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
    const model = selectedModel === "Other" ? (otherModel || "").trim() : selectedModel;
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
    setRecords(records.map(r => r.id === id ? { ...r, [field]: field === "price" ? Number(value || 0) : value } : r));
  }

  function deleteRecord(id) {
    if (!confirm("Delete this record?")) return;
    setRecords(records.filter(r => r.id !== id));
  }

  function resetRecords() {
    if (!confirm("Reset your day? This clears all records, tips, and your goal.")) return;
    setRecords([]);
    setTipsTotal(0);
    localStorage.removeItem("kk_records");
    localStorage.removeItem("kk_tips");
    localStorage.removeItem("kk_goal");
    setGoal(0);
    setModels([]);
    onBack();
  }

  // Totals (only count price if sale = "Yes")
  const totalPPV = records.reduce((s, r) => s + (r.sale === "Yes" ? (parseFloat(r.price) || 0) : 0), 0);
  const totalSales = records.filter(r => r.sale === "Yes").length;
  const totalConvos = records.length;
  const totalEarnings = +(totalPPV + tipsTotal).toFixed(2);

  const progress = goal > 0 ? Math.min((totalEarnings / goal) * 100, 100) : 0;

  // Wizard level system
  function getWizardLevel(total) {
    if (total >= 3000) return { level: 6, title: "Master Wizard 🌟", next: null };
    if (total >= 2000) return { level: 5, title: "Grand Mage ⚡", next: 3000 };
    if (total >= 1000) return { level: 4, title: "Sorcerer 🧙", next: 2000 };
    if (total >= 500) return { level: 3, title: "Enchanter 🔮", next: 1000 };
    if (total >= 100) return { level: 2, title: "Spellcaster ✨", next: 500 };
    return { level: 1, title: "Novice Wizard 🪄", next: 100 };
  }

  const { level, title, next } = getWizardLevel(totalEarnings);

  // Always show toast when total crosses a new level
  const [prevLevel, setPrevLevel] = useState(level);
  useEffect(() => {
    if (level > prevLevel) {
      toast.success(`🎉 Level Up! You’ve become a ${title}`, {
        position: "top-center",
        autoClose: 2500,
        theme: "colored",
        style: { backgroundColor: "var(--accent)", color: "white", fontWeight: 600 },
      });
      setPrevLevel(level);
    }
  }, [level]);

  // export CSV
  function exportCSV() {
    const headers = ["Model", "Fan Name", "PPV Sent", "Sale", "Price", "Notes", "Date"];
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

  // allow quick adding of models
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
      <p className="panel-sub">Quickly log PPV sales — everything centered and tidy.</p>

      {/* Wizard Rank Display */}
      <div style={{
        marginTop: "10px",
        marginBottom: "10px",
        padding: "8px 10px",
        borderRadius: "8px",
        background: "var(--glass)",
        textAlign: "center",
        fontWeight: "500"
      }}>
        <div>{title} — Level {level}</div>
        {next && (
          <div style={{ fontSize: "12px", color: "var(--muted)" }}>
            ${Math.max(0, next - totalEarnings).toFixed(2)} until next level
          </div>
        )}
      </div>

      {/* rest of your form unchanged */}
      <div className="form-grid">
        <div className="field">
          <label className="label">Model</label>
          <select className="input" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
            <option value="">-- Select model --</option>
            {models.map(m => <option key={m} value={m}>{m}</option>)}
            <option value="Other">Other (type below)</option>
          </select>
          {selectedModel === "Other" && (
            <input className="input mt-sm" placeholder="Type model name" value={otherModel} onChange={e=>setOtherModel(e.target.value)} />
          )}
          <button className="btn ghost" onClick={addModelQuick} style={{marginTop:8}}>+ Quick add model</button>
        </div>

        <div className="field">
          <label className="label">Fan Name / ID</label>
          <input className="input" value={fanName} onChange={(e)=>setFanName(e.target.value)} placeholder="fan username or ID" />
        </div>

        <div className="field">
          <label className="label">PPV Price ($)</label>
          <input className="input" type="number" step="0.01" value={price} onChange={e=>setPrice(e.target.value)} placeholder="amount" />
        </div>

        <div className="field">
          <label className="label">PPV Sent?</label>
          <select className="input" value={ppvSent} onChange={e=>setPpvSent(e.target.value)}>
            <option>No</option>
            <option>Yes</option>
          </select>
        </div>

        <div className="field">
          <label className="label">Sexting PPV Sale?</label>
          <select className="input" value={sale} onChange={e=>setSale(e.target.value)}>
            <option>No</option>
            <option>Yes</option>
          </select>
        </div>

        <div className="field">
          <label className="label">Date</label>
          <input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} />
        </div>

        <div className="field full">
          <label className="label">Notes</label>
          <input className="input" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="optional notes" />
        </div>

        <div className="field actions full">
          <button className="btn primary" onClick={addRecord}>Add Record</button>
          <button className="btn gray" onClick={()=>{ setFanName(""); setPrice(""); setPpvSent("No"); setSale("No"); setNotes(""); }}>Clear</button>
        </div>
      </div>

      <div className="tips-block">
        <div className="tips-inner">
          <div>
            <label className="label">Tip Amount ($)</label>
            <input className="input small" type="number" step="0.01" value={tipInput} onChange={e=>setTipInput(e.target.value)} placeholder="e.g. 5.00" />
          </div>
          <div style={{display:"flex", gap:8, alignItems:"flex-end"}}>
            <button className="btn success" onClick={addTip}>Add Tip</button>
            <div className="muted">Tips total: <strong>${tipsTotal.toFixed(2)}</strong></div>
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
              <tr><td colSpan={8} className="muted">No records yet</td></tr>
            )}
            {records.map(r => (
              <tr key={r.id}>
                <td><input className="table-input" value={r.model} onChange={e=>editRecord(r.id,'model', e.target.value)} /></td>
                <td><input className="table-input" value={r.fanName} onChange={e=>editRecord(r.id,'fanName', e.target.value)} /></td>
                <td>
                  <select className="table-input" value={r.ppvSent} onChange={e=>editRecord(r.id,'ppvSent', e.target.value)}>
                    <option>No</option><option>Yes</option>
                  </select>
                </td>
                <td>
                  <select className="table-input" value={r.sale} onChange={e=>editRecord(r.id,'sale', e.target.value)}>
                    <option>No</option><option>Yes</option>
                  </select>
                </td>
                <td><input className="table-input" type="number" value={r.price} onChange={e=>editRecord(r.id,'price', e.target.value)} /></td>
                <td><input className="table-input" value={r.notes} onChange={e=>editRecord(r.id,'notes', e.target.value)} /></td>
                <td><input className="table-input" type="date" value={r.date} onChange={e=>editRecord(r.id,'date', e.target.value)} /></td>
                <td><button className="btn link" onClick={()=>deleteRecord(r.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="summary">
        <div>Conversations: <strong>{totalConvos}</strong></div>
        <div>Sales: <strong>{totalSales}</strong></div>
        <div>PPV Earnings: <strong>${totalPPV.toFixed(2)}</strong></div>
        <div>Tips: <strong>${tipsTotal.toFixed(2)}</strong></div>
        <div className="big">Total Earnings: <strong>${totalEarnings.toFixed(2)}</strong></div>
      </div>

      {/* Thin horizontal goal bar */}
      {goal > 0 && (
        <div style={{ marginTop: "8px" }}>
          <div style={{
            height: "6px",
            borderRadius: "4px",
            background: "#e5e7eb",
            overflow: "hidden"
          }}>
            <div style={{
              height: "100%",
              width: `${progress}%`,
              background: progress >= 100 ? "var(--success)" : "var(--accent)",
              transition: "width 0.4s ease"
            }} />
          </div>
          <div style={{ textAlign: "right", fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}>
            {progress >= 100
              ? "🎉 Goal reached!"
              : `${progress.toFixed(0)}% of $${goal}`}
          </div>
        </div>
      )}

      <div className="panel-actions">
        <button className="btn gray" onClick={exportCSV}>Export CSV</button>
        <button className="btn danger" onClick={resetRecords}>Reset Records & Tips</button>
        <button className="btn link" onClick={onBack}>← Back to Models</button>
      </div>

      <ToastContainer />
    </div>
  );
}
