// client/src/App.jsx
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import PastOrders from "./pages/PastOrders";
import CreateDonation from "./pages/CreateDonation";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { isLoggedIn } from "./utils/auth";

function App() {
    const [activePage, setActivePage] = useState("dashboard");
    // Real React state, seeded once from the token at mount. Everything
    // that decides what to render below reads THIS, never a raw
    // isLoggedIn() call during render — that was the bug: localStorage
    // changing doesn't by itself cause React to re-render anything.
    const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn());

    // Every navigation re-syncs auth state from the live token. This is
    // what makes logout work correctly too (Sidebar's existing logout
    // handler already calls onNavigate("dashboard") after clearing the
    // token — this wrapper is what actually notices that and flips
    // isAuthenticated), without needing to thread a separate onLogout
    // prop through every page that renders <Sidebar>.
    function navigate(page) {
        setIsAuthenticated(isLoggedIn());
        setActivePage(page);
    }

    // Passed to Login as onLogin — called the instant login succeeds,
    // so isAuthenticated flips to true as its own explicit state update
    // (not contingent on activePage changing to a "new" value).
    function handleLogin() {
        setIsAuthenticated(true);
    }

    // Past Orders is the one public page — always reachable, logged in or not.
    if (activePage === "donations") {
        return <PastOrders activePage={activePage} onNavigate={navigate} />;
    }

    // Sign Up must be reachable specifically while logged out, so it's
    // checked here too, before the auth gate below.
    if (activePage === "signup") {
        return <SignUp onNavigate={navigate} onLogin={handleLogin} />;
    }

    // Every other page requires a session.
    if (!isAuthenticated) {
        return <Login onNavigate={navigate} onLogin={handleLogin} />;
    }

    if (activePage === "inventory") {
        return <Inventory activePage={activePage} onNavigate={navigate} />;
    }

    // Create Donation requires login (checked above) AND admin role.
    // The admin check itself already lives inside CreateDonation.jsx —
    // reused here as-is, not duplicated.
    if (activePage === "create-donation") {
        return <CreateDonation activePage={activePage} onNavigate={navigate} />;
    }

    return <Dashboard activePage={activePage} onNavigate={navigate} />;
}

export default App;