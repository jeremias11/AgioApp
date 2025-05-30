"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Calendar, Upload } from 'lucide-react'
import { ReceiptsTable } from "./receipts-table"
import { NewReceiptModal } from "./new-receipt-modal"
import { ReceiptDetailsModal } from "./receipt-details-modal"
import { ImportReceiptsModal } from "./import-receipts-modal"
import { formatCurrency } from "@/utils/financial"
import { useLoan } from "@/contexts/loan-context"
import type { Receipt } from "@/types/loan"

export function ReceiptsView() {
  const { receipts, processReceipt, getActiveContracts, importReceipts } = useLoan()
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState<string>("")
  const [isNewReceiptModalOpen, setIsNewReceiptModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  const filteredReceipts = receipts.filter((receipt) => {
    const matchesSearch =
      receipt.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDate = dateFilter ? receipt.receiptDate.toISOString().split("T")[0] === dateFilter : true
    return matchesSearch && matchesDate
  })

  const handleCreateReceipt = (
    receiptData: Omit<Receipt, "interestPortion" | "principalPortion" | "balanceAfterPayment">,
  ) => {
    try {
      const processedReceipt = processReceipt(receiptData)
      setIsNewReceiptModalOpen(false)

      // Mostrar resumo do processamento
      alert(`Recebimento processado com sucesso!
      
Valor Total: ${formatCurrency(processedReceipt.amount)}
Juros: ${formatCurrency(processedReceipt.interestPortion)}
Amortização: ${formatCurrency(processedReceipt.principalPortion)}
Novo Saldo: ${formatCurrency(processedReceipt.balanceAfterPayment)}`)
    } catch (error) {
      alert(`Erro ao processar recebimento: ${error.message}`)
    }
  }

  const handleImportReceipts = (
    newReceipts: Omit<Receipt, "interestPortion" | "principalPortion" | "balanceAfterPayment">[],
  ) => {
    return importReceipts(newReceipts)
  }

  const handleViewReceipt = (receipt: Receipt) => {
    setSelectedReceipt(receipt)
    setIsDetailsModalOpen(true)
  }

  const handleGeneratePDF = (receiptId: string) => {
    alert(`Gerando PDF para o recibo ${receiptId}`)
    // Implementação real: gerar PDF
  }

  const totalReceived = receipts.reduce((sum, receipt) => sum + receipt.amount, 0)
  const totalInterestReceived = receipts.reduce((sum, receipt) => sum + receipt.interestPortion, 0)
  const totalPrincipalReceived = receipts.reduce((sum, receipt) => sum + receipt.principalPortion, 0)

  const todayReceived = receipts
    .filter((receipt) => {
      const today = new Date()
      const receiptDate = new Date(receipt.receiptDate)
      return (
        receiptDate.getDate() === today.getDate() &&
        receiptDate.getMonth() === today.getMonth() &&
        receiptDate.getFullYear() === today.getFullYear()
      )
    })
    .reduce((sum, receipt) => sum + receipt.amount, 0)

  const monthReceived = receipts
    .filter((receipt) => {
      const today = new Date()
      const receiptDate = new Date(receipt.receiptDate)
      return receiptDate.getMonth() === today.getMonth() && receiptDate.getFullYear() === today.getFullYear()
    })
    .reduce((sum, receipt) => sum + receipt.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Recebimentos</h1>
          <p className="text-gray-500">Gerencie todos os recebimentos e atualize automaticamente os saldos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsImportModalOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button onClick={() => setIsNewReceiptModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Recebimento
          </Button>
        </div>
      </div>

      {/* Resumo de Recebimentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Recebido Hoje</div>
            <div className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(todayReceived)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Recebido no Mês</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">{formatCurrency(monthReceived)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Total Recebido</div>
            <div className="text-2xl font-bold text-purple-600 mt-1">{formatCurrency(totalReceived)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Total Juros</div>
            <div className="text-2xl font-bold text-orange-600 mt-1">{formatCurrency(totalInterestReceived)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Total Amortizado</div>
            <div className="text-2xl font-bold text-indigo-600 mt-1">{formatCurrency(totalPrincipalReceived)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por cliente ou número do recibo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="pl-10 w-48"
          />
        </div>
      </div>

      {/* Tabela de Recebimentos */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="pix">PIX</TabsTrigger>
          <TabsTrigger value="transferência">Transferência</TabsTrigger>
          <TabsTrigger value="dinheiro">Dinheiro</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <ReceiptsTable
            receipts={filteredReceipts}
            onViewReceipt={handleViewReceipt}
            onGeneratePDF={handleGeneratePDF}
          />
        </TabsContent>
        <TabsContent value="pix">
          <ReceiptsTable
            receipts={filteredReceipts.filter((r) => r.paymentMethod === "pix")}
            onViewReceipt={handleViewReceipt}
            onGeneratePDF={handleGeneratePDF}
          />
        </TabsContent>
        <TabsContent value="transferência">
          <ReceiptsTable
            receipts={filteredReceipts.filter((r) => r.paymentMethod === "transferência")}
            onViewReceipt={handleViewReceipt}
            onGeneratePDF={handleGeneratePDF}
          />
        </TabsContent>
        <TabsContent value="dinheiro">
          <ReceiptsTable
            receipts={filteredReceipts.filter((r) => r.paymentMethod === "dinheiro")}
            onViewReceipt={handleViewReceipt}
            onGeneratePDF={handleGeneratePDF}
          />
        </TabsContent>
      </Tabs>

      {/* Modais */}
      <NewReceiptModal
        isOpen={isNewReceiptModalOpen}
        onClose={() => setIsNewReceiptModalOpen(false)}
        onCreateReceipt={handleCreateReceipt}
        contracts={getActiveContracts()}
      />

      <ImportReceiptsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportReceipts}
      />

      {selectedReceipt && (
        <ReceiptDetailsModal
          receipt={selectedReceipt}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          onGeneratePDF={() => handleGeneratePDF(selectedReceipt.id)}
        />
      )}
    </div>
  )
}
