"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { formatCurrency } from "@/utils/financial"
import { useLoan } from "@/contexts/loan-context"

interface PaymentReportProps {
  startDate: string
  endDate: string
}

export function PaymentReport({ startDate, endDate }: PaymentReportProps) {
  const { receipts } = useLoan()

  // Filtrar recebimentos por período se especificado
  const filteredReceipts = receipts.filter((receipt) => {
    if (!startDate && !endDate) return true

    const receiptDate = new Date(receipt.receiptDate)
    const start = startDate ? new Date(startDate) : new Date("1900-01-01")
    const end = endDate ? new Date(endDate) : new Date("2100-12-31")

    return receiptDate >= start && receiptDate <= end
  })

  const totalRecebido = filteredReceipts.reduce((sum, p) => sum + p.amount, 0)
  const totalJuros = filteredReceipts.reduce((sum, p) => sum + p.interestPortion, 0)
  const totalPrincipal = filteredReceipts.reduce((sum, p) => sum + p.principalPortion, 0)
  const totalRecebimentos = filteredReceipts.length

  // Agrupar recebimentos por dia para o gráfico
  const dailyPayments = (() => {
    const dailyMap = new Map<string, number>()

    filteredReceipts.forEach((receipt) => {
      const day = receipt.receiptDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
      const current = dailyMap.get(day) || 0
      dailyMap.set(day, current + receipt.amount)
    })

    return Array.from(dailyMap.entries())
      .map(([day, amount]) => ({ day, amount }))
      .sort((a, b) => a.day.localeCompare(b.day))
      .slice(0, 10) // Mostrar apenas os últimos 10 dias com recebimentos
  })()

  const getPaymentMethodBadge = (method: string) => {
    switch (method) {
      case "pix":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600">
            PIX
          </Badge>
        )
      case "transferência":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600">
            Transferência
          </Badge>
        )
      case "dinheiro":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-600">
            Dinheiro
          </Badge>
        )
      default:
        return <Badge variant="outline">{method}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Métricas de Recebimentos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalRecebido)}</div>
            <p className="text-sm text-gray-500">Total Recebido</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalJuros)}</div>
            <p className="text-sm text-gray-500">Total de Juros</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalPrincipal)}</div>
            <p className="text-sm text-gray-500">Total Principal</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{totalRecebimentos}</div>
            <p className="text-sm text-gray-500">Nº de Recebimentos</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Recebimentos por Dia */}
      {dailyPayments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recebimentos por Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyPayments}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip formatter={(value: number) => [formatCurrency(value), "Valor"]} />
                <Bar dataKey="amount" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Tabela Detalhada de Recebimentos */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Recebimentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Juros</TableHead>
                  <TableHead>Principal</TableHead>
                  <TableHead>Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReceipts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Nenhum recebimento encontrado no período
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReceipts
                    .sort((a, b) => new Date(b.receiptDate).getTime() - new Date(a.receiptDate).getTime())
                    .map((receipt) => (
                      <TableRow key={receipt.id}>
                        <TableCell>{receipt.receiptDate.toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell className="font-medium">{receipt.clientName}</TableCell>
                        <TableCell>{getPaymentMethodBadge(receipt.paymentMethod)}</TableCell>
                        <TableCell>{formatCurrency(receipt.amount)}</TableCell>
                        <TableCell>{formatCurrency(receipt.interestPortion)}</TableCell>
                        <TableCell>{formatCurrency(receipt.principalPortion)}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{receipt.description || "-"}</TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
