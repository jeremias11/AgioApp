import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function RecentPayments() {
  // Dados simulados
  const recentPayments = [
    {
      id: 1,
      devedor: "João Silva",
      valor: 500,
      data: "2024-01-15",
      status: "recebido",
    },
    {
      id: 2,
      devedor: "Maria Santos",
      valor: 750,
      data: "2024-01-14",
      status: "recebido",
    },
    {
      id: 3,
      devedor: "Pedro Costa",
      valor: 300,
      data: "2024-01-13",
      status: "parcial",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pagamentos Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentPayments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{payment.devedor}</p>
                <p className="text-sm text-muted-foreground">{payment.data}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(payment.valor)}
                </p>
                <Badge variant={payment.status === "recebido" ? "default" : "secondary"}>
                  {payment.status === "recebido" ? "Recebido" : "Parcial"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
