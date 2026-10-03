import "./App.css";
import CalculatorOutlet from "./components/CalculatorOutlet";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <CalculatorOutlet />
    </ThemeProvider>
  );
}

export default App;
