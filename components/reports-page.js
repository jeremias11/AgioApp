"use client"

import { useState, useEffect } from "react"
import { BarChart3, DollarSign, TrendingUp, Users, Download, Calendar } from "lucide-react"

export default function ReportsPage() {
  const [reports, setReports] = useState({
    monthlyRevenue: [],
    clientsReport: [],
    contractsReport: [],
    paymentsReport: [],
  })
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    fetchReports()
  }, [dateRange])

  const fetchReports = async () => {
    try {
      const response = await fetch(`/api/reports?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`)
      if (response.ok) {
        const data = await response.json()
        setReports(data)
      }
    } catch (error) {
      console.error("Erro ao carregar relatórios:", error)
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

  const exportReport = async (type) => {
    try {
      const response = await fetch(
        `/api/reports/export?type=${type}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
      )
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `relatorio-${type}-${new Date().toISOString().split("T")[0]}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Erro ao exportar relatório:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600">Análise detalhada do seu negócio</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => exportReport("complete")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
          >
            <Download className="h-5 w-5 mr-2" />
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-700">Período:</span>
          </div>
          <div className="flex space-x-2">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-500 self-center">até</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-md p-3">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Receita Total</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(reports.summary?.totalRevenue || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-md p-3">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Juros Recebidos</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(reports.summary?.totalInterest || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-purple-500 rounded-md p-3">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Novos Clientes</p>
              <p className="text-2xl font-semibold text-gray-900">{reports.summary?.newClients || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-orange-500 rounded-md p-3">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Contratos Ativos</p>
              <p className="text-2xl font-semibold text-gray-900">{reports.summary?.activeContracts || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Receita Mensal</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <BarChart3 className="h-16 w-16 text-gray-300" />
            <p className="ml-4">Gráfico de receita mensal será implementado</p>
          </div>
        </div>

        {/* Top Clients */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Principais Clientes</h3>
          {reports.topClients?.length > 0 ? (
            <div className="space-y-3">
              {reports.topClients.map((client, index) => (
                <div key={client.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{client.name}</p>
                    <p className="text-sm text-gray-500">{client.contracts_count} contratos</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(client.total_amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p>Nenhum dado disponível</p>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Contratos por Status</h3>
        </div>
        <div className="overflow-x-auto">
          {reports.contractsByStatus?.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentual
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.contractsByStatus.map((item) => (
                  <tr key={item.status}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.status === "active"
                            ? "bg-green-100 text-green-800"
                            : item.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status === "active"
                          ? "Ativo"
                          : item.status === "completed"
                            ? "Concluído"
                            : "Inadimplente"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.count}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.total_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <p>Nenhum dado disponível para o período selecionado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
