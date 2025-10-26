// import React, { useState, useEffect } from "react";
// import ModelSetup from "./components/ModelSetup";
// import Tracker from "./components/Tracker";

// export default function App() {
//   const [models, setModels] = useState(() => {
//     try {
//       return JSON.parse(localStorage.getItem("kk_models")) || [];
//     } catch { return []; }
//   });
//   const [mode, setMode] = useState(models.length ? "tracker" : "setup");

//   useEffect(() => {
//     localStorage.setItem("kk_models", JSON.stringify(models));
//   }, [models]);

//   return (
//     <div className="app-root">
//       <div className="center-card">
//         {mode === "setup" ? (
//           <ModelSetup
//             models={models}
//             setModels={setModels}
//             onStart={() => setMode("tracker")}
//           />
//         ) : (
//           <Tracker
//             models={models}
//             setModels={setModels}
//             onBack={() => setMode("setup")}
//           />
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import ModelSetup from "./components/ModelSetup";
import Tracker from "./components/Tracker";

export default function App() {
  const [models, setModels] = useState(() => {
    try { return JSON.parse(localStorage.getItem("kk_models")) || []; }
    catch { return []; }
  });
  const [mode, setMode] = useState(models.length ? "tracker" : "setup");

  useEffect(() => {
    localStorage.setItem("kk_models", JSON.stringify(models));
  }, [models]);

  return (
    <div className="app-root">
      <div className="center-card">
        {mode === "setup" ? (
          <ModelSetup
            models={models}
            setModels={setModels}
            onStart={() => setMode("tracker")}
          />
        ) : (
          <Tracker
            models={models}
            setModels={setModels}
            onBack={() => setMode("setup")}
          />
        )}
      </div>
    </div>
  );
}
