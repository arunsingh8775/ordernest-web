import { useNavigate } from "react-router-dom";
import { clearToken } from "../utils/auth";

export default function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    clearToken();
    navigate("/", { replace: true });
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <section className="w-full max-w-xl rounded-2xl border border-primary-100 bg-white p-8 text-center shadow-xl shadow-primary-100/60">
        <h1 className="text-3xl font-bold text-primary-700">Welcome to OrderNest</h1>
        <p className="mt-3 text-slate-600">You are logged in and ready to manage orders.</p>

        <button
          onClick={logout}
          className="mt-8 rounded-lg bg-primary-600 px-5 py-2.5 font-medium text-white transition hover:bg-primary-700"
        >
          Logout
        </button>
      </section>
    </main>
  );
}
