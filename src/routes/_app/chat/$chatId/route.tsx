import { TripPreview } from "@/features/trip-preview";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/chat/$chatId")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Outlet />
      <TripPreview />
    </>
  );
}
