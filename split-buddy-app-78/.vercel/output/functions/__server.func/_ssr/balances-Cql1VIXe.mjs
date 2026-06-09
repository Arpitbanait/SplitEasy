import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQuery, c as useQueries } from "../_libs/tanstack__react-query.mjs";
import { u as useAuth, a as api } from "./router-ToKkhAkr.mjs";
import { A as AppShell, f as formatMoney, C as Card, c as CardContent, S as Skeleton } from "./card-CYL0C1I9.mjs";
import { B as Button } from "./input-BiB-PFhx.mjs";
import "../_libs/sonner.mjs";
import { S as Sparkles, e as RefreshCcw, c as ArrowUpRight, d as ArrowDownRight, W as Wallet, U as Users } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
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
function BalancesPage() {
  const {
    user
  } = useAuth();
  const currentUser = user?.name?.trim().toLowerCase() ?? "";
  currentUser.split(" ")[0].trim();
  const groupsQ = useQuery({
    queryKey: ["groups"],
    queryFn: api.myGroups,
    refetchOnWindowFocus: true
  });
  const groupList = Array.isArray(groupsQ.data) ? groupsQ.data : Array.isArray(groupsQ.data?.groups) ? groupsQ.data.groups : [];
  const directQ = useQuery({
    queryKey: ["balances", "direct"],
    queryFn: api.directBalances,
    staleTime: 0,
    refetchInterval: 5e3,
    refetchOnWindowFocus: true
  });
  const groupBalanceQueries = useQueries({
    queries: groupList.map((g) => ({
      queryKey: ["group-balances", g.id],
      queryFn: () => api.groupBalances(g.id),
      enabled: !!g.id
    }))
  });
  const directBalances = Array.isArray(directQ.data) ? directQ.data : Array.isArray(directQ.data?.balances) ? directQ.data.balances : [];
  const groupBalances = groupBalanceQueries.flatMap((q) => Array.isArray(q.data) ? q.data : Array.isArray(q.data?.balances) ? q.data.balances : []);
  const rawBalances = [...directBalances, ...groupBalances];
  const netMap = /* @__PURE__ */ new Map();
  for (const b of rawBalances) {
    const from = b.from_user?.trim();
    const to = b.to_user?.trim();
    const amount = Number(b.amount) || 0;
    if (!from || !to || from === to) {
      continue;
    }
    const forwardKey = `${from}-${to}`;
    const reverseKey = `${to}-${from}`;
    if (netMap.has(reverseKey)) {
      const reverse = netMap.get(reverseKey);
      if (reverse.amount > amount) {
        reverse.amount -= amount;
      } else if (reverse.amount < amount) {
        const remaining = amount - reverse.amount;
        netMap.delete(reverseKey);
        netMap.set(forwardKey, {
          from_user: from,
          to_user: to,
          amount: remaining
        });
      } else {
        netMap.delete(reverseKey);
      }
    } else {
      const existing = netMap.get(forwardKey);
      if (existing) {
        existing.amount += amount;
      } else {
        netMap.set(forwardKey, {
          from_user: from,
          to_user: to,
          amount
        });
      }
    }
  }
  const allBalances = Array.from(netMap.values());
  const personBalanceMap = /* @__PURE__ */ new Map();
  allBalances.forEach((b) => {
    const from = b.from_user?.trim().toLowerCase();
    const to = b.to_user?.trim().toLowerCase();
    const amount = Number(b.amount) || 0;
    if (!from || !to || amount <= 0) return;
    if (from === currentUser) {
      const key = b.to_user;
      const existing = personBalanceMap.get(key);
      personBalanceMap.set(key, {
        person: b.to_user,
        amount: (existing?.amount ?? 0) + amount,
        type: "owe"
      });
    }
    if (to === currentUser) {
      const key = b.from_user;
      const existing = personBalanceMap.get(key);
      if (existing) {
        if (existing.type === "owe") {
          const net = existing.amount - amount;
          if (net > 0) {
            existing.amount = net;
          } else if (net < 0) {
            existing.amount = Math.abs(net);
            existing.type = "owed";
          } else {
            personBalanceMap.delete(key);
          }
        } else {
          existing.amount += amount;
        }
      } else {
        personBalanceMap.set(key, {
          person: b.from_user,
          amount,
          type: "owed"
        });
      }
    }
  });
  const youOwe = Array.from(personBalanceMap.values()).filter((b) => b.type === "owe").map((b) => ({
    from_user: currentUser,
    to_user: b.person,
    amount: b.amount
  }));
  const owedToYou = Array.from(personBalanceMap.values()).filter((b) => b.type === "owed").map((b) => ({
    from_user: b.person,
    to_user: currentUser,
    amount: b.amount
  }));
  const dashboardQ = useQuery({
    queryKey: ["dashboard"],
    queryFn: api.dashboard
  });
  const summary = dashboardQ.data;
  const totalOwe = Number(summary?.you_owe ?? 0);
  const totalOwed = Number(summary?.you_are_owed ?? 0);
  const netBalance = totalOwed - totalOwe;
  const isLoading = groupsQ.isLoading || directQ.isLoading || groupBalanceQueries.some((q) => q.isLoading);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { title: "Balances", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-[2rem] overflow-hidden border bg-gradient-to-br from-primary/10 via-background to-primary/5 p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-primary font-medium", children: "Combined Financial Overview" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-bold tracking-tight", children: formatMoney(Math.abs(netBalance)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2 text-lg", children: netBalance > 0 ? "You are overall owed money 🎉" : netBalance < 0 ? "You owe money 💸" : "You're fully settled 😎" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "rounded-2xl", onClick: () => {
          directQ.refetch();
          groupsQ.refetch();
          groupBalanceQueries.forEach((q) => q.refetch());
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { className: "h-4 w-4 mr-2" }),
          "Refresh"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { label: "You Are Owed", value: formatMoney(totalOwed), tone: "good", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { label: "You Owe", value: formatMoney(totalOwe), tone: "bad", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownRight, { className: "h-5 w-5" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "rounded-[2rem] border-0 shadow-sm bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6 flex items-start gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-6 w-6 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-lg", children: "Financial Summary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Combining both direct and group balances." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-3 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4" }),
            groupList.length,
            " ",
            "Groups"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "•" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            allBalances.length,
            " ",
            "Unique Balances"
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BalanceSection, { title: "You Owe", tone: "bad", data: youOwe, loading: isLoading, emptyTitle: "No dues 🎉", emptyDesc: "You don't owe anyone right now.", getName: (b) => b.to_user }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(BalanceSection, { title: "You Are Owed", tone: "good", data: owedToYou, loading: isLoading, emptyTitle: "Nothing pending", emptyDesc: "Nobody owes you currently.", getName: (b) => b.from_user })
    ] })
  ] }) });
}
function BalanceSection({
  title,
  tone,
  data,
  loading,
  emptyTitle,
  emptyDesc,
  getName
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-bold text-2xl", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
        data.length,
        " ",
        "people"
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-52 rounded-[2rem]" }) : data.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-[2rem] p-10 text-center border-dashed", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-7 w-7 text-primary" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-lg", children: emptyTitle }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: emptyDesc })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: data.map((b, i) => {
      const name = getName(b);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "rounded-[2rem] border hover:shadow-xl hover:-translate-y-1 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center font-bold text-lg", children: name?.[0]?.toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-lg", children: name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: tone === "good" ? "Owes you" : "You owe" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `font-bold text-xl ${tone === "good" ? "text-green-500" : "text-red-500"}`, children: formatMoney(b.amount) }) })
      ] }) }, i);
    }) })
  ] });
}
function MiniStat({
  label,
  value,
  icon,
  tone
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl bg-background/80 backdrop-blur-md border p-4 min-w-[180px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-10 w-10 rounded-2xl flex items-center justify-center ${tone === "good" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`, children: icon })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-2xl mt-3", children: value })
  ] });
}
export {
  BalancesPage as component
};
