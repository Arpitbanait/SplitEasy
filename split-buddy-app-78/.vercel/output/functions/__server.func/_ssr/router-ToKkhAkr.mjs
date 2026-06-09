import { c as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent, d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { Q as redirect } from "../_libs/tanstack__router-core.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
const appCss = "/assets/styles-DsMtHLtd.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
const API_URL = "https://spliteasy-r7md.onrender.com/"?.replace(/\/$/, "") || "https://spliteasy-r7md.onrender.com/";
const TOKEN_KEY = "spliteasy_token";
const tokenStore = {
  get: () => typeof window === "undefined" ? null : window.localStorage.getItem(TOKEN_KEY),
  set: (t) => window.localStorage.setItem(TOKEN_KEY, t),
  clear: () => window.localStorage.removeItem(TOKEN_KEY)
};
class ApiError extends Error {
  status;
  data;
  constructor(status, message, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}
async function apiFetch(path, opts = {}) {
  const { method = "GET", body, form, auth = true } = opts;
  const headers = {};
  let payload;
  if (form) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    payload = new URLSearchParams(form).toString();
  } else if (body !== void 0) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }
  if (auth) {
    const token = tokenStore.get();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: payload
  });
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  if (!res.ok) {
    if (res.status === 401 && auth) {
      tokenStore.clear();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth")) {
        window.location.href = "/auth";
      }
    }
    const detail = (data && typeof data === "object" && "detail" in data ? String(data.detail) : null) || res.statusText || "Request failed";
    throw new ApiError(res.status, detail, data);
  }
  return data;
}
const api = {
  // Auth
  signup: (b) => apiFetch("/auth/signup", { method: "POST", body: b, auth: false }),
  login: (email, password) => apiFetch("/auth/login", {
    method: "POST",
    form: { username: email, password, grant_type: "password" },
    auth: false
  }),
  me: () => apiFetch("/auth/me"),
  // Groups
  myGroups: () => apiFetch("/groups/my-groups"),
  createGroup: (group_name) => apiFetch("/groups/create", { method: "POST", body: { group_name } }),
  groupDetails: (id) => apiFetch(`/groups/${id}`),
  groupSummary: (id) => apiFetch(`/groups/${id}/summary`),
  simplifiedBalances: (id) => apiFetch(`/groups/${id}/simplified-balances`),
  addMember: (id, b) => apiFetch(`/groups/${id}/add-member`, { method: "POST", body: b }),
  // Expenses
  createExpense: (b) => apiFetch("/expenses/create", { method: "POST", body: b }),
  groupBalances: (id) => apiFetch(`/expenses/group/${id}/balances`),
  groupExpenses: (id) => apiFetch(`/expenses/group/${id}/expenses`),
  settle: (b) => apiFetch("/expenses/settle", { method: "POST", body: b }),
  deleteExpense: (id) => apiFetch(`/expenses/${id}`, { method: "DELETE" }),
  updateExpense: (id, b) => apiFetch(`/expenses/${id}`, { method: "PUT", body: b }),
  directBalances: () => apiFetch("/expenses/balances/direct"),
  // Payments
  mockPay: (b) => apiFetch("/payments/mock-pay", { method: "POST", body: b }),
  paymentHistory: () => apiFetch("/payments/history"),
  // Dashboard
  dashboard: () => apiFetch("/dashboard/"),
  // Notifications
  notifications: () => apiFetch("/notifications/")
};
const AuthCtx = reactExports.createContext(null);
function AuthProvider({ children }) {
  const [user, setUser] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const navigate = useNavigate();
  const load = async () => {
    if (!tokenStore.get()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await api.me();
      setUser(me);
    } catch {
      tokenStore.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const login = async (email, password) => {
    const res = await api.login(email, password);
    tokenStore.set(res.access_token);
    const me = await api.me();
    setUser(me);
  };
  const signup = async (full_name, email, password) => {
    await api.signup({ full_name, email, password });
    await login(email, password);
  };
  const logout = () => {
    tokenStore.clear();
    setUser(null);
    navigate({ to: "/auth" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthCtx.Provider, { value: { user, loading, login, signup, logout, refresh: load }, children });
}
function useAuth() {
  const ctx = reactExports.useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "Something went wrong" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: error.message }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$b = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SplitEasy — Share expenses without the awkwardness" },
      { name: "description", content: "Track shared expenses with friends, settle up in seconds." },
      { property: "og:title", content: "SplitEasy" },
      { property: "og:description", content: "Track shared expenses with friends, settle up in seconds." },
      { property: "og:type", content: "website" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$b.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "top-right" })
  ] }) });
}
const $$splitComponentImporter$a = () => import("./auth-BsVpZdMX.mjs");
const Route$a = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (s) => ({
    tab: s.tab === "signup" ? "signup" : "login"
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./route-BFsOu0JM.mjs");
const Route$9 = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: () => {
    if (typeof window !== "undefined" && !tokenStore.get()) {
      throw redirect({
        to: "/auth"
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./index-B_bGz34h.mjs");
const Route$8 = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./settings-N3cM3b2f.mjs");
const Route$7 = createFileRoute("/_authenticated/settings")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./payments-C89YyCJL.mjs");
const Route$6 = createFileRoute("/_authenticated/payments")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./notifications-B16Ay0qK.mjs");
const Route$5 = createFileRoute("/_authenticated/notifications")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./groups-NemDeWfS.mjs");
const Route$4 = createFileRoute("/_authenticated/groups")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./dashboard-Dgqt9hcV.mjs");
const Route$3 = createFileRoute("/_authenticated/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
function EmptyState({
  icon,
  title,
  desc
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 rounded-full bg-muted p-3", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: desc })
  ] });
}
const $$splitComponentImporter$2 = () => import("./balances-Cql1VIXe.mjs");
const Route$2 = createFileRoute("/_authenticated/balances")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./groups._groupId-DjoS6bbb.mjs");
const Route$1 = createFileRoute("/_authenticated/groups/$groupId")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./expenses.new-DTtL5KKZ.mjs");
const Route = createFileRoute("/_authenticated/expenses/new")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const AuthRoute = Route$a.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$b
});
const AuthenticatedRouteRoute = Route$9.update({
  id: "/_authenticated",
  getParentRoute: () => Route$b
});
const IndexRoute = Route$8.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$b
});
const AuthenticatedSettingsRoute = Route$7.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedPaymentsRoute = Route$6.update({
  id: "/payments",
  path: "/payments",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedNotificationsRoute = Route$5.update({
  id: "/notifications",
  path: "/notifications",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedGroupsRoute = Route$4.update({
  id: "/groups",
  path: "/groups",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedDashboardRoute = Route$3.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedBalancesRoute = Route$2.update({
  id: "/balances",
  path: "/balances",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedGroupsGroupIdRoute = Route$1.update({
  id: "/$groupId",
  path: "/$groupId",
  getParentRoute: () => AuthenticatedGroupsRoute
});
const AuthenticatedExpensesNewRoute = Route.update({
  id: "/expenses/new",
  path: "/expenses/new",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedGroupsRouteChildren = {
  AuthenticatedGroupsGroupIdRoute
};
const AuthenticatedGroupsRouteWithChildren = AuthenticatedGroupsRoute._addFileChildren(AuthenticatedGroupsRouteChildren);
const AuthenticatedRouteRouteChildren = {
  AuthenticatedBalancesRoute,
  AuthenticatedDashboardRoute,
  AuthenticatedGroupsRoute: AuthenticatedGroupsRouteWithChildren,
  AuthenticatedNotificationsRoute,
  AuthenticatedPaymentsRoute,
  AuthenticatedSettingsRoute,
  AuthenticatedExpensesNewRoute
};
const AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
  AuthRoute
};
const routeTree = Route$b._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  EmptyState as E,
  Route$a as R,
  api as a,
  Route$1 as b,
  router as r,
  useAuth as u
};
