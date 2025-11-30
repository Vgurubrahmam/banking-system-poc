import { useState } from "react";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const err = onLogin(username, password);
    if (err) setError(err);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Login
      </h2>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-slate-300"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin or cust"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-slate-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="admin123 / cust123"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 transition"
        >
          Sign In
        </button>
      </form>

      <div className="mt-4 text-xs text-slate-500">
        <p>Demo users:</p>
        <p>Admin → <b>admin / admin123</b></p>
        <p>Customer → <b>cust / cust123</b></p>
      </div>
    </div>
  );
}

export default LoginPage;
