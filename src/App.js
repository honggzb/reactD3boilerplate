import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css';
import LineChart from "./components/lineChart/linechart";
import BarChart from "./components/barChart/barchart";
// import GantChart from "./components/gantChart/gantChart";

function App() {
  return (
    <Router>
    <div>
      <nav>
        <ul>
          {/* <li> <Link to="/">Home</Link> </li> */}
          <li> <Link to="/">LineChart</Link> </li>
          <li> <Link to="/bar">BarGraph</Link> </li>
          {/* <li> <Link to="/gant">GantGraph</Link> </li> */}
        </ul>
      </nav>
      <Routes>
        {/* <Route path="/" element={<Home />}></Route> */}
        <Route path="/" element={<LineChart />}></Route>
        <Route path="/bar" element={<BarChart />}></Route>
        {/* <Route path="/gant" element={<GantChart />}></Route> */}
      </Routes>
    </div>
  </Router>
  );
}

export default App;

export function Home() {
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
