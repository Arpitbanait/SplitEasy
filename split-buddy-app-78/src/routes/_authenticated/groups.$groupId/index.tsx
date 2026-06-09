import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Receipt, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { api, type ExpenseItem, type GroupDetails } from "@/lib/api";
import { formatMoney } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AddExpenseForm } from "@/components/add-expense-form";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "../dashboard";

export const Route = createFileRoute("/_authenticated/groups/$groupId/")({
  component: GroupExpenses,
});

function GroupExpenses() {
  const { groupId } = Route.useParams();
  const qc = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);

  const details = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => api.groupDetails(groupId),
  });

  const expenses = useQuery({
    queryKey: ["group", groupId, "expenses"],
    queryFn: () => api.groupExpenses(groupId),
  });

  const removeExpense = useMutation({
    mutationFn: (id: string) => api.deleteExpense(id),
    onSuccess: () => {
      toast.success("Expense deleted");
      qc.invalidateQueries({ queryKey: ["group", groupId, "expenses"] });
      qc.invalidateQueries({ queryKey: ["group", groupId] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["group", groupId, "expenses"] });
    qc.invalidateQueries({ queryKey: ["group", groupId] });
    qc.invalidateQueries({ queryKey: ["dashboard"] });
  };

  const members = (details.data as GroupDetails | undefined)?.members ?? [];

  return (
    <div className="space-y-4">
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
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditingExpense(e);
                        setEditOpen(true);
                      }}
                      aria-label="Edit expense"
                    >
                      <Pencil className="h-4 w-4 text-foreground" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => { if (confirm("Delete this expense?")) removeExpense.mutate(e.id); }}
                      aria-label="Delete expense"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={(open) => { if (!open) setEditingExpense(null); setEditOpen(open); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Edit expense</DialogTitle></DialogHeader>
          <AddExpenseForm
            fixedGroupId={groupId}
            members={members}
            expense={editingExpense}
            submitLabel="Save changes"
            onDone={() => {
              setEditOpen(false);
              setEditingExpense(null);
              invalidate();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
