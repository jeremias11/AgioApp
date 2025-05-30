"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, TrendingUp, AlertTriangle, Calendar, Users } from 'lucide-react'
import { MetricCard } from "./metric-card"
import { MonthlyPaymentsChart } from "./monthly-payments-chart"
import { DailyPaymentsChart } from "./daily-payments-chart"
import { ClientPaymentsChart } from "./client-payments-chart"
import { UpcomingPaymentsTable } from "./upcoming-payments-table"
import { OverduePaymentsTable } from "./overdue-payments-table"
import { PaymentCalendar } from "@/components/calendar/payment-calendar"
import { formatCurrency } from "@/utils/financial"
import { useLoan } from "@/contexts/loan-context"

export function DashboardView() {
  const { contracts, receipts, getDashboardMetrics, getPaymentsByDate } = useLoan()
  const metrics = getDashboardMetrics()

  // Calcular dados para gráficos baseados nos dados reais
  const monthlyPayments = (() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']
    return months.map(month => {
      // Simular dados mensais baseados nos recebimentos reais
      const monthIndex = months.indexOf(month)
      const monthReceipts = receipts.filter(r => {
        const receiptDate = new Date(r.receiptDate)
        return receiptDate.getMonth() === monthIndex
      })
      return {
        month,
        amount: monthReceipts.reduce((sum, r) => sum + r.amount, 0)
      }
    })
  })()

  const dailyPayments = (() => {
    const today = new Date()
    const currentMonth = today.getMonth()
    const daysInMonth = new Date(today.getFullYear(), currentMonth + 1, 0).getDate()
    
    const dailyData = []
    for (let day = 1; day <= Math.min(daysInMonth, 30); day += 5) {
      const dayReceipts = receipts.filter(r => {
        const receiptDate = new Date(r.receiptDate)
        return receiptDate.getDate() === day && receiptDate.getMonth() === currentMonth
      })
      dailyData.push({
        day,
        amount: dayReceipts.reduce((sum, r) => sum + r.amount, 0)
      })
    }
    return dailyData
  })()

  const clientPayments = (() => {
    const clientTotals = new Map<string, number>()
    receipts.forEach(receipt => {
      const current = clientTotals.get(receipt.clientName) || 0
      clientTotals.set(receipt.clientName, current + receipt.amount)
    })
    
    return Array.from(clientTotals.entries())
      .map(([client, amount]) => ({ client, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
  })()

  // Próximos pagamentos baseados nos contratos ativos
  const upcomingPayments = (() => {
    const activeContracts = contracts.filter(c => c.status === "active")
    const today = new Date()
    
    return activeContracts.map(contract => {
      const nextPaymentDate = new Date(today.getFullYear(), today.getMonth(), contract.paymentDay)
      if (nextPaymentDate < today) {
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1)
      }
      
      const daysLeft = Math.ceil((nextPaymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      
      return {
        id: contract.id,
        client: contract.client.name,
        amount: contract.monthlyInterestAmount,
        dueDate: nextPaymentDate,
        daysLeft: Math.max(0, daysLeft)
      }
    }).sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 5)
  })()

  // Pagamentos em atraso
  const overduePayments = (() => {
    const overdueContracts = contracts.filter(c => c.status === "overdue")
    const today = new Date()
    
    return overdueContracts.map(contract => {
      const lastPaymentDate = new Date(today.getFullYear(), today.getMonth(), contract.paymentDay)
      if (lastPaymentDate > today) {
        lastPaymentDate.setMonth(lastPaymentDate.getMonth() - 1)
      }
      
      const daysOverdue = Math.ceil((today.getTime() - lastPaymentDate.getTime()) / (1000 * 60 * 60 * 24))
      
      return {
        id: contract.id,
        client: contract.client.name,
        amount: contract.monthlyInterestAmount,
        dueDate: lastPaymentDate,
        daysOverdue: Math.max(0, daysOverdue)
      }
    }).slice(0, 5)
  })()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Financeiro</h1>
        <p className="text-gray-500">Visão geral dos seus empréstimos e recebimentos</p>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Recebido Hoje"
          value={metrics.receivedToday}
          icon={DollarSign}
          isCurrency
          className="bg-green-50 border-green-200"
        />
        <MetricCard
          title="Recebido no Mês"
          value={metrics.receivedThisMonth}
          icon={TrendingUp}
          isCurrency
          className="bg-blue-50 border-blue-200"
        />
        <MetricCard
          title="Valor em Atraso"
          value={metrics.overdueAmount}
          icon={AlertTriangle}
          isCurrency
          className="bg-red-50 border-red-200"
        />
        <MetricCard
          title="Previsão do Mês"
          value={metrics.expectedThisMonth}
          icon={Calendar}
          isCurrency
          className="bg-purple-50 border-purple-200"
        />
      </div>

      {/* Resumo Financeiro */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Financeiro</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Contratos Ativos</p>
            <p className="text-2xl font-bold">{metrics.activeContracts}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Total Emprestado</p>
            <p className="text-2xl font-bold">{formatCurrency(metrics.totalLent)}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Total de Juros Recebidos</p>
            <p className="text-2xl font-bold">{formatCurrency(metrics.totalInterestReceived)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Calendário de Pagamentos */}
      <PaymentCalendar />

      {/* Gráficos */}
      <Tabs defaultValue="monthly">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="monthly">Recebimentos Mensais</TabsTrigger>
          <TabsTrigger value="daily">Recebimentos por Dia</TabsTrigger>
          <TabsTrigger value="client">Recebimentos por Cliente</TabsTrigger>
        </TabsList>
        <TabsContent value="monthly">
          <Card>
            <CardContent className="pt-6">
              <MonthlyPaymentsChart data={monthlyPayments} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="daily">
          <Card>
            <CardContent className="pt-6">
              <DailyPaymentsChart data={dailyPayments} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="client">
          <Card>
            <CardContent className="pt-6">
              <ClientPaymentsChart data={clientPayments} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Pagamentos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Próximos Pagamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <UpcomingPaymentsTable payments={upcomingPayments} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pagamentos em Atraso</CardTitle>
          </CardHeader>
          <CardContent>
            <OverduePaymentsTable payments={overduePayments} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
