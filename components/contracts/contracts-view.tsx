"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search, Upload } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { ContractsTable } from "./contracts-table"
import { NewContractModal } from "./new-contract-modal"
import { ImportContractsModal } from "./import-contracts-modal"
import { useLoan } from "@/contexts/loan-context"
import type { LoanContract } from "@/types/loan"

export function ContractsView() {
  const { contracts, addContract, importContracts } = useLoan()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isNewContractModalOpen, setIsNewContractModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch = contract.client.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || contract.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreateContract = (newContract: LoanContract) => {
    addContract(newContract)
    setIsNewContractModalOpen(false)
  }

  const handleImportContracts = (newContracts: LoanContract[]) => {
    return importContracts(newContracts)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contratos</h1>
          <p className="text-gray-500">Gerencie seus contratos de empréstimo</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsImportModalOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button onClick={() => setIsNewContractModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Contrato
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          className="border rounded-md px-3 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Todos os Status</option>
          <option value="active">Ativos</option>
          <option value="overdue">Atrasados</option>
          <option value="paid">Quitados</option>
          <option value="refinanced">Refinanciados</option>
        </select>
      </div>

      <ContractsTable contracts={filteredContracts} />

      <NewContractModal
        isOpen={isNewContractModalOpen}
        onClose={() => setIsNewContractModalOpen(false)}
        onCreateContract={handleCreateContract}
      />

      <ImportContractsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportContracts}
      />
    </div>
  )
}
