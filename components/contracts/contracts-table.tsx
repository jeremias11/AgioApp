"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, FileText, DollarSign, RefreshCw } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { LoanContract } from "@/types/loan"
import { formatCurrency } from "@/utils/financial"
import { ContractDetailsModal } from "./contract-details-modal"
import { NewReceiptModal } from "../receipts/new-receipt-modal"

interface ContractsTableProps {
  contracts: LoanContract[]
}

export function ContractsTable({ contracts }: ContractsTableProps) {
  const [selectedContract, setSelectedContract] = useState<LoanContract | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false)

  const getStatusBadge = (status: string) => {
    if (status === "overdue") {
      return <Badge variant="destructive">Atrasado</Badge>
    }
    if (status === "active") {
      return <Badge variant="default">Ativo</Badge>
    }
    if (status === "paid") {
      return <Badge variant="secondary">Quitado</Badge>
    }
    return <Badge variant="outline">Refinanciado</Badge>
  }

  const handleViewDetails = (contract: LoanContract) => {
    setSelectedContract(contract)
    setIsDetailsModalOpen(true)
  }

  const handleRegisterReceipt = (contract: LoanContract) => {
    setSelectedContract(contract)
    setIsReceiptModalOpen(true)
  }

  const handleRefinance = (contractId: string) => {
    alert(`Refinanciando contrato ${contractId}`)
    // Implementação real: abrir modal de refinanciamento
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Data do Empréstimo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Taxa</TableHead>
              <TableHead>Saldo Devedor</TableHead>
              <TableHead>Juros Mensal</TableHead>
              <TableHead>Dia de Pagamento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  Nenhum contrato encontrado
                </TableCell>
              </TableRow>
            ) : (
              contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">{contract.client.name}</TableCell>
                  <TableCell>{contract.loanDate.toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>{formatCurrency(contract.loanAmount)}</TableCell>
                  <TableCell>{contract.interestRate}% a.m.</TableCell>
                  <TableCell>{formatCurrency(contract.currentBalance)}</TableCell>
                  <TableCell>{formatCurrency(contract.monthlyInterestAmount)}</TableCell>
                  <TableCell>Dia {contract.paymentDay}</TableCell>
                  <TableCell>{getStatusBadge(contract.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(contract)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRegisterReceipt(contract)}>
                          <DollarSign className="mr-2 h-4 w-4" />
                          Registrar Recebimento
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRefinance(contract.id)}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Refinanciar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedContract && (
        <>
          <ContractDetailsModal
            contract={selectedContract}
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
          />
          <NewReceiptModal
            isOpen={isReceiptModalOpen}
            onClose={() => setIsReceiptModalOpen(false)}
            preselectedContract={selectedContract}
          />
        </>
      )}
    </>
  )
}
