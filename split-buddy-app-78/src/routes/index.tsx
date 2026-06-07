import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Receipt, Users, Wallet, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary grid place-items-center text-primary-foreground font-bold">S</div>
            <span className="font-display text-xl font-bold">SplitEasy</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              to="/auth"
              className="rounded-md px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground"
            >
              Log in
            </Link>
            <Link
              to="/auth"
              search={{ tab: "signup" } as never}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Sign up free
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-6 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Zap className="h-3.5 w-3.5" /> Real-time balances
          </div>
          <h1 className="mt-6 font-display text-5xl sm:text-6xl font-bold tracking-tight">
            Share expenses<br />
            <span className="text-primary">without the awkwardness.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Track group spending, settle up in a tap, and never chase your friends for money again.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              to="/auth"
              search={{ tab: "signup" } as never}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center rounded-md border border-input bg-background px-6 py-3 text-base font-semibold hover:bg-accent"
            >
              I have an account
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Users, title: "Groups for everything", desc: "Trips, roommates, dinners — keep them organised." },
              { icon: Receipt, title: "Equal splits, instantly", desc: "Add an expense, pick who's in, balances update live." },
              { icon: Wallet, title: "Settle up in a tap", desc: "Mock payments now, real ones soon. No more IOU lists." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-6">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} SplitEasy
      </footer>
    </div>
  );
}
