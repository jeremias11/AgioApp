"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { PaymentSuccess } from "@/components/payments/payment-success"

function PaymentSuccessContent() {
  const searchParams = useSearchParams()

  // Em produção, estes dados viriam da API baseado no ID do pagamento
  const paymentData = {
    id: searchParams.get("id") || "1",
    devedor: searchParams.get("devedor") || "João Silva",
    valorPago: Number(searchParams.get("valor")) || 500,
    valorJuros: Number(searchParams.get("juros")) || 250,
    valorCapital: Number(searchParams.get("capital")) || 250,
    dataPagamento: searchParams.get("data") || new Date().toISOString().split("T")[0],
    observacoes: searchParams.get("obs") || "",
    contratoId: "001",
    saldoAnterior: 4200,
    novoSaldo: 3950,
  }

  return <PaymentSuccess paymentData={paymentData} />
}

export default function PaymentSuccessPage() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Pagamento Registrado</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Suspense fallback={<div>Carregando...</div>}>
          <PaymentSuccessContent />
        </Suspense>
      </div>
    </SidebarInset>
  )
}
