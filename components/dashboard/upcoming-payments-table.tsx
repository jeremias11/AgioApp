"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { MessageSquare, Phone } from "lucide-react"
import { formatCurrency } from "@/utils/financial"

interface Payment {
  id: string
  client: string
  amount: number
  dueDate: Date
  daysLeft: number
}

interface UpcomingPaymentsTableProps {
  payments: Payment[]
}

export function UpcomingPaymentsTable({ payments }: UpcomingPaymentsTableProps) {
  const handleWhatsApp = (client: string) => {
    alert(`Enviando mensagem para ${client}`)
    // Implementação real: window.open(`https://wa.me/55NUMERO?text=Olá ${client}, ...`)
  }

  const handleCall = (client: string) => {
    alert(`Ligando para ${client}`)
    // Implementação real: window.open(`tel:NUMERO`)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Dias Restantes</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                Nenhum pagamento próximo encontrado
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.client}</TableCell>
                <TableCell>{formatCurrency(payment.amount)}</TableCell>
                <TableCell>{payment.dueDate.toLocaleDateString("pt-BR")}</TableCell>
                <TableCell>{payment.daysLeft} dias</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="outline" onClick={() => handleWhatsApp(payment.client)}>
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleCall(payment.client)}>
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
