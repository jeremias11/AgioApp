import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { DashboardCards } from "@/components/dashboard/dashboard-cards"
import { DashboardChart } from "@/components/dashboard/dashboard-chart"
import { RecentPayments } from "@/components/dashboard/recent-payments"
import { LatePayments } from "@/components/dashboard/late-payments"

export default function Dashboard() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <DashboardCards />
        <div className="grid gap-4 md:grid-cols-2">
          <DashboardChart />
          <RecentPayments />
        </div>
        <LatePayments />
      </div>
    </SidebarInset>
  )
}
