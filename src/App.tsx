import React from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Typography } from "@mui/material";

function App() {
  const [count, setCount] = React.useState<number>(0);

  return (
    <>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR....
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more.....
      </p>
      <Typography>Salute to Calcs</Typography>
    </>
  );
}

export default App;
