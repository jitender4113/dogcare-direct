import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";

function App() {
    const [activePage, setActivePage] = useState("dashboard");

    if (activePage === "inventory") {
        return <Inventory activePage={activePage} onNavigate={setActivePage} />;
    }

    return <Dashboard activePage={activePage} onNavigate={setActivePage} />;
}

export default App;
