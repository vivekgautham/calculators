import React from "react";
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
      </div>
      <Typography>Salute to Calcs</Typography>
    </>
  );
}

export default App;
