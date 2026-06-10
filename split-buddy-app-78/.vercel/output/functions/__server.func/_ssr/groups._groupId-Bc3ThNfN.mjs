import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { b as Route$1, u as useAuth, E as EmptyState, a as api } from "./router-CEMUKAFA.mjs";
import { A as AppShell, S as Skeleton, C as Card, c as CardContent, f as formatMoney, d as Avatar, e as AvatarFallback, a as CardHeader, b as CardTitle } from "./card-T6n13wHJ.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-CclsoaZT.mjs";
import { B as Button, I as Input } from "./input-BiB-PFhx.mjs";
import { L as Label } from "./label-D4W0VQAM.mjs";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-3Qmy2klh.mjs";
import { A as AddExpenseForm } from "./add-expense-form-D6LE2wdZ.mjs";
import { R as Receipt, f as Trash2, W as Wallet, U as Users, g as ArrowLeft, h as UserPlus, P as Plus } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "./select-D0dVKXgO.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
function GroupDetail() {
  const {
    groupId
  } = Route$1.useParams();
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const details = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => api.groupDetails(groupId)
  });
  const balances = useQuery({
    queryKey: ["group", groupId, "balances"],
    queryFn: () => api.groupBalances(groupId)
  });
  const simplified = useQuery({
    queryKey: ["group", groupId, "simplified"],
    queryFn: () => api.simplifiedBalances(groupId)
  });
  const expenses = useQuery({
    queryKey: ["group", groupId, "expenses"],
    queryFn: () => api.groupExpenses(groupId)
  });
  const invalidateAll = () => {
    qc.invalidateQueries({
      queryKey: ["group", groupId]
    });
    qc.invalidateQueries({
      queryKey: ["group", groupId, "balances"]
    });
    qc.invalidateQueries({
      queryKey: ["group", groupId, "expenses"]
    });
    qc.invalidateQueries({
      queryKey: ["group", groupId, "simplified"]
    });
    qc.invalidateQueries({
      queryKey: ["balances", "direct"]
    });
    qc.invalidateQueries({
      queryKey: ["dashboard"]
    });
  };
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [memberOpen, setMemberOpen] = reactExports.useState(false);
  const [memberName, setMemberName] = reactExports.useState("");
  const [memberEmail, setMemberEmail] = reactExports.useState("");
  const addMember = useMutation({
    mutationFn: () => api.addMember(groupId, {
      name: memberName,
      email: memberEmail
    }),
    onSuccess: () => {
      toast.success("Member added 🎉");
      setMemberOpen(false);
      setMemberName("");
      setMemberEmail("");
      invalidateAll();
    },
    onError: (e) => toast.error(e.message)
  });
  const removeExpense = useMutation({
    mutationFn: (id) => api.deleteExpense(id),
    onSuccess: () => {
      toast.success("Expense deleted");
      invalidateAll();
    },
    onError: (e) => toast.error(e.message)
  });
  const settle = useMutation({
    mutationFn: (b) => api.settle({
      group_id: groupId,
      ...b
    }),
    onSuccess: () => {
      toast.success("Settled successfully");
      invalidateAll();
    },
    onError: (e) => toast.error(e.message)
  });
  const d = details.data ?? {
    group_name: "",
    members: []
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { title: "", action: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/groups", className: "hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
      "Groups"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: memberOpen, onOpenChange: setMemberOpen, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "rounded-2xl gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4" }),
        "Member"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "rounded-[2rem]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add Member" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
          e.preventDefault();
          addMember.mutate();
        }, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: memberName, onChange: (e) => setMemberName(e.target.value), className: "rounded-xl" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", value: memberEmail, onChange: (e) => setMemberEmail(e.target.value), className: "rounded-xl" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "rounded-xl", children: "Add Member" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: addOpen, onOpenChange: setAddOpen, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "rounded-2xl gap-2 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        "Expense"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg rounded-[2rem]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add Expense" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AddExpenseForm, { fixedGroupId: groupId, members: d?.members ?? [], onDone: () => {
          setAddOpen(false);
          invalidateAll();
        } })
      ] })
    ] })
  ] }), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-[2rem] overflow-hidden border bg-gradient-to-br from-primary/10 via-background to-primary/5 p-8 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-[2rem] bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold shrink-0", children: d?.group_name?.[0]?.toUpperCase() ?? "G" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-bold tracking-tight", children: d?.group_name ?? "Group" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground mt-2 text-lg", children: [
            d?.members?.length,
            " ",
            "members • Shared expenses 💸"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border bg-background/70 p-5 min-w-[170px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Expenses" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-bold text-3xl mt-2", children: expenses.data?.length ?? 0 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border bg-background/70 p-5 min-w-[170px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Members" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-bold text-3xl mt-2", children: d?.members?.length })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "expenses", className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "rounded-2xl p-1 h-auto bg-muted w-full flex-wrap justify-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "expenses", className: "rounded-xl px-5 py-2", children: "Expenses" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "balances", className: "rounded-xl px-5 py-2", children: "Balances" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "simplified", className: "rounded-xl px-5 py-2", children: "Simplified" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "members", className: "rounded-xl px-5 py-2", children: "Members" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "expenses", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-5", children: expenses.isLoading ? [...Array(4)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 rounded-[2rem]" }, i)) : !expenses.data || expenses.data.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "rounded-[2rem] border-dashed", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "h-7 w-7" }), title: "No expenses yet", desc: "Start by adding your first shared expense." }) }) }) : expenses.data.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "rounded-[2rem] border hover:border-primary/30 hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-[1.5rem] bg-primary/10 text-primary flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg truncate", children: e.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Paid by" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: e.paid_by })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2", children: new Date(e.created_at).toLocaleDateString() })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-2xl", children: formatMoney(e.amount) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", className: "mt-3 text-danger hover:text-danger", onClick: () => {
            if (confirm("Delete this expense?")) {
              removeExpense.mutate(e.id);
            }
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 mr-1" }),
            "Delete"
          ] })
        ] })
      ] }) }) }, e.id)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "balances", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: balances.isLoading ? [...Array(3)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 rounded-[2rem]" }, i)) : !balances.data || balances.data.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "rounded-[2rem] border-dashed", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-7 w-7" }), title: "All settled up", desc: "No pending balances in this group." }) }) }) : balances.data.map((b, i) => {
        const youOwe = b.from_user?.trim().toLowerCase() === user?.full_name?.trim().toLowerCase();
        const receiver = d?.members?.find((m) => m.full_name === b.to_user);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "rounded-[2rem] border hover:shadow-lg transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-lg", children: b.from_user }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm", children: [
              "owes",
              " ",
              b.to_user
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `font-bold text-2xl mt-3 ${youOwe ? "text-danger" : "text-success"}`, children: formatMoney(b.amount) })
          ] }),
          youOwe && receiver && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => settle.mutate({
            receiver_id: receiver.id,
            amount: b.amount
          }), className: "rounded-2xl", children: "Settle" })
        ] }) }) }, i);
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "simplified", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BalancesList, { data: simplified.data, loading: simplified.isLoading, members: d?.members ?? [], onSettle: (receiver_id, amount) => settle.mutate({
        receiver_id,
        amount
      }), currentName: user?.full_name, title: "Simplified debts" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "members", className: "mt-4", children: details.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: [...Array(4)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 rounded-[2rem]" }, i)) }) : d?.members?.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "rounded-[2rem] border-dashed", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-7 w-7" }), title: "No members", desc: "Invite friends to split expenses." }) }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-5 md:grid-cols-2 lg:grid-cols-3", children: d?.members?.map((m) => {
        const isYou = m.full_name?.trim().toLowerCase() === user?.full_name?.trim().toLowerCase();
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "rounded-[2rem] border hover:shadow-xl hover:border-primary/30 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-16 w-16 border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/10 text-primary text-xl font-bold", children: m.full_name?.[0]?.toUpperCase() }) }),
            isYou && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium", children: "You" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg truncate", children: m.full_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground truncate mt-2", children: m.email })
          ] })
        ] }) }, m.id);
      }) }) })
    ] })
  ] });
}
function BalancesList({
  data,
  loading,
  members,
  onSettle,
  currentName,
  title = "Who owes whom"
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-[2rem]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: title }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24" }) : !data || data.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-7 w-7" }), title: "All settled up", desc: "No pending balances." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: data.map((b, i) => {
      const fromUser = b.from ?? b.from_user ?? "";
      const toUser = b.to ?? b.to_user ?? "";
      const youOwe = fromUser?.trim().toLowerCase() === currentName?.trim().toLowerCase();
      const receiver = members.find((m) => m.full_name === toUser);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "rounded-[1.5rem] border hover:border-primary/30 transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-lg", children: fromUser }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "owes",
            " ",
            toUser
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `font-bold text-xl mt-2 ${youOwe ? "text-danger" : "text-success"}`, children: formatMoney(b.amount) })
        ] }),
        youOwe && receiver && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => onSettle(receiver.id, b.amount), className: "rounded-2xl", children: "Settle" })
      ] }) }, i);
    }) }) })
  ] });
}
export {
  GroupDetail as component
};
