import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { AddExpenseForm } from "@/components/add-expense-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/expenses/new")({
  component: NewExpense,
});

function NewExpense() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  return (
    <AppShell title="New expense">
      <div className="max-w-xl mx-auto">
        <Card>
          <CardHeader><CardTitle>Add an expense</CardTitle></CardHeader>
          <CardContent>
            <AddExpenseForm
              onDone={() => {
                qc.invalidateQueries();
                navigate({ to: "/dashboard" });
              }}
            />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
