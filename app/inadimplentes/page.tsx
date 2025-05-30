import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { LatePaymentsList } from "@/components/late-payments/late-payments-list"

export default function LatePaymentsPage() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Inadimplentes</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <LatePaymentsList />
      </div>
    </SidebarInset>
  )
}
