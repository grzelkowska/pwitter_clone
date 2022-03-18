import React, { useState } from "react";
import AppRouter from "./Router";

function App() {
  const [init, setInit] = useState(false);
  
  return <AppRouter></AppRouter>;
}

export default App;
