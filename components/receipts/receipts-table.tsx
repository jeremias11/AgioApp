"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, FileText, Printer } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/utils/financial"
import type { Receipt } from "@/types/loan"

interface ReceiptsTableProps {
  receipts: Receipt[]
  onViewReceipt: (receipt: Receipt) => void
  onGeneratePDF: (receiptId: string) => void
}

export function ReceiptsTable({ receipts, onViewReceipt, onGeneratePDF }: ReceiptsTableProps) {
  const getPaymentMethodBadge = (method: string) => {
    switch (method) {
      case "pix":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            PIX
          </Badge>
        )
      case "transferência":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
            Transferência
          </Badge>
        )
      case "dinheiro":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
            Dinheiro
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
            {method}
          </Badge>
        )
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nº do Recibo</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Valor Total</TableHead>
            <TableHead>Juros</TableHead>
            <TableHead>Amortização</TableHead>
            <TableHead>Saldo Após</TableHead>
            <TableHead>Método</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {receipts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4">
                Nenhum recebimento encontrado
              </TableCell>
            </TableRow>
          ) : (
            receipts.map((receipt) => (
              <TableRow key={receipt.id}>
                <TableCell className="font-medium">{receipt.receiptNumber}</TableCell>
                <TableCell>{receipt.receiptDate.toLocaleDateString("pt-BR")}</TableCell>
                <TableCell>{receipt.clientName}</TableCell>
                <TableCell>{formatCurrency(receipt.amount)}</TableCell>
                <TableCell className="text-blue-600">{formatCurrency(receipt.interestPortion)}</TableCell>
                <TableCell className="text-green-600">{formatCurrency(receipt.principalPortion)}</TableCell>
                <TableCell className="font-medium">{formatCurrency(receipt.balanceAfterPayment)}</TableCell>
                <TableCell>{getPaymentMethodBadge(receipt.paymentMethod)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="outline" onClick={() => onGeneratePDF(receipt.id)}>
                      <Printer className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewReceipt(receipt)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onGeneratePDF(receipt.id)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Gerar PDF
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
