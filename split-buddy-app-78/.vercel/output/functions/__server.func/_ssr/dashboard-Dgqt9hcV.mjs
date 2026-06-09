import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery, c as useQueries } from "../_libs/tanstack__react-query.mjs";
import { u as useAuth, a as api } from "./router-ToKkhAkr.mjs";
import { A as AppShell, f as formatMoney, C as Card, a as CardHeader, b as CardTitle, c as CardContent, S as Skeleton } from "./card-CYL0C1I9.mjs";
import { B as Button } from "./input-BiB-PFhx.mjs";
import { B as Badge } from "./badge-9YSQsrUa.mjs";
import "../_libs/sonner.mjs";
import { P as Plus, W as Wallet, T as TrendingUp, c as ArrowUpRight, d as ArrowDownRight, R as Receipt, U as Users } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/radix-ui__react-separator.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/radix-ui__react-tooltip.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/tailwind-merge.mjs";
function Dashboard() {
  const {
    user
  } = useAuth();
  const hour = (/* @__PURE__ */ new Date()).getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
  const dashboard = useQuery({
    queryKey: ["dashboard"],
    queryFn: api.dashboard
  });
  const groupsQ = useQuery({
    queryKey: ["groups"],
    queryFn: api.myGroups
  });
  const paymentsQ = useQuery({
    queryKey: ["payments"],
    queryFn: api.paymentHistory
  });
  const groupList = Array.isArray(groupsQ.data) ? groupsQ.data : [];
  const groupBalanceQueries = useQueries({
    queries: groupList.map((g) => ({
      queryKey: ["group-balances", g.id],
      queryFn: () => api.groupBalances(g.id),
      enabled: !!g.id
    }))
  });
  const groupExpenseQueries = useQueries({
    queries: groupList.map((g) => ({
      queryKey: ["group-expenses", g.id],
      queryFn: () => api.groupExpenses(g.id),
      enabled: !!g.id
    }))
  });
  const allBalances = groupBalanceQueries.flatMap((q) => q.data ?? []);
  const recentExpenses = groupExpenseQueries.flatMap((q, index) => (q.data ?? []).map((expense) => ({
    ...expense,
    group_name: groupList[index]?.group_name ?? "Unknown Group"
  }))).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);
  const currentUser = (user?.name ?? "").trim().toLowerCase();
  const youOwe = allBalances.filter((b) => b.from_user?.toLowerCase().includes(currentUser));
  const owedToYou = allBalances.filter((b) => b.to_user?.toLowerCase().includes(currentUser));
  const overallBalances = /* @__PURE__ */ new Map();
  [...youOwe, ...owedToYou].forEach((b) => {
    const isYouOwe = b.from_user?.toLowerCase().includes(currentUser);
    const person = isYouOwe ? b.to_user : b.from_user;
    const existing = overallBalances.get(person);
    overallBalances.set(person, {
      amount: (existing?.amount ?? 0) + b.amount,
      type: isYouOwe ? "owe" : "owed"
    });
  });
  const summary = dashboard.data;
  const totalOwe = Number(summary?.you_owe ?? 0);
  const totalOwed = Number(summary?.you_are_owed ?? 0);
  const net = totalOwed - totalOwe;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { title: "", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-3xl border bg-gradient-to-br from-primary/10 via-background to-primary/5 p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-bold tracking-tight", children: [
          greeting,
          ",",
          " ",
          user?.name?.split(" ")[0],
          " ",
          "👋"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2", children: "Manage expenses without drama." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/groups", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
          "Group"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/payments", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "mr-2 h-4 w-4" }),
          "Settle"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/balances", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "View balances" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4" }), label: "Net balance", value: formatMoney(net), description: net >= 0 ? "Looking good 🎉" : "Needs settling", tone: net >= 0 ? "good" : "bad", loading: dashboard.isLoading }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-4 w-4" }), label: "You are owed", value: formatMoney(totalOwed), description: `Across ${owedToYou.length} people`, tone: "good", loading: dashboard.isLoading }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownRight, { className: "h-4 w-4" }), label: "You owe", value: formatMoney(totalOwe), description: `${youOwe.length} pending`, tone: "bad", loading: dashboard.isLoading }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "h-4 w-4" }), label: "Expenses", value: formatMoney(Number(summary?.total_expenses ?? 0)), description: `${summary?.total_groups ?? 0} active groups`, loading: dashboard.isLoading })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Overall balances" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", children: [
              overallBalances.size,
              " ",
              "people"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: overallBalances.size === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-6 w-6" }), title: "No balances yet", desc: "Start adding expenses to split bills." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: [...overallBalances.entries()].map(([person, data], i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between rounded-xl border p-4 hover:bg-muted/40 transition", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold", children: person?.[0] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: person }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: data.type === "owe" ? "You owe" : "Owes you" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-semibold ${data.type === "owe" ? "text-red-500" : "text-green-600"}`, children: formatMoney(data.amount) })
          ] }, i)) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Active groups" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/groups", className: "text-sm text-primary hover:underline", children: "View all" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: groupsQ.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [...Array(3)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full" }, i)) }) : groupList.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-6 w-6" }), title: "No groups yet", desc: "Create a group and start splitting expenses." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 md:grid-cols-2", children: groupList.map((group) => /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/groups/${group.id}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border p-4 hover:border-primary transition hover:bg-muted/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: group.group_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5 text-muted-foreground" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2", children: "Split expenses with friends" })
          ] }) }, group.id)) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Recent expenses" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: recentExpenses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "h-6 w-6" }), title: "No expenses yet", desc: "Create your first expense." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: recentExpenses.map((expense) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between rounded-xl border p-4 hover:bg-muted/40 transition", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 items-start", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold", children: expense.group_name?.[0] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: expense.description }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: expense.group_name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: new Date(expense.created_at).toLocaleDateString() })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-lg", children: formatMoney(expense.amount) })
          ] }, expense.id)) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Recent payments" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: paymentsQ.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 w-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: paymentsQ.data?.slice(0, 5).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "rounded-xl border p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium text-sm", children: [
                p.payer_name,
                " ",
                "→",
                " ",
                p.receiver_name
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { children: p.payment_status })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: formatMoney(p.amount) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: new Date(p.created_at).toLocaleDateString() })
            ] })
          ] }, p.id)) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "People you split with" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [...new Set(allBalances.flatMap((b) => [b.from_user, b.to_user]))].filter((name) => !name?.toLowerCase().includes(currentUser)).slice(0, 8).map((person, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary", children: person?.[0] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: person })
          ] }, i)) }) })
        ] })
      ] })
    ] })
  ] }) });
}
function StatCard({
  icon,
  label,
  value,
  description,
  tone = "neutral",
  loading = false
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-5", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-2xl font-bold mt-2 ${tone === "good" ? "text-green-600" : tone === "bad" ? "text-red-500" : ""}`, children: value }),
      description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: description })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-primary/10 p-2 text-primary h-fit", children: icon })
  ] }) }) });
}
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
export {
  EmptyState,
  Dashboard as component
};
