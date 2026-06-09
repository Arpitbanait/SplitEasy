import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as api } from "./router-ToKkhAkr.mjs";
import { I as Input, B as Button, c as cn } from "./input-BiB-PFhx.mjs";
import { L as Label } from "./label-D4W0VQAM.mjs";
import { C as Checkbox$1, a as CheckboxIndicator } from "../_libs/radix-ui__react-checkbox.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-D0dVKXgO.mjs";
import { i as Check } from "../_libs/lucide-react.mjs";
const Checkbox = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Checkbox$1,
  {
    ref,
    className: cn(
      "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckboxIndicator, { className: cn("grid place-content-center text-current"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) })
  }
));
Checkbox.displayName = Checkbox$1.displayName;
function AddExpenseForm({
  fixedGroupId,
  members: providedMembers,
  onDone
}) {
  const [groupId, setGroupId] = reactExports.useState(fixedGroupId);
  const [amount, setAmount] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [selected, setSelected] = reactExports.useState({});
  const groupsQ = useQuery({
    queryKey: ["groups"],
    queryFn: api.myGroups,
    enabled: !fixedGroupId
  });
  const detailsQ = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => api.groupDetails(groupId),
    enabled: !!groupId && !providedMembers
  });
  const members = reactExports.useMemo(() => {
    if (providedMembers) return providedMembers;
    return detailsQ.data?.members ?? [];
  }, [providedMembers, detailsQ.data]);
  const groupList = Array.isArray(groupsQ.data) ? groupsQ.data : groupsQ.data?.["groups"] ?? [];
  const create = useMutation({
    mutationFn: () => {
      const participants = Object.keys(selected).filter((k) => selected[k]);
      if (participants.length === 0) throw new Error("Pick at least one participant");
      const amt = parseFloat(amount);
      if (!amt || amt <= 0) throw new Error("Enter a valid amount");
      return api.createExpense({
        group_id: groupId ?? null,
        amount: amt,
        description,
        participants
      });
    },
    onSuccess: () => {
      toast.success("Expense added");
      onDone();
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      onSubmit: (e) => {
        e.preventDefault();
        create.mutate();
      },
      className: "space-y-4",
      children: [
        !fixedGroupId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Group" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: groupId, onValueChange: setGroupId, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a group" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: groupList.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: g.id, children: g.group_name }, g.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ex-amt", children: "Amount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "ex-amt", type: "number", step: "0.01", value: amount, onChange: (e) => setAmount(e.target.value), required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ex-desc", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "ex-desc", value: description, onChange: (e) => setDescription(e.target.value), placeholder: "Dinner, Uber…", required: true })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Split equally between" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 rounded-md border border-border max-h-48 overflow-y-auto divide-y", children: members.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "p-3 text-sm text-muted-foreground", children: groupId ? "Loading members…" : "Pick a group to see members." }) : members.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-3 p-2.5 cursor-pointer hover:bg-accent", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Checkbox,
              {
                checked: !!selected[m.id],
                onCheckedChange: (c) => setSelected((s) => ({ ...s, [m.id]: !!c }))
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium truncate", children: m.full_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: m.email })
            ] })
          ] }, m.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", disabled: create.isPending, children: create.isPending ? "Saving…" : "Add expense" })
      ]
    }
  );
}
export {
  AddExpenseForm as A
};
