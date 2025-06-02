"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ReceiptGenerator } from "./receipt-generator"

export function PaymentsList() {
  // Dados simulados
  const payments = [
    {
      id: 1,
      devedor: "João Silva",
      dataPagamento: "2024-01-15",
      valorPago: 500,
      valorJuros: 250,
      valorCapital: 250,
      observacoes: "Pagamento em dia",
      tipo: "completo",
    },
    {
      id: 2,
      devedor: "Maria Santos",
      dataPagamento: "2024-01-14",
      valorPago: 120,
      valorJuros: 120,
      valorCapital: 0,
      observacoes: "Pagamento parcial - só juros",
      tipo: "parcial",
    },
    {
      id: 3,
      devedor: "Pedro Costa",
      dataPagamento: "2024-01-13",
      valorPago: 800,
      valorJuros: 300,
      valorCapital: 500,
      observacoes: "Pagamento com valor extra",
      tipo: "completo",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Pagamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Devedor</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Valor Pago</TableHead>
              <TableHead>Juros</TableHead>
              <TableHead>Capital</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Observações</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.devedor}</TableCell>
                <TableCell>{payment.dataPagamento}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(payment.valorPago)}
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(payment.valorJuros)}
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(payment.valorCapital)}
                </TableCell>
                <TableCell>
                  <Badge variant={payment.tipo === "completo" ? "default" : "secondary"}>
                    {payment.tipo === "completo" ? "Completo" : "Parcial"}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate">{payment.observacoes}</TableCell>
                <TableCell>
                  <ReceiptGenerator
                    paymentData={{
                      id: payment.id.toString(),
                      devedor: payment.devedor,
                      valorPago: payment.valorPago,
                      valorJuros: payment.valorJuros,
                      valorCapital: payment.valorCapital,
                      dataPagamento: payment.dataPagamento,
                      observacoes: payment.observacoes,
                      contratoId: "001",
                      saldoAnterior: payment.valorPago + 1000,
                      novoSaldo: 1000,
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
