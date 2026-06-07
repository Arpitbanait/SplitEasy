import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Search = { tab?: "login" | "signup" };

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>): Search => ({
    tab: s.tab === "signup" ? "signup" : "login",
  }),
  component: AuthPage,
});

function AuthPage() {
  const { tab } = Route.useSearch();
  const { login, signup, user, loading } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard" });
  }, [user, loading, navigate]);

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await login(String(fd.get("email")), String(fd.get("password")));
      toast.success("Welcome back!");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  };

  const onSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await signup(
        String(fd.get("name")),
        String(fd.get("email")),
        String(fd.get("password")),
      );
      toast.success("Account created!");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary/10 via-background to-accent/30">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-primary grid place-items-center text-primary-foreground font-bold">S</div>
          <span className="font-display text-xl font-bold">SplitEasy</span>
        </Link>
        <div>
          <h2 className="font-display text-4xl font-bold leading-tight">
            Stop chasing your friends for ₹200.
          </h2>
          <p className="mt-4 text-muted-foreground max-w-md">
            One place to track expenses, settle debts, and keep group trips drama-free.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">© SplitEasy</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary grid place-items-center text-primary-foreground font-bold">S</div>
            <span className="font-display text-xl font-bold">SplitEasy</span>
          </div>
          <Tabs defaultValue={tab ?? "login"} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Log in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6">
              <h1 className="font-display text-2xl font-bold">Welcome back</h1>
              <p className="text-sm text-muted-foreground mt-1">Log in to your SplitEasy account.</p>
              <form onSubmit={onLogin} className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="li-email">Email</Label>
                  <Input id="li-email" name="email" type="email" required autoComplete="email" />
                </div>
                <div>
                  <Label htmlFor="li-password">Password</Label>
                  <Input id="li-password" name="password" type="password" required autoComplete="current-password" />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Logging in…" : "Log in"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <h1 className="font-display text-2xl font-bold">Create your account</h1>
              <p className="text-sm text-muted-foreground mt-1">Free forever for small groups.</p>
              <form onSubmit={onSignup} className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="su-name">Full name</Label>
                  <Input id="su-name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="su-email">Email</Label>
                  <Input id="su-email" name="email" type="email" required autoComplete="email" />
                </div>
                <div>
                  <Label htmlFor="su-password">Password</Label>
                  <Input id="su-password" name="password" type="password" required minLength={6} autoComplete="new-password" />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Creating account…" : "Create account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
