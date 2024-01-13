// App.jsx
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      {/* Other components with routes */}
    </Router>
  );
}

export default App;
