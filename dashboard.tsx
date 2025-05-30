"use client"

import { useState } from "react"
import { DollarSign, TrendingUp, Users, AlertTriangle, Calendar, Bell } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MetricCard } from "./components/metric-card"
import { ActiveLoansTable } from "./components/active-loans-table"
import { PaymentFlowChart } from "./components/payment-flow-chart"
import type { LoanContract, DashboardMetrics } from "./types/loan"
import { formatCurrency } from "./utils/financial"

// Dados mockados para demonstração
const mockMetrics: DashboardMetrics = {
  totalLoaned: 450000,
  interestReceived: 67500,
  activeLoans: 23,
  pendingPayments: 8,
  overdueAmount: 15000,
  monthlyIncome: 22500,
  monthlyExpenses: 5000,
}

const mockLoans: LoanContract[] = [
  {
    id: "1",
    clientId: "c1",
    client: {
      id: "c1",
      name: "João Silva",
      cpf: "123.456.789-00",
      rg: "12.345.678-9",
      email: "joao@email.com",
      phone: "(11) 99999-9999",
      address: {
        street: "Rua das Flores",
        number: "123",
        city: "São Paulo",
        state: "SP",
        zipCode: "01234-567",
      },
      documents: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    principalAmount: 10000,
    interestRate: 5,
    interestType: "monthly",
    startDate: new Date("2024-01-15"),
    dueDate: new Date("2024-12-15"),
    status: "active",
    currentBalance: 8500,
    totalPaid: 3500,
    interestPaid: 2000,
    principalPaid: 1500,
    daysOverdue: 0,
    nextPaymentDate: new Date("2024-02-15"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    clientId: "c2",
    client: {
      id: "c2",
      name: "Maria Santos",
      cpf: "987.654.321-00",
      rg: "98.765.432-1",
      email: "maria@email.com",
      phone: "(11) 88888-8888",
      address: {
        street: "Av. Principal",
        number: "456",
        city: "São Paulo",
        state: "SP",
        zipCode: "01234-567",
      },
      documents: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    principalAmount: 25000,
    interestRate: 4,
    interestType: "monthly",
    startDate: new Date("2023-12-01"),
    dueDate: new Date("2024-11-01"),
    status: "overdue",
    currentBalance: 22000,
    totalPaid: 8000,
    interestPaid: 5000,
    principalPaid: 3000,
    daysOverdue: 15,
    nextPaymentDate: new Date("2024-01-01"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const mockPaymentFlowData = [
  { month: "Jan", received: 15000, toReceive: 12000 },
  { month: "Fev", received: 18000, toReceive: 15000 },
  { month: "Mar", received: 22000, toReceive: 18000 },
  { month: "Abr", received: 19000, toReceive: 16000 },
  { month: "Mai", received: 25000, toReceive: 20000 },
  { month: "Jun", received: 23000, toReceive: 22000 },
]

const upcomingPayments = [
  { client: "João Silva", amount: 1200, dueDate: "15/02/2024", daysLeft: 3 },
  { client: "Maria Santos", amount: 2500, dueDate: "18/02/2024", daysLeft: 6 },
  { client: "Pedro Costa", amount: 800, dueDate: "20/02/2024", daysLeft: 8 },
]

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>(mockMetrics)
  const [loans, setLoans] = useState<LoanContract[]>(mockLoans)

  const handleNewLoan = () => {
    alert("Abrindo formulário de novo empréstimo")
    // Aqui você navegaria para a página de novo empréstimo
  }

  const handleReports = () => {
    alert("Abrindo relatórios")
    // Aqui você navegaria para a página de relatórios
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Financeiro</h1>
            <p className="text-gray-600">Visão geral dos seus empréstimos e contratos</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleReports}>
              <Calendar className="h-4 w-4 mr-2" />
              Relatórios
            </Button>
            <Button onClick={handleNewLoan}>
              <DollarSign className="h-4 w-4 mr-2" />
              Novo Empréstimo
            </Button>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Emprestado"
            value={metrics.totalLoaned}
            icon={DollarSign}
            isCurrency
            trend={{ value: 12.5, isPositive: true }}
            className="bg-blue-50 border-blue-200"
          />
          <MetricCard
            title="Juros Recebidos"
            value={metrics.interestReceived}
            icon={TrendingUp}
            isCurrency
            trend={{ value: 8.2, isPositive: true }}
            className="bg-green-50 border-green-200"
          />
          <MetricCard
            title="Empréstimos Ativos"
            value={metrics.activeLoans}
            icon={Users}
            trend={{ value: 5.1, isPositive: true }}
            className="bg-purple-50 border-purple-200"
          />
          <MetricCard
            title="Valor em Atraso"
            value={metrics.overdueAmount}
            icon={AlertTriangle}
            isCurrency
            trend={{ value: -15.3, isPositive: false }}
            className="bg-red-50 border-red-200"
          />
        </div>

        {/* Alertas e Próximos Pagamentos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Próximos Pagamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingPayments.map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{payment.client}</div>
                        <div className="text-sm text-gray-600">Vence em {payment.daysLeft} dias</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(payment.amount)}</div>
                        <div className="text-sm text-gray-600">{payment.dueDate}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resumo do Mês</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Receitas</span>
                <span className="font-bold text-green-600">{formatCurrency(metrics.monthlyIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Despesas</span>
                <span className="font-bold text-red-600">{formatCurrency(metrics.monthlyExpenses)}</span>
              </div>
              <hr />
              <div className="flex justify-between">
                <span className="font-medium">Lucro Líquido</span>
                <span className="font-bold text-blue-600">
                  {formatCurrency(metrics.monthlyIncome - metrics.monthlyExpenses)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Fluxo de Pagamentos */}
        <PaymentFlowChart data={mockPaymentFlowData} />

        {/* Tabela de Contratos Ativos */}
        <Card>
          <CardHeader>
            <CardTitle>Contratos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <ActiveLoansTable loans={loans} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
