import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Receipt, Trash2, UserPlus, Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { api, type Balance, type ExpenseItem, type GroupDetails, type Member } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { AppShell, formatMoney } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { AddExpenseForm } from "@/components/add-expense-form";
import { EmptyState } from "./dashboard";

export const Route = createFileRoute("/_authenticated/groups/$groupId")({
  component: GroupDetail,
});

function GroupDetail() {
  const { groupId } = Route.useParams();
  const { user } = useAuth();
  const qc = useQueryClient();

  const details = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => api.groupDetails(groupId),
  });
  const balances = useQuery({
    queryKey: ["group", groupId, "balances"],
    queryFn: () => api.groupBalances(groupId),
  });
  const simplified = useQuery({
    queryKey: ["group", groupId, "simplified"],
    queryFn: () => api.simplifiedBalances(groupId),
  });
  const expenses = useQuery({
    queryKey: ["group", groupId, "expenses"],
    queryFn: () => api.groupExpenses(groupId),
  });

  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: ["group", groupId] });
    qc.invalidateQueries({ queryKey: ["balances", "direct"] });
    qc.invalidateQueries({ queryKey: ["dashboard"] });
  };

  const [addOpen, setAddOpen] = useState(false);
  const [memberOpen, setMemberOpen] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");

  const addMember = useMutation({
    mutationFn: () => api.addMember(groupId, { name: memberName, email: memberEmail }),
    onSuccess: () => {
      toast.success("Member added");
      setMemberOpen(false);
      setMemberName(""); setMemberEmail("");
      invalidateAll();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeExpense = useMutation({
    mutationFn: (id: string) => api.deleteExpense(id),
    onSuccess: () => { toast.success("Expense deleted"); invalidateAll(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const settle = useMutation({
    mutationFn: (b: { receiver_id: string; amount: number }) =>
      api.settle({ group_id: groupId, ...b }),
    onSuccess: () => { toast.success("Marked as settled"); invalidateAll(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const d = details.data;

  return (
    <AppShell
      title={d?.group_name ?? "Group"}
      action={
        <>
          <Link to="/groups" className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Groups
          </Link>
          <Dialog open={memberOpen} onOpenChange={setMemberOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <UserPlus className="h-4 w-4" /> Add member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add a member</DialogTitle></DialogHeader>
              <form
                onSubmit={(e) => { e.preventDefault(); addMember.mutate(); }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="mn">Name</Label>
                  <Input id="mn" value={memberName} onChange={(e) => setMemberName(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="me">Email</Label>
                  <Input id="me" type="email" value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} required />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={addMember.isPending}>
                    {addMember.isPending ? "Adding…" : "Add"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" /> Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Add expense</DialogTitle></DialogHeader>
              <AddExpenseForm
                fixedGroupId={groupId}
                members={d?.members ?? []}
                onDone={() => { setAddOpen(false); invalidateAll(); }}
              />
            </DialogContent>
          </Dialog>
        </>
      }
    >
      <Tabs defaultValue="expenses">
        <TabsList>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="balances">Balances</TabsTrigger>
          <TabsTrigger value="simplified">Simplified</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="mt-4">
          <Card>
            <CardHeader><CardTitle>All expenses</CardTitle></CardHeader>
            <CardContent>
              {expenses.isLoading ? (
                <Skeleton className="h-32" />
              ) : !expenses.data || expenses.data.length === 0 ? (
                <EmptyState icon={<Receipt className="h-6 w-6" />} title="No expenses yet" desc="Add the first one." />
              ) : (
                <ul className="divide-y">
                  {expenses.data.map((e: ExpenseItem) => (
                    <li key={e.id} className="py-3 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-primary/10 text-primary grid place-items-center shrink-0">
                        <Receipt className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{e.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Paid by {e.paid_by} · {new Date(e.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatMoney(e.amount)}</p>
                      </div>
                      <Button
                        size="icon" variant="ghost"
                        onClick={() => { if (confirm("Delete this expense?")) removeExpense.mutate(e.id); }}
                      >
                        <Trash2 className="h-4 w-4 text-danger" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="balances" className="mt-4">
          <BalancesList
            data={balances.data} loading={balances.isLoading}
            members={d?.members ?? []}
            onSettle={(receiver_id, amount) => settle.mutate({ receiver_id, amount })}
            currentName={user?.name}
          />
        </TabsContent>

        <TabsContent value="simplified" className="mt-4">
          <BalancesList
            data={simplified.data} loading={simplified.isLoading}
            members={d?.members ?? []}
            onSettle={(receiver_id, amount) => settle.mutate({ receiver_id, amount })}
            currentName={user?.name}
            title="Simplified debts"
          />
        </TabsContent>

        <TabsContent value="members" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Members</CardTitle></CardHeader>
            <CardContent>
              {details.isLoading ? <Skeleton className="h-24" /> : (
                <ul className="divide-y">
                  {d?.members.map((m: Member) => (
                    <li key={m.id} className="py-3 flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/15 text-primary">
                          {m.full_name[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{m.full_name}</p>
                        <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

function BalancesList({
  data, loading, members, onSettle, currentName, title = "Who owes whom",
}: {
  data: Balance[] | undefined;
  loading: boolean;
  members: Member[];
  onSettle: (receiverId: string, amount: number) => void;
  currentName?: string;
  title?: string;
}) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        {loading ? <Skeleton className="h-24" /> : !data || data.length === 0 ? (
          <EmptyState icon={<Wallet className="h-6 w-6" />} title="All settled up" desc="No outstanding balances." />
        ) : (
          <ul className="divide-y">
            {data.map((b, i) => {
              const youOwe = b.from_user === currentName;
              const receiver = members.find((m) => m.full_name === b.to_user);
              return (
                <li key={i} className="py-3 flex items-center justify-between gap-3">
                  <div className="text-sm">
                    <span className="font-semibold">{b.from_user}</span>{" "}
                    <span className="text-muted-foreground">owes</span>{" "}
                    <span className="font-semibold">{b.to_user}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={youOwe ? "text-danger font-semibold" : "text-success font-semibold"}>
                      {formatMoney(b.amount)}
                    </span>
                    {youOwe && receiver && (
                      <Button size="sm" variant="outline" onClick={() => onSettle(receiver.id, b.amount)}>
                        Settle
                      </Button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

// Re-export for typing
export type { GroupDetails };
