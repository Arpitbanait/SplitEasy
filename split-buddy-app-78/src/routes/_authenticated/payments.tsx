import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Receipt } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { api, type GroupDetails, type GroupSummary, type PaymentItem } from "@/lib/api";
import { AppShell, formatMoney } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "./dashboard";

export const Route = createFileRoute("/_authenticated/payments")({
  component: PaymentsPage,
});

function PaymentsPage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["payments"], queryFn: api.paymentHistory });
  const [open, setOpen] = useState(false);
  const [groupId, setGroupId] = useState<string>("");
  const [receiverId, setReceiverId] = useState<string>("");
  const [amount, setAmount] = useState("");

  const groupsQ = useQuery({ queryKey: ["groups"], queryFn: api.myGroups });
  const detailsQ = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => api.groupDetails(groupId),
    enabled: !!groupId,
  });

  const pay = useMutation({
    mutationFn: () =>
      api.mockPay({ group_id: groupId, receiver_id: receiverId, amount: parseFloat(amount) }),
    onSuccess: () => {
      toast.success("Payment recorded");
      qc.invalidateQueries({ queryKey: ["payments"] });
      qc.invalidateQueries({ queryKey: ["balances", "direct"] });
      qc.invalidateQueries({ queryKey: ["group", groupId] });
      setOpen(false); setAmount(""); setReceiverId("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const groupList: GroupSummary[] = Array.isArray(groupsQ.data)
    ? (groupsQ.data as GroupSummary[])
    : ((groupsQ.data as Record<string, unknown> | undefined)?.["groups"] as GroupSummary[]) ?? [];

  return (
    <AppShell
      title="Payments"
      action={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Mock pay</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Send a mock payment</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); pay.mutate(); }} className="space-y-4">
              <div>
                <Label>Group</Label>
                <Select value={groupId} onValueChange={setGroupId}>
                  <SelectTrigger><SelectValue placeholder="Select group" /></SelectTrigger>
                  <SelectContent>
                    {groupList.map((g) => (
                      <SelectItem key={g.id} value={g.id}>{g.group_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Receiver</Label>
                <Select value={receiverId} onValueChange={setReceiverId} disabled={!groupId}>
                  <SelectTrigger><SelectValue placeholder="Select member" /></SelectTrigger>
                  <SelectContent>
                    {(detailsQ.data as GroupDetails | undefined)?.members.map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.full_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="pa">Amount</Label>
                <Input id="pa" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={pay.isPending || !groupId || !receiverId}>
                  {pay.isPending ? "Paying…" : "Pay"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <Card>
        <CardHeader><CardTitle>Payment history</CardTitle></CardHeader>
        <CardContent>
          {q.isLoading ? <Skeleton className="h-32" /> : !q.data || (q.data as PaymentItem[]).length === 0 ? (
            <EmptyState icon={<Receipt className="h-6 w-6" />} title="No payments yet" desc="Settle up to see history." />
          ) : (
            <ul className="divide-y">
              {(q.data as PaymentItem[]).map((p) => (
                <li key={p.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {p.payer_name} → {p.receiver_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(p.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{p.payment_status}</Badge>
                    <span className="font-semibold">{formatMoney(p.amount)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
