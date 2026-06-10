import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as api, E as EmptyState } from "./router-CEMUKAFA.mjs";
import { A as AppShell, f as formatMoney, C as Card, a as CardHeader, b as CardTitle, c as CardContent, S as Skeleton } from "./card-T6n13wHJ.mjs";
import { B as Button, I as Input } from "./input-BiB-PFhx.mjs";
import { L as Label } from "./label-D4W0VQAM.mjs";
import { B as Badge } from "./badge-9YSQsrUa.mjs";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-3Qmy2klh.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-D0dVKXgO.mjs";
import { S as Sparkles, R as Receipt, A as ArrowRight, C as CreditCard, W as Wallet } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
function PaymentsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = reactExports.useState(false);
  const [groupId, setGroupId] = reactExports.useState("");
  const [receiverId, setReceiverId] = reactExports.useState("");
  const [amount, setAmount] = reactExports.useState("");
  const q = useQuery({
    queryKey: ["payments"],
    queryFn: api.paymentHistory,
    refetchOnWindowFocus: true
  });
  const groupsQ = useQuery({
    queryKey: ["groups"],
    queryFn: api.myGroups
  });
  const detailsQ = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => api.groupDetails(groupId),
    enabled: !!groupId
  });
  const pay = useMutation({
    mutationFn: () => api.mockPay({
      group_id: groupId,
      receiver_id: receiverId,
      amount: parseFloat(amount)
    }),
    onSuccess: async () => {
      toast.success("Payment recorded");
      setOpen(false);
      setAmount("");
      setReceiverId("");
      setGroupId("");
      await Promise.all([qc.invalidateQueries({
        queryKey: ["payments"]
      }), qc.invalidateQueries({
        queryKey: ["balances"]
      }), qc.invalidateQueries({
        queryKey: ["balances", "direct"]
      }), qc.invalidateQueries({
        queryKey: ["group-balances"]
      })]);
    },
    onError: (e) => toast.error(e.message)
  });
  const payments = Array.isArray(q.data) ? q.data : [];
  const groupList = Array.isArray(groupsQ.data) ? groupsQ.data : groupsQ.data?.groups ?? [];
  const totalSettled = payments.reduce((sum, p) => sum + p.amount, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { title: "Payments", action: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "rounded-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-4 w-4 mr-2" }),
      "Make Payment"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-lg rounded-[2rem] border-0 p-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-br from-primary/10 via-background to-primary/5 p-8 border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-2xl font-bold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-6 w-6 text-primary" }),
          "Send Payment"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2", children: "Quickly settle balances with your group members." })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
        e.preventDefault();
        pay.mutate();
      }, className: "p-6 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Group" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: groupId, onValueChange: setGroupId, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "rounded-2xl h-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a group" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: groupList.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: g.id, children: g.group_name }, g.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Receiver" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: receiverId, onValueChange: setReceiverId, disabled: !groupId, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "rounded-2xl h-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select member" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: detailsQ.data?.members.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: m.id, children: m.full_name }, m.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "amount", children: "Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "amount", type: "number", step: "0.01", placeholder: "₹ 0.00", value: amount, onChange: (e) => setAmount(e.target.value), className: "rounded-2xl h-12", required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: pay.isPending || !groupId || !receiverId || !amount, className: "rounded-2xl w-full h-12 text-base", children: pay.isPending ? "Processing..." : "Send Payment" }) })
      ] })
    ] })
  ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-[2rem] overflow-hidden border bg-gradient-to-br from-primary/10 via-background to-primary/5 p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-primary font-medium", children: "Payments Overview" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-bold tracking-tight", children: formatMoney(totalSettled) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2 text-lg", children: "Total money settled across all payments 💸" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Payments", value: `${payments.length}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Settled", value: formatMoney(totalSettled) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-[2rem] border lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Payment History" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "rounded-full", children: [
            payments.length,
            " ",
            "total"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: q.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-52 rounded-[2rem]" }) : payments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "h-6 w-6" }), title: "No payments yet", desc: "Settle up to see payment history." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: payments.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "rounded-[2rem] border hover:shadow-lg transition-all duration-300 hover:-translate-y-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: p.payer_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: p.receiver_name })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-2", children: [
              new Date(p.created_at).toLocaleDateString(),
              " ",
              "•",
              " ",
              new Date(p.created_at).toLocaleTimeString()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "rounded-full mb-2", variant: p.payment_status === "pending" ? "secondary" : "default", children: p.payment_status }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-lg", children: formatMoney(p.amount) })
          ] })
        ] }) }, p.id)) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-[2rem] border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Recent Stats" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatRow, { label: "Total payments", value: `${payments.length}` }),
          payments.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatRow, { label: "Latest payment", value: new Date(payments[0]?.created_at).toLocaleDateString() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatRow, { label: "Total settled", value: formatMoney(totalSettled) })
          ] })
        ] })
      ] })
    ] })
  ] }) });
}
function StatCard({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl bg-background/80 backdrop-blur-md border p-4 min-w-[180px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-2xl mt-2", children: value })
  ] });
}
function StatRow({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-lg", children: value })
  ] });
}
export {
  PaymentsPage as component
};
