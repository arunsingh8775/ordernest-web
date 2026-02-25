import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import orderApi from "../api/orderAxios";
import api from "../api/axios";
import { clearToken } from "../utils/auth";

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userError, setUserError] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    let cancelled = false;
    const fetchOrder = async () => {
      setLoading(true);
      setError("");
      setUserError("");
      try {
        const [orderResult, userResult] = await Promise.allSettled([
          orderApi.get(`/api/orders/${orderId}`),
          api.get("/api/auth/me")
        ]);

        if (orderResult.status === "rejected") {
          throw orderResult.reason;
        }

        if (!cancelled) {
          setOrder(orderResult.value.data);
          setPaymentStatus(orderResult.value.data?.paymentStatus || "");

          if (userResult.status === "fulfilled") {
            setUser(userResult.value.data || null);
          } else {
            setUserError(
              userResult.reason?.response?.data?.error ||
                userResult.reason?.response?.data?.message ||
                "Unable to load user details."
            );
          }
        }
      } catch (err) {
        if (!cancelled) {
          if (err?.response?.status === 401 || err?.response?.status === 403) {
            clearToken();
            navigate("/login", { replace: true });
            return;
          }
          setError(err?.response?.data?.message || "Unable to load order details.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchOrder();
    return () => {
      cancelled = true;
    };
  }, [navigate, orderId]);

  const currentPaymentStatus = paymentStatus || order?.paymentStatus || "UNKNOWN";
  const paymentBadgeClass =
    currentPaymentStatus === "PAID"
      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
      : currentPaymentStatus === "PENDING"
        ? "bg-amber-100 text-amber-800 border-amber-200"
        : "bg-slate-100 text-slate-700 border-slate-200";

  const orderBadgeClass =
    order?.status === "CONFIRMED"
      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
      : order?.status === "PENDING"
        ? "bg-amber-100 text-amber-800 border-amber-200"
        : "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6">
      <section className="mx-auto w-full max-w-5xl rounded-3xl border border-primary-100 bg-white/95 p-5 shadow-2xl shadow-primary-100/70 backdrop-blur-sm sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-back"
          >
            Back
          </button>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
            Order #{orderId?.slice(0, 8)}
          </span>
        </div>

        {loading && <p className="mt-6 text-sm text-slate-600">Loading order details...</p>}
        {error && <p className="mt-6 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

        {!loading && !error && order && (
          <article className="mt-6">
            <div className="rounded-2xl border border-primary-200 bg-gradient-to-r from-primary-50 via-white to-primary-50 p-5 shadow-sm">
              <h1 className="text-2xl font-semibold text-slate-900">Order Summary</h1>
              <p className="mt-1 text-sm text-slate-600">Track payment, order state, and buyer details</p>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-4">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Order ID</p>
                <p className="mt-1 break-all text-sm font-medium text-slate-700">{order.orderId}</p>
                <h2 className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Order Status</h2>
                <div className={`mt-3 inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${orderBadgeClass}`}>
                  {order.status}
                </div>
                <dl className="mt-4 space-y-2 rounded-xl bg-slate-50 p-3 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <dt className="text-slate-500">Product Name</dt>
                    <dd className="max-w-[62%] break-all text-right font-medium text-slate-800">{order.item?.productName || "-"}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt className="text-slate-500">Quantity</dt>
                    <dd className="font-medium text-slate-800">{order.item?.quantity}</dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Payment Status</h2>
                <div className={`mt-3 inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${paymentBadgeClass}`}>
                  {currentPaymentStatus}
                </div>
                {currentPaymentStatus === "PENDING" && (
                  <button
                    type="button"
                    onClick={() => setPaymentStatus("PAID")}
                    className="mt-4 w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
                  >
                    Pay Now
                  </button>
                )}
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">User Details</h2>
                {userError && <p className="mt-3 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{userError}</p>}
                {!userError && (
                  <dl className="mt-3 space-y-2 rounded-xl bg-slate-50 p-3 text-sm">
                    <div className="flex items-start justify-between gap-3">
                      <dt className="text-slate-500">Email</dt>
                      <dd className="max-w-[62%] break-all text-right font-medium text-slate-800">{user?.email || "-"}</dd>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <dt className="text-slate-500">Name</dt>
                      <dd className="text-right font-medium text-slate-800">
                        {[user?.firstName, user?.lastName].filter(Boolean).join(" ") || "-"}
                      </dd>
                    </div>
                  </dl>
                )}
              </section>
            </div>
          </article>
        )}
      </section>
    </main>
  );
}
