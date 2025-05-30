"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle } from "lucide-react"

export function LatePayments() {
  // Dados simulados
  const latePayments = [
    {
      id: 1,
      devedor: "Carlos Oliveira",
      telefone: "11999887766",
      valorPendente: 850,
      diasAtraso: 15,
      ultimoPagamento: "2023-12-20",
    },
    {
      id: 2,
      devedor: "Ana Ferreira",
      telefone: "11888776655",
      valorPendente: 1200,
      diasAtraso: 8,
      ultimoPagamento: "2024-01-07",
    },
  ]

  const handleWhatsApp = (telefone: string, nome: string, valor: number) => {
    const message = `Olá ${nome}, você tem um pagamento pendente de ${new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)}. Por favor, entre em contato para regularizar.`

    const url = `https://wa.me/55${telefone}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pagamentos em Atraso</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {latePayments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{payment.devedor}</p>
                  <Badge variant="destructive">{payment.diasAtraso} dias</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Último pagamento: {payment.ultimoPagamento}</p>
                <p className="text-sm font-medium text-red-600">
                  Pendente:{" "}
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(payment.valorPendente)}
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => handleWhatsApp(payment.telefone, payment.devedor, payment.valorPendente)}
                className="bg-green-600 hover:bg-green-700"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
