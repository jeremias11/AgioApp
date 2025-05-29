"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, DollarSign, Calendar, User } from "lucide-react"

export default function ContractsPage() {
  const [contracts, setContracts] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingContract, setEditingContract] = useState(null)
  const [formData, setFormData] = useState({
    client_id: "",
    principal_amount: "",
    interest_rate: "",
    interest_type: "monthly",
    start_date: "",
    end_date: "",
    payment_frequency: "monthly",
    late_fee_percentage: "",
    daily_interest_penalty: "",
    notes: "",
  })

  useEffect(() => {
    fetchContracts()
    fetchClients()
  }, [])

  const fetchContracts = async () => {
    try {
      const response = await fetch("/api/contracts")
      if (response.ok) {
        const data = await response.json()
        setContracts(data)
      }
    } catch (error) {
      console.error("Erro ao carregar contratos:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients")
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      }
    } catch (error) {
      console.error("Erro ao carregar clientes:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingContract ? `/api/contracts/${editingContract.id}` : "/api/contracts"
      const method = editingContract ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchContracts()
        setShowModal(false)
        setEditingContract(null)
        setFormData({
          client_id: "",
          principal_amount: "",
          interest_rate: "",
          interest_type: "monthly",
          start_date: "",
          end_date: "",
          payment_frequency: "monthly",
          late_fee_percentage: "",
          daily_interest_penalty: "",
          notes: "",
        })
      }
    } catch (error) {
      console.error("Erro ao salvar contrato:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (contract) => {
    setEditingContract(contract)
    setFormData({
      ...contract,
      start_date: contract.start_date?.split("T")[0],
      end_date: contract.end_date?.split("T")[0],
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (confirm("Tem certeza que deseja excluir este contrato?")) {
      try {
        const response = await fetch(`/api/contracts/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          await fetchContracts()
        }
      } catch (error) {
        console.error("Erro ao excluir contrato:", error)
      }
    }
  }

  const filteredContracts = contracts.filter(
    (contract) =>
      contract.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contract_number?.includes(searchTerm),
  )

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contratos</h1>
          <p className="text-gray-600">Gerencie seus contratos de empréstimo</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Novo Contrato
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar por cliente ou número do contrato..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Contracts List */}
      <div className="bg-white shadow rounded-lg">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredContracts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor Principal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taxa de Juros
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Início
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContracts.map((contract) => (
                  <tr key={contract.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{contract.client_name}</div>
                          <div className="text-sm text-gray-500">#{contract.contract_number}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">{formatCurrency(contract.principal_amount)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contract.interest_rate}% {contract.interest_type === "monthly" ? "a.m." : "a.d."}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contract.status)}`}
                      >
                        {getStatusText(contract.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">
                          {new Date(contract.start_date).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button onClick={() => handleEdit(contract)} className="text-blue-600 hover:text-blue-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(contract.id)} className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <p>Nenhum contrato encontrado</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {editingContract ? "Editar Contrato" : "Novo Contrato"}
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Cliente</label>
                      <select
                        required
                        value={formData.client_id}
                        onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Selecione um cliente</option>
                        {clients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Valor Principal</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={formData.principal_amount}
                          onChange={(e) => setFormData({ ...formData, principal_amount: e.target.value })}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Taxa de Juros (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={formData.interest_rate}
                          onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tipo de Juros</label>
                        <select
                          value={formData.interest_type}
                          onChange={(e) => setFormData({ ...formData, interest_type: e.target.value })}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="monthly">Mensal</option>
                          <option value="daily">Diário</option>
                          <option value="yearly">Anual</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Frequência de Pagamento</label>
                        <select
                          value={formData.payment_frequency}
                          onChange={(e) => setFormData({ ...formData, payment_frequency: e.target.value })}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="monthly">Mensal</option>
                          <option value="weekly">Semanal</option>
                          <option value="biweekly">Quinzenal</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Data de Início</label>
                        <input
                          type="date"
                          required
                          value={formData.start_date}
                          onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Data de Término</label>
                        <input
                          type="date"
                          value={formData.end_date}
                          onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Multa por Atraso (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.late_fee_percentage}
                          onChange={(e) => setFormData({ ...formData, late_fee_percentage: e.target.value })}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Juros de Mora Diário (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.daily_interest_penalty}
                          onChange={(e) => setFormData({ ...formData, daily_interest_penalty: e.target.value })}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Observações</label>
                      <textarea
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {loading ? "Salvando..." : editingContract ? "Atualizar" : "Criar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingContract(null)
                      setFormData({
                        client_id: "",
                        principal_amount: "",
                        interest_rate: "",
                        interest_type: "monthly",
                        start_date: "",
                        end_date: "",
                        payment_frequency: "monthly",
                        late_fee_percentage: "",
                        daily_interest_penalty: "",
                        notes: "",
                      })
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
