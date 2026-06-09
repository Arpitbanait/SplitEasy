import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { b as Route$1, u as useAuth, E as EmptyState, a as api } from "./router-ToKkhAkr.mjs";
import { A as AppShell, C as Card, a as CardHeader, b as CardTitle, c as CardContent, S as Skeleton, f as formatMoney, d as Avatar, e as AvatarFallback } from "./card-CYL0C1I9.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-CclsoaZT.mjs";
import { B as Button, I as Input } from "./input-BiB-PFhx.mjs";
import { L as Label } from "./label-D4W0VQAM.mjs";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-3Qmy2klh.mjs";
import { A as AddExpenseForm } from "./add-expense-form-C2dgMok2.mjs";
import { R as Receipt, f as Trash2, g as ArrowLeft, h as UserPlus, P as Plus, W as Wallet } from "../_libs/lucide-react.mjs";
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
      toast.success("Member added");
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
      toast.success("Marked as settled");
      invalidateAll();
    },
    onError: (e) => toast.error(e.message)
  });
  const d = details.data;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { title: d?.group_name ?? "Group", action: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/groups", className: "hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
      " Groups"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: memberOpen, onOpenChange: setMemberOpen, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4" }),
        " Add member"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add a member" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
          e.preventDefault();
          addMember.mutate();
        }, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mn", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "mn", value: memberName, onChange: (e) => setMemberName(e.target.value), required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "me", children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "me", type: "email", value: memberEmail, onChange: (e) => setMemberEmail(e.target.value), required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: addMember.isPending, children: addMember.isPending ? "Adding…" : "Add" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: addOpen, onOpenChange: setAddOpen, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        " Expense"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add expense" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AddExpenseForm, { fixedGroupId: groupId, members: d?.members ?? [], onDone: () => {
          setAddOpen(false);
          invalidateAll();
        } })
      ] })
    ] })
  ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "expenses", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "expenses", children: "Expenses" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "balances", children: "Balances" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "simplified", children: "Simplified" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "members", children: "Members" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "expenses", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "All expenses" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: expenses.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32" }) : !expenses.data || expenses.data.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "h-6 w-6" }), title: "No expenses yet", desc: "Add the first one." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y", children: expenses.data.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "py-3 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-md bg-primary/10 text-primary grid place-items-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium truncate", children: e.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Paid by ",
            e.paid_by,
            " · ",
            new Date(e.created_at).toLocaleDateString()
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: formatMoney(e.amount) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => {
          if (confirm("Delete this expense?")) removeExpense.mutate(e.id);
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-danger" }) })
      ] }, e.id)) }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "balances", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BalancesList, { data: balances.data, loading: balances.isLoading, members: d?.members ?? [], onSettle: (receiver_id, amount) => settle.mutate({
      receiver_id,
      amount
    }), currentName: user?.name }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "simplified", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BalancesList, { data: simplified.data, loading: simplified.isLoading, members: d?.members ?? [], onSettle: (receiver_id, amount) => settle.mutate({
      receiver_id,
      amount
    }), currentName: user?.name, title: "Simplified debts" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "members", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Members" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: details.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y", children: d?.members.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "py-3 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-9 w-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/15 text-primary", children: m.full_name[0]?.toUpperCase() }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium truncate", children: m.full_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: m.email })
        ] })
      ] }, m.id)) }) })
    ] }) })
  ] }) });
}
function BalancesList({
  data,
  loading,
  members,
  onSettle,
  currentName,
  title = "Who owes whom"
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: title }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24" }) : !data || data.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-6 w-6" }), title: "All settled up", desc: "No outstanding balances." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y", children: data.map((b, i) => {
      const youOwe = b.from_user === currentName;
      const receiver = members.find((m) => m.full_name === b.to_user);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "py-3 flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: b.from_user }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "owes" }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: b.to_user })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: youOwe ? "text-danger font-semibold" : "text-success font-semibold", children: formatMoney(b.amount) }),
          youOwe && receiver && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => onSettle(receiver.id, b.amount), children: "Settle" })
        ] })
      ] }, i);
    }) }) })
  ] });
}
export {
  GroupDetail as component
};
