import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { api, type GroupDetails } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddExpenseForm } from "@/components/add-expense-form";

export const Route = createFileRoute("/_authenticated/groups/$groupId/_layout")({
  component: GroupLayout,
});

function GroupLayout() {
  const { groupId } = Route.useParams();
  const { user } = useAuth();
  const qc = useQueryClient();

  const [memberOpen, setMemberOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");

  const details = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => api.groupDetails(groupId),
  });

  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: ["group", groupId] });
    qc.invalidateQueries({ queryKey: ["balances", "direct"] });
    qc.invalidateQueries({ queryKey: ["dashboard"] });
  };

  const addMember = useMutation({
    mutationFn: () => api.addMember(groupId, { name: memberName, email: memberEmail }),
    onSuccess: () => {
      toast.success("Member added");
      setMemberOpen(false);
      setMemberName("");
      setMemberEmail("");
      invalidateAll();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const activeTab = pathname.endsWith("/balances")
    ? "balances"
    : pathname.endsWith("/simplified")
    ? "simplified"
    : pathname.endsWith("/members")
    ? "members"
    : "expenses";

  const members = (details.data as GroupDetails | undefined)?.members ?? [];
  const title = (details.data as GroupDetails | undefined)?.group_name ?? "Group";

  return (
    <AppShell
      title={title}
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
                members={members}
                onDone={() => { setAddOpen(false); invalidateAll(); }}
              />
            </DialogContent>
          </Dialog>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-muted p-3">
          <Link
            to={`/groups/${groupId}`}
            className={`rounded-md px-3 py-2 text-sm font-medium transition ${activeTab === "expenses" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/80"}`}
          >
            Expenses
          </Link>
          <Link
            to={`/groups/${groupId}/balances`}
            className={`rounded-md px-3 py-2 text-sm font-medium transition ${activeTab === "balances" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/80"}`}
          >
            Balances
          </Link>
          <Link
            to={`/groups/${groupId}/simplified`}
            className={`rounded-md px-3 py-2 text-sm font-medium transition ${activeTab === "simplified" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/80"}`}
          >
            Simplified
          </Link>
          <Link
            to={`/groups/${groupId}/members`}
            className={`rounded-md px-3 py-2 text-sm font-medium transition ${activeTab === "members" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/80"}`}
          >
            Members
          </Link>
        </div>
        <Outlet />
      </div>
    </AppShell>
  );
}
