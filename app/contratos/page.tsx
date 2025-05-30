import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { ContractsList } from "@/components/contracts/contracts-list"

export default function ContractsPage() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Contratos</h1>
        <div className="ml-auto">
          <Button asChild>
            <Link href="/contratos/novo">
              <Plus className="h-4 w-4 mr-2" />
              Novo Contrato
            </Link>
          </Button>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <ContractsList />
      </div>
    </SidebarInset>
  )
}
