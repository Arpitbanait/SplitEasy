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
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Payment history</CardTitle>
              <Badge variant="outline">{(q.data as PaymentItem[])?.length ?? 0} total</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {q.isLoading ? <Skeleton className="h-32" /> : !q.data || (q.data as PaymentItem[]).length === 0 ? (
              <EmptyState icon={<Receipt className="h-6 w-6" />} title="No payments yet" desc="Settle up to see history." />
            ) : (
              <ul className="divide-y">
                {(q.data as PaymentItem[]).map((p) => (
                  <li key={p.id} className="py-4 flex items-start justify-between gap-3 hover:bg-muted/30 px-2 rounded">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        <span className="text-foreground">{p.payer_name}</span>
                        <span className="text-muted-foreground mx-1">→</span>
                        <span className="text-foreground">{p.receiver_name}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(p.created_at).toLocaleDateString()} • {new Date(p.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={p.payment_status === "pending" ? "secondary" : "default"}>
                        {p.payment_status}
                      </Badge>
                      <span className="font-semibold text-sm">{formatMoney(p.amount)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Recent stats</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Total payments</p>
              <p className="text-2xl font-bold">{(q.data as PaymentItem[])?.length ?? 0}</p>
            </div>
            {(q.data as PaymentItem[])?.length > 0 && (
              <>
                <div>
                  <p className="text-xs text-muted-foreground">Latest payment</p>
                  <p className="text-sm font-medium">
                    {new Date((q.data as PaymentItem[])[0]?.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total settled</p>
                  <p className="text-lg font-bold">
                    {formatMoney(
                      (q.data as PaymentItem[]).reduce((s, p) => s + p.amount, 0)
                    )}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
