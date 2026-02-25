import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import inventoryApi from "../api/inventoryAxios";
import { clearToken } from "../utils/auth";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [buyMessage, setBuyMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await inventoryApi.get(`/api/products/${id}`);
        if (!cancelled) {
          setProduct(data ?? null);
          setQuantity(1);
          setBuyMessage("");
        }
      } catch (err) {
        if (!cancelled) {
          if (err?.response?.status === 401 || err?.response?.status === 403) {
            clearToken();
            navigate("/login", { replace: true });
            return;
          }

          const message =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Unable to load product details. Please try again.";
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProduct();
    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  const formatCurrency = (amount, currency = "INR") =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount || 0);

  const swatchPalette = [
    "bg-rose-100",
    "bg-amber-100",
    "bg-lime-100",
    "bg-emerald-100",
    "bg-cyan-100",
    "bg-sky-100",
    "bg-indigo-100",
    "bg-violet-100"
  ];

  const colorClass = useMemo(() => {
    const value = product?.id || id || "";
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
      hash = (hash << 5) - hash + value.charCodeAt(i);
      hash |= 0;
    }
    return swatchPalette[Math.abs(hash) % swatchPalette.length];
  }, [id, product?.id]);

  const maxQuantity = Math.max(Number(product?.availableQuantity) || 0, 0);

  const updateQuantity = (nextValue) => {
    if (maxQuantity <= 0) {
      setQuantity(1);
      return;
    }
    const parsed = Number(nextValue);
    const safeValue = Number.isNaN(parsed) ? 1 : parsed;
    const clamped = Math.min(Math.max(Math.floor(safeValue), 1), maxQuantity);
    setQuantity(clamped);
    setBuyMessage("");
  };

  const handleBuy = () => {
    if (!product || maxQuantity <= 0) return;
    setBuyMessage(`Ready to buy ${quantity} unit${quantity > 1 ? "s" : ""} of ${product.name}.`);
  };

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6">
      <section className="mx-auto w-full max-w-4xl rounded-3xl border border-primary-100 bg-white/95 p-5 shadow-2xl shadow-primary-100/70 backdrop-blur-sm sm:p-8">
        <Link to="/products" className="text-sm font-medium text-primary-700 hover:underline">
          Back to products
        </Link>

        {loading && <p className="mt-6 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">Loading product details...</p>}

        {error && <p className="mt-6 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

        {!loading && !error && product && (
          <article className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className={`h-56 w-full rounded-2xl ${colorClass}`} />
            <div className="mt-5 min-w-0">
              <h1 className="text-2xl font-semibold text-slate-900">{product.name}</h1>
              <p className="mt-2 text-lg font-semibold text-primary-700">
                {formatCurrency(Number(product.price), product.currency)}
              </p>
              <p className="mt-2 text-sm text-slate-600">Stock: {product.availableQuantity}</p>
              <p className="mt-4 text-sm leading-6 text-slate-600">{product.description}</p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="inline-flex items-center rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => updateQuantity(quantity - 1)}
                    disabled={quantity <= 1 || maxQuantity <= 0}
                    className="h-10 w-10 text-lg font-semibold text-slate-700 disabled:cursor-not-allowed disabled:text-slate-300"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={Math.max(maxQuantity, 1)}
                    value={quantity}
                    onChange={(event) => updateQuantity(event.target.value)}
                    disabled={maxQuantity <= 0}
                    className="h-10 w-16 border-x border-slate-200 text-center text-sm font-medium text-slate-900 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => updateQuantity(quantity + 1)}
                    disabled={quantity >= maxQuantity || maxQuantity <= 0}
                    className="h-10 w-10 text-lg font-semibold text-slate-700 disabled:cursor-not-allowed disabled:text-slate-300"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleBuy}
                  disabled={maxQuantity <= 0}
                  className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Buy
                </button>
              </div>

              {maxQuantity <= 0 && <p className="mt-3 text-sm font-medium text-rose-700">Out of stock.</p>}
              {buyMessage && <p className="mt-3 text-sm font-medium text-emerald-700">{buyMessage}</p>}
            </div>
          </article>
        )}
      </section>
    </main>
  );
}
