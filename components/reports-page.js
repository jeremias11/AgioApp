"use client"

import { useState, useEffect } from "react"
import { BarChart3, DollarSign, TrendingUp, Users, Download, Calendar, AlertTriangle } from "lucide-react"

export default function ReportsPage() {
  const [reports, setReports] = useState({
    summary: {},
    monthlyRevenue: [],
    topClients: [],
    contractsByStatus: [],
    paymentFlow: [],
    defaultAnalysis: {},
    interestTypeAnalysis: [],
  })
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0], // Início do ano
    endDate: new Date().toISOString().split("T")[0], // Hoje
  })

  useEffect(() => {
    fetchReports()
  }, [dateRange])

  const fetchReports = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/reports?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`)
      if (response.ok) {
        const data = await response.json()
        setReports(data)
      } else {
        console.error("Erro ao carregar relatórios:", response.statusText)
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
    }).format(value || 0)
  }

  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(1)}%`
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

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "defaulted":
        return "bg-red-100 text-red-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Ativo"
      case "completed":
        return "Concluído"
      case "defaulted":
        return "Inadimplente"
      case "cancelled":
        return "Cancelado"
      default:
        return status
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-md p-3">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Emprestado</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(reports.summary?.totalEmprestado)}</p>
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
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(reports.summary?.jurosRecebidos)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-purple-500 rounded-md p-3">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
              <p className="text-2xl font-semibold text-gray-900">{reports.summary?.totalClientes || 0}</p>
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
              <p className="text-2xl font-semibold text-gray-900">{reports.summary?.contratosAtivos || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas de Inadimplência */}
      {(reports.defaultAnalysis?.parcelasAtrasadas > 0 || reports.defaultAnalysis?.vencendo7Dias > 0) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="text-lg font-medium text-red-800">Alertas de Cobrança</h3>
          </div>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.defaultAnalysis?.parcelasAtrasadas > 0 && (
              <div className="bg-white p-3 rounded-md">
                <p className="text-sm text-gray-600">Parcelas em Atraso</p>
                <p className="text-lg font-semibold text-red-600">
                  {reports.defaultAnalysis.parcelasAtrasadas} parcelas
                </p>
                <p className="text-sm text-red-500">Valor: {formatCurrency(reports.defaultAnalysis.valorAtrasado)}</p>
              </div>
            )}
            {reports.defaultAnalysis?.vencendo7Dias > 0 && (
              <div className="bg-white p-3 rounded-md">
                <p className="text-sm text-gray-600">Vencendo em 7 dias</p>
                <p className="text-lg font-semibold text-yellow-600">
                  {reports.defaultAnalysis.vencendo7Dias} parcelas
                </p>
                <p className="text-sm text-yellow-500">
                  Valor: {formatCurrency(reports.defaultAnalysis.valorVencendo7Dias)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Receita Mensal */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Receita Mensal</h3>
          {reports.monthlyRevenue?.length > 0 ? (
            <div className="space-y-3">
              {reports.monthlyRevenue.map((month, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{month.mesFormatado}</p>
                    <p className="text-sm text-gray-500">{month.quantidadePagamentos} pagamentos</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(month.receita)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p>Nenhum dado de receita disponível</p>
            </div>
          )}
        </div>

        {/* Top Clientes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Principais Clientes</h3>
          {reports.topClients?.length > 0 ? (
            <div className="space-y-3">
              {reports.topClients.map((client, index) => (
                <div key={client.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{client.name}</p>
                    <p className="text-sm text-gray-500">{client.contractsCount} contratos</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(client.totalAmount)}</p>
                    <p className="text-sm text-green-600">Pago: {formatCurrency(client.totalPago)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p>Nenhum cliente encontrado</p>
            </div>
          )}
        </div>
      </div>

      {/* Fluxo de Pagamentos */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Fluxo de Pagamentos</h3>
        {reports.paymentFlow?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mês
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Recebido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket Médio
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.paymentFlow.map((flow, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{flow.mesNome}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(flow.totalRecebido)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{flow.quantidadePagamentos}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(flow.ticketMedio)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p>Nenhum fluxo de pagamento disponível</p>
          </div>
        )}
      </div>

      {/* Contratos por Status */}
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
                {reports.contractsByStatus.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}
                      >
                        {getStatusText(item.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.count}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPercentage(item.percentage)}
                    </td>
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

      {/* Análise por Tipo de Juros */}
      {reports.interestTypeAnalysis?.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Performance por Tipo de Juros</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reports.interestTypeAnalysis.map((item, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 capitalize">
                  {item.interestType === "monthly"
                    ? "Mensal"
                    : item.interestType === "daily"
                      ? "Diário"
                      : item.interestType === "yearly"
                        ? "Anual"
                        : item.interestType}
                </h4>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    Contratos: <span className="font-medium">{item.quantidade}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Taxa Média: <span className="font-medium">{item.taxaMedia.toFixed(2)}%</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Valor Total: <span className="font-medium">{formatCurrency(item.valorTotal)}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Juros Recebidos:{" "}
                    <span className="font-medium text-green-600">{formatCurrency(item.jurosRecebidos)}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
