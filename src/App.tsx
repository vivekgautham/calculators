
import "./App.css";
import { Stack } from "@mui/material";
import CalculatoryOutlet from "./components/CalculatorOutlet";

function App() {

  return (
    <Stack direction={"row"} justifyContent={"space-between"}>
      <CalculatoryOutlet />
    </Stack>
  );
}

export default App;
