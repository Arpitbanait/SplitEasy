import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { tokenStore } from "@/lib/api";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: () => {
    if (typeof window !== "undefined" && !tokenStore.get()) {
      throw redirect({ to: "/auth" });
    }
  },
  component: () => <Outlet />,
});
