import { requireAuth } from "@/lib/auth";
import { allPlanDays, todayIST } from "@/lib/plan";
import Sidebar from "./Sidebar";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();
  const days = allPlanDays();
  const today = todayIST();
  const idx = days.indexOf(today);
  const dayLabel = idx >= 0 ? `Day ${idx + 1} of ${days.length}` : today < days[0] ? "Starts Oct 20" : "Sprint done";
  const progress = idx >= 0 ? Math.round(((idx + 1) / days.length) * 100) : today < days[0] ? 0 : 100;

  return (
    <div className="app">
      <Sidebar dayLabel={dayLabel} progress={progress} />
      <main className="content">
        <div className="shell">{children}</div>
      </main>
    </div>
  );
}
