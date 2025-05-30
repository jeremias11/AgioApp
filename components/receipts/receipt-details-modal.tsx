"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/utils/financial"
import { FileText } from "lucide-react"
import type { Receipt } from "@/types/loan"

interface ReceiptDetailsModalProps {
  receipt: Receipt
  isOpen: boolean
  onClose: () => void
  onGeneratePDF: () => void
}

export function ReceiptDetailsModal({ receipt, isOpen, onClose, onGeneratePDF }: ReceiptDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Recebimento</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Cabeçalho do Recibo */}
          <div className="border-b pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">Recibo #{receipt.receiptNumber}</h3>
                <p className="text-gray-500">Emitido em {receipt.createdAt.toLocaleDateString("pt-BR")}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{formatCurrency(receipt.amount)}</div>
                <div className="text-sm text-gray-500">
                  {receipt.paymentMethod.charAt(0).toUpperCase() + receipt.paymentMethod.slice(1)}
                </div>
              </div>
            </div>
          </div>

          {/* Distribuição do Pagamento */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-3">Distribuição do Pagamento</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{formatCurrency(receipt.interestPortion)}</div>
                <div className="text-sm text-blue-600">Juros</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{formatCurrency(receipt.principalPortion)}</div>
                <div className="text-sm text-green-600">Amortização</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">{formatCurrency(receipt.balanceAfterPayment)}</div>
                <div className="text-sm text-purple-600">Saldo Restante</div>
              </div>
            </div>
          </div>

          {/* Detalhes do Recibo */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Cliente</p>
                <p className="font-medium">{receipt.clientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Data do Recebimento</p>
                <p className="font-medium">{receipt.receiptDate.toLocaleDateString("pt-BR")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contrato</p>
                <p className="font-medium">#{receipt.contractId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Método de Pagamento</p>
                <p className="font-medium">
                  {receipt.paymentMethod.charAt(0).toUpperCase() + receipt.paymentMethod.slice(1)}
                </p>
              </div>
            </div>

            {receipt.description && (
              <div>
                <p className="text-sm text-gray-500">Descrição</p>
                <p className="mt-1 p-2 bg-gray-50 rounded-md">{receipt.description}</p>
              </div>
            )}
          </div>

          {/* Visualização do Recibo */}
          <div className="border rounded-lg p-6 bg-gray-50">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold">RECIBO DE PAGAMENTO</h3>
              <p className="text-sm">Nº {receipt.receiptNumber}</p>
            </div>

            <div className="space-y-4">
              <p>
                Recebi de <span className="font-medium">{receipt.clientName}</span> a quantia de{" "}
                <span className="font-medium">{formatCurrency(receipt.amount)}</span> referente ao contrato #
                {receipt.contractId}.
              </p>

              <div className="bg-white p-3 rounded border">
                <p className="text-sm font-medium mb-2">Distribuição do pagamento:</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>• Juros: {formatCurrency(receipt.interestPortion)}</div>
                  <div>• Amortização: {formatCurrency(receipt.principalPortion)}</div>
                </div>
                <div className="mt-2 pt-2 border-t text-sm">
                  <strong>Saldo após pagamento: {formatCurrency(receipt.balanceAfterPayment)}</strong>
                </div>
              </div>

              <p>
                Pagamento realizado via{" "}
                <span className="font-medium">
                  {receipt.paymentMethod.charAt(0).toUpperCase() + receipt.paymentMethod.slice(1)}
                </span>{" "}
                em {receipt.receiptDate.toLocaleDateString("pt-BR")}.
              </p>

              <div className="pt-8 text-center">
                <p>_______________________________</p>
                <p className="text-sm mt-1">Assinatura</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={onGeneratePDF} className="gap-2">
              <FileText className="h-4 w-4" />
              Gerar PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
