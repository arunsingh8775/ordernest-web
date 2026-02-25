import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import inventoryApi from "../api/inventoryAxios";
import { clearToken } from "../utils/auth";

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await inventoryApi.get("/api/products");
        if (!cancelled) {
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          if (err?.response?.status === 401 || err?.response?.status === 403) {
            clearToken();
            navigate("/login", { replace: true });
            return;
          }
          setError(err?.response?.data?.message || "Unable to load products.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;
    return products.filter((p) => (p.name || "").toLowerCase().includes(query) || (p.description || "").toLowerCase().includes(query));
  }, [products, search]);

  const colors = ["bg-rose-100", "bg-amber-100", "bg-lime-100", "bg-emerald-100", "bg-cyan-100", "bg-sky-100", "bg-indigo-100"];
  const swatch = (value = "") => {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) hash = (hash << 5) - hash + value.charCodeAt(i);
    return colors[Math.abs(hash) % colors.length];
  };

  const formatCurrency = (amount, currency = "INR") =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount || 0);

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6">
      <section className="mx-auto w-full max-w-6xl rounded-3xl border border-primary-100 bg-white/95 p-5 shadow-2xl shadow-primary-100/70 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-semibold text-slate-900">Products</h1>
          <button
            onClick={() => {
              clearToken();
              navigate("/login", { replace: true });
            }}
            className="self-start rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Logout
          </button>
        </div>

        <div className="mt-6">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search product"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-primary-500 focus:ring-2"
          />
        </div>

        {loading && <p className="mt-6 text-sm text-slate-600">Loading products...</p>}
        {error && <p className="mt-6 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

        {!loading && !error && (
          <div className="mt-6 grid grid-cols-1 gap-4">
            {filtered.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-primary-300 hover:shadow-md"
              >
                <div className={`h-16 w-16 flex-none rounded-xl ${swatch(product.id || product.name || "")}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-base font-semibold text-slate-900">{product.name}</h2>
                    <p className="text-sm font-semibold text-primary-700">{formatCurrency(Number(product.price), product.currency)}</p>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">Stock: {product.availableQuantity}</p>
                  <p className="mt-2 text-sm text-slate-600">{product.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
