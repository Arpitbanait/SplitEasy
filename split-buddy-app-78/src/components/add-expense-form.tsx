import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { api, type GroupDetails, type GroupSummary, type Member } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export function AddExpenseForm({
  fixedGroupId,
  members: providedMembers,
  onDone,
}: {
  fixedGroupId?: string;
  members?: Member[];
  onDone: () => void;
}) {
  const [groupId, setGroupId] = useState<string | undefined>(fixedGroupId);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const groupsQ = useQuery({
    queryKey: ["groups"],
    queryFn: api.myGroups,
    enabled: !fixedGroupId,
  });
  const detailsQ = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => api.groupDetails(groupId!),
    enabled: !!groupId && !providedMembers,
  });

  const members: Member[] = useMemo(() => {
    if (providedMembers) return providedMembers;
    return (detailsQ.data as GroupDetails | undefined)?.members ?? [];
  }, [providedMembers, detailsQ.data]);

  const groupList: GroupSummary[] = Array.isArray(groupsQ.data)
    ? (groupsQ.data as GroupSummary[])
    : ((groupsQ.data as Record<string, unknown> | undefined)?.["groups"] as GroupSummary[]) ?? [];

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
        participants,
      });
    },
    onSuccess: () => { toast.success("Expense added"); onDone(); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); create.mutate(); }}
      className="space-y-4"
    >
      {!fixedGroupId && (
        <div>
          <Label>Group</Label>
          <Select value={groupId} onValueChange={setGroupId}>
            <SelectTrigger><SelectValue placeholder="Select a group" /></SelectTrigger>
            <SelectContent>
              {groupList.map((g) => (
                <SelectItem key={g.id} value={g.id}>{g.group_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="ex-amt">Amount</Label>
          <Input id="ex-amt" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="ex-desc">Description</Label>
          <Input id="ex-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Dinner, Uber…" required />
        </div>
      </div>

      <div>
        <Label>Split equally between</Label>
        <div className="mt-2 rounded-md border border-border max-h-48 overflow-y-auto divide-y">
          {members.length === 0 ? (
            <p className="p-3 text-sm text-muted-foreground">
              {groupId ? "Loading members…" : "Pick a group to see members."}
            </p>
          ) : members.map((m) => (
            <label key={m.id} className="flex items-center gap-3 p-2.5 cursor-pointer hover:bg-accent">
              <Checkbox
                checked={!!selected[m.id]}
                onCheckedChange={(c) => setSelected((s) => ({ ...s, [m.id]: !!c }))}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{m.full_name}</p>
                <p className="text-xs text-muted-foreground truncate">{m.email}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={create.isPending}>
        {create.isPending ? "Saving…" : "Add expense"}
      </Button>
    </form>
  );
}
