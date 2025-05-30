"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { LoanContract, Payment } from "@/types/loan"
import { formatCurrency } from "@/utils/financial"

interface ContractDetailsModalProps {
  contract: LoanContract
  isOpen: boolean
  onClose: () => void
}

// Dados mockados para demonstração
const mockPayments: Payment[] = [
  {
    id: "p1",
    contractId: "1",
    paymentType: "interest",
    amount: 500,
    paymentDate: new Date("2024-01-15"),
    interestPortion: 500,
    principalPortion: 0,
    description: "Pagamento de juros",
    createdAt: new Date(),
  },
  {
    id: "p2",
    contractId: "1",
    paymentType: "amortization",
    amount: 2000,
    paymentDate: new Date("2024-02-15"),
    interestPortion: 500,
    principalPortion: 1500,
    bank: "Nubank",
    description: "Pagamento parcial",
    createdAt: new Date(),
  },
]

export function ContractDetailsModal({ contract, isOpen, onClose }: ContractDetailsModalProps) {
  // Em uma implementação real, você buscaria os pagamentos do contrato do banco de dados
  const payments = mockPayments.filter((payment) => payment.contractId === contract.id)

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo"
      case "overdue":
        return "Atrasado"
      case "paid":
        return "Quitado"
      case "refinanced":
        return "Refinanciado"
      default:
        return status
    }
  }

  const getPaymentTypeText = (type: string) => {
    switch (type) {
      case "interest":
        return "Juros"
      case "amortization":
        return "Amortização"
      case "full_payment":
        return "Quitação"
      case "refinancing":
        return "Refinanciamento"
      default:
        return type
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Contrato</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Informações</TabsTrigger>
            <TabsTrigger value="payments">Pagamentos</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Cliente</p>
                <p className="font-medium">{contract.client.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">{getStatusText(contract.status)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Data do Empréstimo</p>
                <p className="font-medium">{contract.loanDate.toLocaleDateString("pt-BR")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Dia de Pagamento</p>
                <p className="font-medium">Dia {contract.paymentDay}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Valor do Empréstimo</p>
                <p className="font-medium">{formatCurrency(contract.loanAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Taxa de Juros</p>
                <p className="font-medium">{contract.interestRate}% ao mês</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Saldo Devedor Atual</p>
                <p className="font-medium">{formatCurrency(contract.currentBalance)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Juros Mensal</p>
                <p className="font-medium">{formatCurrency(contract.monthlyInterestAmount)}</p>
              </div>
            </div>
            {contract.observations && (
              <div>
                <p className="text-sm text-gray-500">Observações</p>
                <p className="mt-1 p-2 bg-gray-50 rounded-md">{contract.observations}</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="payments" className="pt-4">
            {payments.length === 0 ? (
              <p className="text-center py-4">Nenhum pagamento registrado para este contrato</p>
            ) : (
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="p-2 text-left">Data</th>
                      <th className="p-2 text-left">Tipo</th>
                      <th className="p-2 text-left">Valor</th>
                      <th className="p-2 text-left">Juros</th>
                      <th className="p-2 text-left">Principal</th>
                      <th className="p-2 text-left">Descrição</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="border-b">
                        <td className="p-2">{payment.paymentDate.toLocaleDateString("pt-BR")}</td>
                        <td className="p-2">{getPaymentTypeText(payment.paymentType)}</td>
                        <td className="p-2">{formatCurrency(payment.amount)}</td>
                        <td className="p-2">{formatCurrency(payment.interestPortion)}</td>
                        <td className="p-2">{formatCurrency(payment.principalPortion)}</td>
                        <td className="p-2">{payment.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
