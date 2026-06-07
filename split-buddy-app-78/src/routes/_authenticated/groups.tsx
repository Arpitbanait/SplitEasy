import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { api, type GroupSummary } from "@/lib/api";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { EmptyState } from "./dashboard";

export const Route = createFileRoute("/_authenticated/groups")({
  component: GroupsPage,
});

function GroupsPage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["groups"], queryFn: api.myGroups });
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const create = useMutation({
    mutationFn: (group_name: string) => api.createGroup(group_name),
    onSuccess: () => {
      toast.success("Group created");
      qc.invalidateQueries({ queryKey: ["groups"] });
      setOpen(false);
      setName("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const list: GroupSummary[] = Array.isArray(q.data)
    ? (q.data as GroupSummary[])
    : ((q.data as Record<string, unknown> | undefined)?.["groups"] as GroupSummary[]) ?? [];

  return (
    <AppShell
      title="Groups"
      action={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="h-4 w-4" /> New group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create a group</DialogTitle></DialogHeader>
            <form
              onSubmit={(e) => { e.preventDefault(); if (name.trim()) create.mutate(name.trim()); }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="gname">Group name</Label>
                <Input id="gname" value={name} onChange={(e) => setName(e.target.value)} placeholder="Goa Trip" required />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={create.isPending}>
                  {create.isPending ? "Creating…" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      {q.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          icon={<Users className="h-6 w-6" />}
          title="No groups yet"
          desc="Create your first group to start splitting expenses."
          action={
            <Button onClick={() => setOpen(true)} className="gap-1">
              <Plus className="h-4 w-4" /> New group
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((g) => (
            <Link key={g.id} to="/groups/$groupId" params={{ groupId: g.id }}>
              <Card className="hover:border-primary/50 transition-colors h-full">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-lg bg-primary/15 text-primary grid place-items-center font-bold text-lg shrink-0">
                      {g.group_name?.[0]?.toUpperCase() ?? "G"}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{g.group_name}</p>
                      <p className="text-xs text-muted-foreground mt-1">Tap to view balances</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
