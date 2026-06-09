import { createFileRoute } from "@tanstack/react-router";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Receipt,
  Wallet,
  Sparkles,
  ArrowRight,
  CreditCard,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  api,
  type GroupDetails,
  type GroupSummary,
  type PaymentItem,
} from "@/lib/api";

import {
  AppShell,
  formatMoney,
} from "@/components/app-shell";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { EmptyState } from "./dashboard";

export const Route =
  createFileRoute(
    "/_authenticated/payments"
  )({
    component:
      PaymentsPage,
  });

function PaymentsPage() {
  const qc =
    useQueryClient();

  const [open,
setOpen] =
    useState(false);

  const [groupId,
setGroupId] =
    useState("");

  const [receiverId,
setReceiverId] =
    useState("");

  const [amount,
setAmount] =
    useState("");

  const q =
    useQuery({
      queryKey: [
        "payments",
      ],
      queryFn:
        api.paymentHistory,
      refetchOnWindowFocus:
        true,
    });

  const groupsQ =
    useQuery({
      queryKey: [
        "groups",
      ],
      queryFn:
        api.myGroups,
    });

  const detailsQ =
    useQuery({
      queryKey: [
        "group",
        groupId,
      ],
      queryFn:
        () =>
          api.groupDetails(
            groupId
          ),
      enabled:
        !!groupId,
    });

  const pay =
    useMutation({
      mutationFn:
        () =>
          api.mockPay({
            group_id:
              groupId,
            receiver_id:
              receiverId,
            amount:
              parseFloat(
                amount
              ),
          }),

      onSuccess:
        async () => {
          toast.success(
            "Payment recorded"
          );

          setOpen(
            false
          );

          setAmount(
            ""
          );

          setReceiverId(
            ""
          );

          setGroupId(
            ""
          );

          await Promise.all(
            [
              qc.invalidateQueries(
                {
                  queryKey:
                    [
                      "payments",
                    ],
                }
              ),

              qc.invalidateQueries(
                {
                  queryKey:
                    [
                      "balances",
                    ],
                }
              ),

              qc.invalidateQueries(
                {
                  queryKey:
                    [
                      "balances",
                      "direct",
                    ],
                }
              ),

              qc.invalidateQueries(
                {
                  queryKey:
                    [
                      "group-balances",
                    ],
                }
              ),
            ]
          );
        },

      onError: (
        e: Error
      ) =>
        toast.error(
          e.message
        ),
    });

  const payments =
    Array.isArray(
      q.data
    )
      ? q.data
      : [];

  const groupList:
    GroupSummary[] =
    Array.isArray(
      groupsQ.data
    )
      ? groupsQ.data
      : (
          (
            groupsQ.data as Record<
              string,
              unknown
            >
          )?.groups as GroupSummary[]
        ) ??
        [];

  const totalSettled =
    payments.reduce(
      (
        sum,
        p
      ) =>
        sum +
        p.amount,
      0
    );

  return (
    <AppShell
      title="Payments"
      action={
        <Dialog
          open={
            open
          }
          onOpenChange={
            setOpen
          }
        >
          <DialogTrigger
            asChild
          >
            <Button className="rounded-2xl">
              <CreditCard className="h-4 w-4 mr-2" />
              Make Payment
            </Button>
          </DialogTrigger>

                    <DialogContent className="sm:max-w-lg rounded-[2rem] border-0 p-0 overflow-hidden">
            <div className="bg-gradient-to-br from-primary/10 via-background to-primary/5 p-8 border-b">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <Wallet className="h-6 w-6 text-primary" />
                  Send Payment
                </DialogTitle>

                <p className="text-muted-foreground mt-2">
                  Quickly settle balances with your group members.
                </p>
              </DialogHeader>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                pay.mutate();
              }}
              className="p-6 space-y-5"
            >
              <div className="space-y-2">
                <Label>
                  Group
                </Label>

                <Select
                  value={
                    groupId
                  }
                  onValueChange={
                    setGroupId
                  }
                >
                  <SelectTrigger className="rounded-2xl h-12">
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>

                  <SelectContent>
                    {groupList.map(
                      (
                        g
                      ) => (
                        <SelectItem
                          key={
                            g.id
                          }
                          value={
                            g.id
                          }
                        >
                          {
                            g.group_name
                          }
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  Receiver
                </Label>

                <Select
                  value={
                    receiverId
                  }
                  onValueChange={
                    setReceiverId
                  }
                  disabled={
                    !groupId
                  }
                >
                  <SelectTrigger className="rounded-2xl h-12">
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>

                  <SelectContent>
                    {(
                      detailsQ.data as
                        | GroupDetails
                        | undefined
                    )?.members.map(
                      (
                        m
                      ) => (
                        <SelectItem
                          key={
                            m.id
                          }
                          value={
                            m.id
                          }
                        >
                          {
                            m.full_name
                          }
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">
                  Amount
                </Label>

                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="₹ 0.00"
                  value={
                    amount
                  }
                  onChange={(
                    e
                  ) =>
                    setAmount(
                      e.target
                        .value
                    )
                  }
                  className="rounded-2xl h-12"
                  required
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="submit"
                  disabled={
                    pay.isPending ||
                    !groupId ||
                    !receiverId ||
                    !amount
                  }
                  className="rounded-2xl w-full h-12 text-base"
                >
                  {pay.isPending
                    ? "Processing..."
                    : "Send Payment"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="space-y-6">

        {/* HERO */}
        <div className="rounded-[2rem] overflow-hidden border bg-gradient-to-br from-primary/10 via-background to-primary/5 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <p className="text-sm text-primary font-medium">
                  Payments Overview
                </p>
              </div>

              <h1 className="text-4xl font-bold tracking-tight">
                {formatMoney(
                  totalSettled
                )}
              </h1>

              <p className="text-muted-foreground mt-2 text-lg">
                Total money settled across all payments 💸
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <StatCard
                label="Payments"
                value={`${payments.length}`}
              />

              <StatCard
                label="Settled"
                value={formatMoney(
                  totalSettled
                )}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="rounded-[2rem] border lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Payment History
                </CardTitle>

                <Badge
                  variant="outline"
                  className="rounded-full"
                >
                  {
                    payments.length
                  }{" "}
                  total
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              {q.isLoading ? (
                <Skeleton className="h-52 rounded-[2rem]" />
              ) : payments.length ===
                0 ? (
                <EmptyState
                  icon={
                    <Receipt className="h-6 w-6" />
                  }
                  title="No payments yet"
                  desc="Settle up to see payment history."
                />
              ) : (
                <div className="space-y-4">
                  {payments.map(
                    (
                      p: PaymentItem
                    ) => (
                      <Card
                        key={
                          p.id
                        }
                        className="rounded-[2rem] border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                      >
                        <CardContent className="p-5 flex items-center justify-between">
                          <div>
                            <p className="font-medium flex items-center gap-2">
                              <span>
                                {
                                  p.payer_name
                                }
                              </span>

                              <ArrowRight className="h-4 w-4 text-muted-foreground" />

                              <span>
                                {
                                  p.receiver_name
                                }
                              </span>
                            </p>

                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(
                                p.created_at
                              ).toLocaleDateString()}{" "}
                              •{" "}
                              {new Date(
                                p.created_at
                              ).toLocaleTimeString()}
                            </p>
                          </div>

                          <div className="text-right">
                            <Badge
                              className="rounded-full mb-2"
                              variant={
                                p.payment_status ===
                                "pending"
                                  ? "secondary"
                                  : "default"
                              }
                            >
                              {
                                p.payment_status
                              }
                            </Badge>

                            <p className="font-bold text-lg">
                              {formatMoney(
                                p.amount
                              )}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border">
            <CardHeader>
              <CardTitle className="text-base">
                Recent Stats
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <StatRow
                label="Total payments"
                value={`${payments.length}`}
              />

              {payments.length >
                0 && (
                <>
                  <StatRow
                    label="Latest payment"
                    value={new Date(
                      payments[0]
                        ?.created_at
                    ).toLocaleDateString()}
                  />

                  <StatRow
                    label="Total settled"
                    value={formatMoney(
                      totalSettled
                    )}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({
  label,
  value,
}: any) {
  return (
    <div className="rounded-3xl bg-background/80 backdrop-blur-md border p-4 min-w-[180px]">
      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <h3 className="font-bold text-2xl mt-2">
        {value}
      </h3>
    </div>
  );
}

function StatRow({
  label,
  value,
}: any) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="font-semibold text-lg">
        {value}
      </p>
    </div>
  );
}