"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { formatCurrency } from "@/utils/financial"

interface FinancialReportProps {
  startDate: string
  endDate: string
}

// Dados mockados para demonstração
const monthlyData = [
  { month: "Jan", emprestado: 50000, recebido: 15000, juros: 8000 },
  { month: "Fev", emprestado: 75000, recebido: 22000, juros: 12000 },
  { month: "Mar", emprestado: 60000, recebido: 28000, juros: 15000 },
  { month: "Abr", emprestado: 80000, recebido: 25000, juros: 13000 },
  { month: "Mai", emprestado: 45000, recebido: 30000, juros: 18000 },
  { month: "Jun", emprestado: 90000, recebido: 35000, juros: 20000 },
]

const statusData = [
  { name: "Ativos", value: 65, color: "#22c55e" },
  { name: "Atrasados", value: 20, color: "#ef4444" },
  { name: "Quitados", value: 15, color: "#6b7280" },
]

const metrics = {
  totalEmprestado: 400000,
  totalRecebido: 155000,
  totalJuros: 86000,
  inadimplencia: 8.5,
  ticketMedio: 22500,
  roi: 21.5,
}

export function FinancialReport({ startDate, endDate }: FinancialReportProps) {
  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(metrics.totalEmprestado)}</div>
            <p className="text-sm text-gray-500">Total Emprestado</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(metrics.totalRecebido)}</div>
            <p className="text-sm text-gray-500">Total Recebido</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(metrics.totalJuros)}</div>
            <p className="text-sm text-gray-500">Total de Juros</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{metrics.inadimplencia}%</div>
            <p className="text-sm text-gray-500">Inadimplência</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(metrics.ticketMedio)}</div>
            <p className="text-sm text-gray-500">Ticket Médio</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-indigo-600">{metrics.roi}%</div>
            <p className="text-sm text-gray-500">ROI</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolução Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip formatter={(value: number) => [formatCurrency(value), ""]} />
                <Bar dataKey="emprestado" fill="#3b82f6" name="Emprestado" />
                <Bar dataKey="recebido" fill="#22c55e" name="Recebido" />
                <Bar dataKey="juros" fill="#8b5cf6" name="Juros" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status dos Contratos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tendência de Juros */}
      <Card>
        <CardHeader>
          <CardTitle>Tendência de Recebimento de Juros</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${value / 1000}k`} />
              <Tooltip formatter={(value: number) => [formatCurrency(value), "Juros"]} />
              <Line type="monotone" dataKey="juros" stroke="#8b5cf6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
