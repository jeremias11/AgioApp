"use client"

import { useState, useEffect } from "react"
import { DollarSign, Users, FileText, TrendingUp, AlertCircle, Calendar } from "lucide-react"

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalLoaned: 0,
    activeContracts: 0,
    totalClients: 0,
    interestReceived: 0,
  })
  const [recentContracts, setRecentContracts] = useState([])
  const [upcomingPayments, setUpcomingPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, contractsRes, paymentsRes] = await Promise.all([
        fetch("/api/dashboard/stats"),
        fetch("/api/dashboard/recent-contracts"),
        fetch("/api/dashboard/upcoming-payments"),
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (contractsRes.ok) {
        const contractsData = await contractsRes.json()
        setRecentContracts(contractsData)
      }

      if (paymentsRes.ok) {
        const paymentsData = await paymentsRes.json()
        setUpcomingPayments(paymentsData)
      }
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const statsCards = [
    {
      title: "Total Emprestado",
      value: formatCurrency(stats.totalLoaned),
      icon: DollarSign,
      color: "bg-blue-500",
    },
    {
      title: "Contratos Ativos",
      value: stats.activeContracts.toString(),
      icon: FileText,
      color: "bg-green-500",
    },
    {
      title: "Total de Clientes",
      value: stats.totalClients.toString(),
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "Juros Recebidos",
      value: formatCurrency(stats.interestReceived),
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Bem-vindo ao AgioApp!</h1>
        <p className="text-blue-100">Gerencie seus empréstimos de forma profissional e eficiente.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-md p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contracts */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Contratos Recentes</h3>
          </div>
          <div className="overflow-x-auto">
            {recentContracts.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentContracts.map((contract) => (
                    <tr key={contract.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {contract.client_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(contract.principal_amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            contract.status === "active"
                              ? "bg-green-100 text-green-800"
                              : contract.status === "completed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {contract.status === "active"
                            ? "Ativo"
                            : contract.status === "completed"
                              ? "Concluído"
                              : "Inadimplente"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2">Nenhum contrato encontrado</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Payments */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Próximos Vencimentos</h3>
          </div>
          <div className="p-6">
            {upcomingPayments.length > 0 ? (
              <div className="space-y-4">
                {upcomingPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{payment.client_name}</p>
                        <p className="text-xs text-gray-500">
                          Vence em {new Date(payment.due_date).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</p>
                      {payment.days_until_due <= 3 && (
                        <div className="flex items-center text-red-600">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          <span className="text-xs">Urgente</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2">Nenhum pagamento próximo</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <h4 className="text-lg font-medium text-gray-900">Novo Contrato</h4>
              <p className="text-sm text-gray-600">Criar um novo empréstimo</p>
            </div>
          </div>
        </button>

        <button className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <h4 className="text-lg font-medium text-gray-900">Novo Cliente</h4>
              <p className="text-sm text-gray-600">Cadastrar cliente</p>
            </div>
          </div>
        </button>

        <button className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <h4 className="text-lg font-medium text-gray-900">Agenda</h4>
              <p className="text-sm text-gray-600">Ver vencimentos</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
