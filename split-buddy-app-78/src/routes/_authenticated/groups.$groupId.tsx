import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Plus,
  Receipt,
  Trash2,
  UserPlus,
  Wallet,
  Users,
} from "lucide-react";

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

export const Route =
  createFileRoute(
    "/_authenticated/groups/$groupId"
  )({
    component:
      GroupDetail,
  });

function GroupDetail() {
  const { groupId } =
    Route.useParams();

  const { user } =
    useAuth();

  const qc =
    useQueryClient();

  const details =
    useQuery({
      queryKey: [
        "group",
        groupId,
      ],
      queryFn: () =>
        api.groupDetails(
          groupId
        ),
    });

  const balances =
    useQuery({
      queryKey: [
        "group",
        groupId,
        "balances",
      ],
      queryFn: () =>
        api.groupBalances(
          groupId
        ),
    });

  const simplified =
    useQuery({
      queryKey: [
        "group",
        groupId,
        "simplified",
      ],
      queryFn: () =>
        api.simplifiedBalances(
          groupId
        ),
    });

  const expenses =
    useQuery({
      queryKey: [
        "group",
        groupId,
        "expenses",
      ],
      queryFn: () =>
        api.groupExpenses(
          groupId
        ),
    });

  const invalidateAll =
    () => {
      qc.invalidateQueries(
        {
          queryKey: [
            "group",
            groupId,
          ],
        }
      );

      qc.invalidateQueries(
        {
          queryKey: [
            "group",
            groupId,
            "balances",
          ],
        }
      );

      qc.invalidateQueries(
        {
          queryKey: [
            "group",
            groupId,
            "expenses",
          ],
        }
      );

      qc.invalidateQueries(
        {
          queryKey: [
            "group",
            groupId,
            "simplified",
          ],
        }
      );

      qc.invalidateQueries(
        {
          queryKey: [
            "balances",
            "direct",
          ],
        }
      );

      qc.invalidateQueries(
        {
          queryKey: [
            "dashboard",
          ],
        }
      );
    };

  const [
    addOpen,
    setAddOpen,
  ] =
    useState(false);

  const [
    memberOpen,
    setMemberOpen,
  ] =
    useState(false);

  const [
    memberName,
    setMemberName,
  ] =
    useState("");

  const [
    memberEmail,
    setMemberEmail,
  ] =
    useState("");

  const addMember =
    useMutation({
      mutationFn:
        () =>
          api.addMember(
            groupId,
            {
              name:
                memberName,
              email:
                memberEmail,
            }
          ),

      onSuccess:
        () => {
          toast.success(
            "Member added 🎉"
          );

          setMemberOpen(
            false
          );

          setMemberName(
            ""
          );

          setMemberEmail(
            ""
          );

          invalidateAll();
        },

      onError: (
        e: Error
      ) =>
        toast.error(
          e.message
        ),
    });

  const removeExpense =
    useMutation({
      mutationFn: (
        id: string
      ) =>
        api.deleteExpense(
          id
        ),

      onSuccess:
        () => {
          toast.success(
            "Expense deleted"
          );

          invalidateAll();
        },

      onError: (
        e: Error
      ) =>
        toast.error(
          e.message
        ),
    });

  const settle =
    useMutation({
      mutationFn: (
        b: {
          receiver_id: string;
          amount: number;
        }
      ) =>
        api.settle({
          group_id:
            groupId,
          ...b,
        }),

      onSuccess:
        () => {
          toast.success(
            "Settled successfully"
          );

          invalidateAll();
        },

      onError: (
        e: Error
      ) =>
        toast.error(
          e.message
        ),
    });

  const d: GroupDetails =
    details.data ??
    {
      id: "",
      group_name:
        "",
      members: [],
    };

  return (
    <AppShell
      title=""
      action={
        <div className="flex items-center gap-2">
          <Link
            to="/groups"
            className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Groups
          </Link>

          <Dialog
            open={
              memberOpen
            }
            onOpenChange={
              setMemberOpen
            }
          >
            <DialogTrigger
              asChild
            >
              <Button
                variant="outline"
                className="rounded-2xl gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Member
              </Button>
            </DialogTrigger>

            <DialogContent className="rounded-[2rem]">
              <DialogHeader>
                <DialogTitle>
                  Add
                  Member
                </DialogTitle>
              </DialogHeader>

              <form
                onSubmit={(
                  e
                ) => {
                  e.preventDefault();
                  addMember.mutate();
                }}
                className="space-y-4"
              >
                <div>
                  <Label>
                    Name
                  </Label>

                  <Input
                    value={
                      memberName
                    }
                    onChange={(
                      e
                    ) =>
                      setMemberName(
                        e
                          .target
                          .value
                      )
                    }
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <Label>
                    Email
                  </Label>

                  <Input
                    type="email"
                    value={
                      memberEmail
                    }
                    onChange={(
                      e
                    ) =>
                      setMemberEmail(
                        e
                          .target
                          .value
                      )
                    }
                    className="rounded-xl"
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="submit"
                    className="rounded-xl"
                  >
                    Add
                    Member
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog
            open={addOpen}
            onOpenChange={
              setAddOpen
            }
          >
            <DialogTrigger
              asChild
            >
              <Button className="rounded-2xl gap-2 shadow-sm">
                <Plus className="h-4 w-4" />
                Expense
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg rounded-[2rem]">
              <DialogHeader>
                <DialogTitle>
                  Add
                  Expense
                </DialogTitle>
              </DialogHeader>

              <AddExpenseForm
                fixedGroupId={
                  groupId
                }
                members={
                  d
                    ?.members ??
                  []
                }
                onDone={() => {
                  setAddOpen(
                    false
                  );

                  invalidateAll();
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      }
    >
      {/* HERO */}
      <div className="rounded-[2rem] overflow-hidden border bg-gradient-to-br from-primary/10 via-background to-primary/5 p-8 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-[2rem] bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold shrink-0">
              {d?.group_name?.[0]?.toUpperCase() ??
                "G"}
            </div>

            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                {d?.group_name ??
                  "Group"}
              </h1>

              <p className="text-muted-foreground mt-2 text-lg">
                {
                  d
                    ?.members
                    ?.length
                }{" "}
                members •
                Shared
                expenses
                💸
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl border bg-background/70 p-5 min-w-[170px]">
              <p className="text-sm text-muted-foreground">
                Expenses
              </p>

              <h2 className="font-bold text-3xl mt-2">
                {expenses
                  .data
                  ?.length ??
                  0}
              </h2>
            </div>

            <div className="rounded-3xl border bg-background/70 p-5 min-w-[170px]">
              <p className="text-sm text-muted-foreground">
                Members
              </p>

              <h2 className="font-bold text-3xl mt-2">
                {
                  d
                    ?.members
                    ?.length
                }
              </h2>
            </div>
          </div>
        </div>
      </div>

      <Tabs
        defaultValue="expenses"
        className="space-y-6"
      >
        <TabsList className="rounded-2xl p-1 h-auto bg-muted w-full flex-wrap justify-start">
          <TabsTrigger
            value="expenses"
            className="rounded-xl px-5 py-2"
          >
            Expenses
          </TabsTrigger>

          <TabsTrigger
            value="balances"
            className="rounded-xl px-5 py-2"
          >
            Balances
          </TabsTrigger>

          <TabsTrigger
            value="simplified"
            className="rounded-xl px-5 py-2"
          >
            Simplified
          </TabsTrigger>

          <TabsTrigger
            value="members"
            className="rounded-xl px-5 py-2"
          >
            Members
          </TabsTrigger>
        </TabsList>

        <TabsContent
  value="expenses"
  className="mt-4"
>
  <div className="grid gap-5">
    {expenses.isLoading ? (
      [...Array(4)].map(
        (_, i) => (
          <Skeleton
            key={i}
            className="h-32 rounded-[2rem]"
          />
        )
      )
    ) : !expenses.data ||
      expenses.data
        .length ===
        0 ? (
      <Card className="rounded-[2rem] border-dashed">
        <CardContent className="py-16">
          <EmptyState
            icon={
              <Receipt className="h-7 w-7" />
            }
            title="No expenses yet"
            desc="Start by adding your first shared expense."
          />
        </CardContent>
      </Card>
    ) : (
      expenses.data.map(
        (
          e: ExpenseItem
        ) => (
          <Card
            key={e.id}
            className="rounded-[2rem] border hover:border-primary/30 hover:shadow-xl transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4 flex-1">
                  <div className="h-14 w-14 rounded-[1.5rem] bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Receipt className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold text-lg truncate">
                      {
                        e.description
                      }
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-sm text-muted-foreground">
                        Paid
                        by
                      </span>

                      <span className="font-medium">
                        {
                          e.paid_by
                        }
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mt-2">
                      {new Date(
                        e.created_at
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-bold text-2xl">
                    {formatMoney(
                      e.amount
                    )}
                  </p>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-3 text-danger hover:text-danger"
                    onClick={() => {
                      if (
                        confirm(
                          "Delete this expense?"
                        )
                      ) {
                        removeExpense.mutate(
                          e.id
                        );
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      )
    )}
  </div>
</TabsContent>

<TabsContent
  value="balances"
  className="mt-4"
>
  <div className="grid gap-4">
    {balances.isLoading ? (
      [...Array(3)].map(
        (_, i) => (
          <Skeleton
            key={i}
            className="h-28 rounded-[2rem]"
          />
        )
      )
    ) : !balances.data ||
      balances.data
        .length ===
        0 ? (
      <Card className="rounded-[2rem] border-dashed">
        <CardContent className="py-16">
          <EmptyState
            icon={
              <Wallet className="h-7 w-7" />
            }
            title="All settled up"
            desc="No pending balances in this group."
          />
        </CardContent>
      </Card>
    ) : (
      balances.data.map(
        (
          b: Balance,
          i
        ) => {
          const youOwe =
            b.from_user
              ?.trim()
              .toLowerCase() ===
            user?.full_name
              ?.trim()
              .toLowerCase();

          const receiver =
            d?.members?.find(
              (
                m
              ) =>
                m.full_name ===
                b.to_user
            );

          return (
            <Card
              key={i}
              className="rounded-[2rem] border hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-lg">
                      {
                        b.from_user
                      }
                    </p>

                    <p className="text-muted-foreground text-sm">
                      owes{" "}
                      {
                        b.to_user
                      }
                    </p>

                    <p
                      className={`font-bold text-2xl mt-3 ${
                        youOwe
                          ? "text-danger"
                          : "text-success"
                      }`}
                    >
                      {formatMoney(
                        b.amount
                      )}
                    </p>
                  </div>

                  {youOwe &&
                    receiver && (
                      <Button
                        onClick={() =>
                          settle.mutate(
                            {
                              receiver_id:
                                receiver.id,
                              amount:
                                b.amount,
                            }
                          )
                        }
                        className="rounded-2xl"
                      >
                        Settle
                      </Button>
                    )}
                </div>
              </CardContent>
            </Card>
          );
        }
      )
    )}
  </div>
</TabsContent>

<TabsContent
  value="simplified"
  className="mt-4"
>
  <BalancesList
    data={
      simplified.data
    }
    loading={
      simplified.isLoading
    }
    members={
      d?.members ??
      []
    }
    onSettle={(
      receiver_id,
      amount
    ) =>
      settle.mutate({
        receiver_id,
        amount,
      })
    }
    currentName={
      user?.full_name
    }
    title="Simplified debts"
  />
</TabsContent>
       <TabsContent
  value="members"
  className="mt-4"
>
  {details.isLoading ? (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(4)].map(
        (_, i) => (
          <Skeleton
            key={i}
            className="h-40 rounded-[2rem]"
          />
        )
      )}
    </div>
  ) : d?.members
      ?.length ===
    0 ? (
    <Card className="rounded-[2rem] border-dashed">
      <CardContent className="py-16">
        <EmptyState
          icon={
            <Users className="h-7 w-7" />
          }
          title="No members"
          desc="Invite friends to split expenses."
        />
      </CardContent>
    </Card>
  ) : (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {d?.members?.map(
        (
          m: Member
        ) => {
          const isYou =
            m.full_name
              ?.trim()
              .toLowerCase() ===
            user?.full_name
              ?.trim()
              .toLowerCase();

          return (
            <Card
              key={m.id}
              className="rounded-[2rem] border hover:shadow-xl hover:border-primary/30 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <Avatar className="h-16 w-16 border">
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                      {m.full_name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {isYou && (
                    <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
                      You
                    </span>
                  )}
                </div>

                <div className="mt-5">
                  <h3 className="font-bold text-lg truncate">
                    {m.full_name}
                  </h3>

                  <p className="text-sm text-muted-foreground truncate mt-2">
                    {m.email}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        }
      )}
    </div>
  )}
</TabsContent>
</Tabs>
</AppShell>
);
}

function BalancesList({
  data,
  loading,
  members,
  onSettle,
  currentName,
  title = "Who owes whom",
}: {
  data:
    | Balance[]
    | undefined;
  loading: boolean;
  members: Member[];
  onSettle: (
    receiverId: string,
    amount: number
  ) => void;
  currentName?: string;
  title?: string;
}) {
  return (
    <Card className="rounded-[2rem]">
      <CardHeader>
        <CardTitle>
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <Skeleton className="h-24" />
        ) : !data ||
          data.length ===
            0 ? (
          <EmptyState
            icon={
              <Wallet className="h-7 w-7" />
            }
            title="All settled up"
            desc="No pending balances."
          />
        ) : (
          <div className="space-y-4">
            {data.map(
              (
                b,
                i
              ) => {
                const fromUser = (b as any).from ?? b.from_user ?? "";
                const toUser = (b as any).to ?? b.to_user ?? "";

                const youOwe =
                  fromUser
                    ?.trim()
                    .toLowerCase() ===
                  currentName
                    ?.trim()
                    .toLowerCase();

                const receiver =
                  members.find(
                    (
                      m
                    ) =>
                      m.full_name ===
                      toUser
                  );

                return (
                  <Card
                    key={i}
                    className="rounded-[1.5rem] border hover:border-primary/30 transition-all"
                  >
                    <CardContent className="p-5 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-lg">
                          {fromUser}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          owes{" "}
                          {toUser}
                        </p>

                        <p
                          className={`font-bold text-xl mt-2 ${
                            youOwe
                              ? "text-danger"
                              : "text-success"
                          }`}
                        >
                          {formatMoney(
                            b.amount
                          )}
                        </p>
                      </div>

                      {youOwe &&
                        receiver && (
                          <Button
                            onClick={() =>
                              onSettle(
                                receiver.id,
                                b.amount
                              )
                            }
                            className="rounded-2xl"
                          >
                            Settle
                          </Button>
                        )}
                    </CardContent>
                  </Card>
                );
              }
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export type {
  GroupDetails,
};