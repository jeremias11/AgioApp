"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/utils/financial"

interface ClientReportProps {
  startDate: string
  endDate: string
}

// Dados mockados para demonstração
const clientData = [
  {
    id: "c1",
    name: "João Silva",
    totalEmprestado: 25000,
    totalPago: 18000,
    saldoDevedor: 7000,
    contratoAtivos: 2,
    status: "active",
    ultimoPagamento: new Date("2024-02-10"),
  },
  {
    id: "c2",
    name: "Maria Santos",
    totalEmprestado: 50000,
    totalPago: 35000,
    saldoDevedor: 15000,
    contratoAtivos: 1,
    status: "overdue",
    ultimoPagamento: new Date("2024-01-15"),
  },
  {
    id: "c3",
    name: "Pedro Costa",
    totalEmprestado: 15000,
    totalPago: 15000,
    saldoDevedor: 0,
    contratoAtivos: 0,
    status: "paid",
    ultimoPagamento: new Date("2024-01-20"),
  },
  {
    id: "c4",
    name: "Ana Oliveira",
    totalEmprestado: 30000,
    totalPago: 22000,
    saldoDevedor: 8000,
    contratoAtivos: 1,
    status: "active",
    ultimoPagamento: new Date("2024-02-05"),
  },
]

export function ClientReport({ startDate, endDate }: ClientReportProps) {
  const totalClientes = clientData.length
  const clientesAtivos = clientData.filter((c) => c.status === "active").length
  const clientesInadimplentes = clientData.filter((c) => c.status === "overdue").length
  const ticketMedio = clientData.reduce((sum, c) => sum + c.totalEmprestado, 0) / totalClientes

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Ativo</Badge>
      case "overdue":
        return <Badge variant="destructive">Atrasado</Badge>
      case "paid":
        return <Badge variant="secondary">Quitado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Métricas de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{totalClientes}</div>
            <p className="text-sm text-gray-500">Total de Clientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{clientesAtivos}</div>
            <p className="text-sm text-gray-500">Clientes Ativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{clientesInadimplentes}</div>
            <p className="text-sm text-gray-500">Inadimplentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(ticketMedio)}</div>
            <p className="text-sm text-gray-500">Ticket Médio</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela Detalhada de Clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Relatório Detalhado por Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Total Emprestado</TableHead>
                  <TableHead>Total Pago</TableHead>
                  <TableHead>Saldo Devedor</TableHead>
                  <TableHead>Contratos Ativos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Pagamento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientData.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{formatCurrency(client.totalEmprestado)}</TableCell>
                    <TableCell>{formatCurrency(client.totalPago)}</TableCell>
                    <TableCell>{formatCurrency(client.saldoDevedor)}</TableCell>
                    <TableCell>{client.contratoAtivos}</TableCell>
                    <TableCell>{getStatusBadge(client.status)}</TableCell>
                    <TableCell>{client.ultimoPagamento.toLocaleDateString("pt-BR")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
