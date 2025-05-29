"use client"

import { useAuth } from "../contexts/AuthContext"
import { DollarSign, Users, FileText, TrendingUp, Calendar, LogOut } from "lucide-react"

const Dashboard = () => {
  const { user, logout } = useAuth()

  const stats = [
    {
      title: "Total Emprestado",
      value: "R$ 125.450,00",
      icon: DollarSign,
      color: "bg-blue-500",
    },
    {
      title: "Contratos Ativos",
      value: "23",
      icon: FileText,
      color: "bg-green-500",
    },
    {
      title: "Clientes",
      value: "18",
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "Juros Recebidos",
      value: "R$ 8.750,00",
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ]

  const recentContracts = [
    { id: 1, client: "João Silva", amount: "R$ 5.000,00", status: "Ativo", dueDate: "2024-02-15" },
    { id: 2, client: "Maria Santos", amount: "R$ 3.500,00", status: "Atrasado", dueDate: "2024-01-20" },
    { id: 3, client: "Pedro Costa", amount: "R$ 7.200,00", status: "Ativo", dueDate: "2024-02-28" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">AgioApp</h1>
              <span className="ml-4 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {user?.plan?.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Olá, {user?.name}</span>
              <button onClick={logout} className="flex items-center text-gray-500 hover:text-gray-700">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Message */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white mb-8">
            <h2 className="text-2xl font-bold mb-2">Bem-vindo ao AgioApp!</h2>
            <p className="text-blue-100">Gerencie seus empréstimos de forma profissional e eficiente.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
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

          {/* Recent Contracts */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Contratos Recentes</h3>
            </div>
            <div className="overflow-x-auto">
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vencimento
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentContracts.map((contract) => (
                    <tr key={contract.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {contract.client}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contract.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            contract.status === "Ativo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {contract.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(contract.dueDate).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
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
      </main>
    </div>
  )
}

export default Dashboard
