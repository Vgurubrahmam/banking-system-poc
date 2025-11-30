import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./components/loginPage.jsx";
import CustomerDashboard from "./components/CustomerDashboard.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";

// ProtectedRoute component outside of App
function ProtectedRoute({ children, role, user }) {
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  // Load user from localStorage on initial render
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("bankingUser");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        localStorage.removeItem("bankingUser");
        return null;
      }
    }
    return null;
  });
  const navigate = useNavigate();

  const handleLogin = (username, password) => {
    // simple hardcoded auth for POC
    if (username === "admin" && password === "admin123") {
      const u = { username, role: "ADMIN" };
      setUser(u);
      localStorage.setItem("bankingUser", JSON.stringify(u));
      navigate("/admin");
    } else if (username === "cust" && password === "cust123") {
      const u = {
        username,
        role: "CUSTOMER",
        cardNumber: "4123456789012345", // our seeded card
      };
      setUser(u);
      localStorage.setItem("bankingUser", JSON.stringify(u));
      navigate("/customer");
    } else {
      return "Invalid credentials";
    }
    return null;
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("bankingUser");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* simple top bar */}
      <header className="bg-slate-900 text-white p-3 flex justify-between items-center">
        <h1 className="font-semibold">Banking System POC</h1>
        {user ? (
          <div className="flex items-center gap-3 text-sm">
            <span>{user.username} ({user.role})</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <span className="text-sm opacity-80 mr-2">Not logged in</span>
        )}
      </header>

      <main className="flex-1 flex justify-center items-center p-4">
        <Routes>
          <Route
            path="/login"
            element={<LoginPage onLogin={handleLogin} />}
          />
          <Route
            path="/customer"
            element={
              <ProtectedRoute role="CUSTOMER" user={user}>
                <CustomerDashboard user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="ADMIN" user={user}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
