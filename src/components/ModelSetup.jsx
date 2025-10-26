// import React, { useState } from "react";

// /*
// ModelSetup:
// - Add models you'll work with today.
// - Minimal, centered, clear labels above fields.
// */
// export default function ModelSetup({ models, setModels, onStart }) {
//   const [input, setInput] = useState("");

//   function addModel() {
//     const name = input.trim();
//     if (!name) return;
//     if (!models.includes(name)) setModels([...models, name]);
//     setInput("");
//   }

//   function removeModel(name) {
//     setModels(models.filter((m) => m !== name));
//   }

//   return (
//     <div className="panel">
//       <h1 className="panel-title">Kennedy’s Tracker</h1>
//       <p className="panel-sub">Add the model accounts you'll work with today</p>

//       <label className="label">Model name</label>
//       <div className="hrow">
//         <input
//           className="input"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="e.g. Jasmine Free"
//         />
//         <button className="btn primary" onClick={addModel}>Add</button>
//       </div>

//       <ul className="model-list" aria-live="polite">
//         {models.length === 0 && <li className="muted">No models yet</li>}
//         {models.map((m) => (
//           <li key={m} className="model-row">
//             <span>{m}</span>
//             <button className="btn link" onClick={() => removeModel(m)}>Remove</button>
//           </li>
//         ))}
//       </ul>

//       <div className="panel-actions">
//         <button
//           className="btn primary wide"
//           onClick={onStart}
//           disabled={models.length === 0}
//         >
//           Start Tracking
//         </button>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";

export default function ModelSetup({ models, setModels, onStart }) {
  const [input, setInput] = useState("");
  const [goal, setGoal] = useState(() => {
    const g = localStorage.getItem("kk_goal");
    return g ? parseFloat(g) : "";
  });

  function addModel() {
    const name = input.trim();
    if (!name) return;
    if (!models.includes(name)) setModels([...models, name]);
    setInput("");
  }

  function removeModel(name) {
    setModels(models.filter((m) => m !== name));
  }

  function handleStart() {
    localStorage.setItem("kk_goal", goal || "0");
    onStart(goal || 0);
  }

  return (
    <div className="panel">
      <h1 className="panel-title">Kennedy’s Tracker</h1>
      <p className="panel-sub">Add the model accounts you'll work with today</p>

      <label className="label">Daily Goal ($)</label>
      <input
        className="input"
        type="number"
        step="0.01"
        placeholder="e.g. 200"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />

      <label className="label" style={{ marginTop: "12px" }}>Model name</label>
      <div className="hrow">
        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Jasmine Free"
        />
        <button className="btn primary" onClick={addModel}>Add</button>
      </div>

      <ul className="model-list" aria-live="polite">
        {models.length === 0 && <li className="muted">No models yet</li>}
        {models.map((m) => (
          <li key={m} className="model-row">
            <span>{m}</span>
            <button className="btn link" onClick={() => removeModel(m)}>Remove</button>
          </li>
        ))}
      </ul>

      <div className="panel-actions">
        <button
          className="btn primary wide"
          onClick={handleStart}
          disabled={models.length === 0}
        >
          Start Tracking
        </button>
      </div>
    </div>
  );
}
