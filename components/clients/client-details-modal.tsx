"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Client, LoanContract } from "@/types/loan"
import { formatCurrency } from "@/utils/financial"

interface ClientDetailsModalProps {
  client: Client
  isOpen: boolean
  onClose: () => void
  onUpdateClient: (client: Client) => void
}

// Dados mockados de contratos do cliente
const mockClientContracts: LoanContract[] = [
  {
    id: "1",
    clientId: "c1",
    client: {
      id: "c1",
      name: "João Silva",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    loanDate: new Date("2024-01-15"),
    loanAmount: 10000,
    interestRate: 5,
    totalWithInterest: 10500,
    currentBalance: 8500,
    monthlyInterestAmount: 425,
    paymentDay: 15,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export function ClientDetailsModal({ client, isOpen, onClose, onUpdateClient }: ClientDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(client.name)
  const [phone, setPhone] = useState(client.phone || "")
  const [email, setEmail] = useState(client.email || "")

  // Em uma implementação real, você buscaria os contratos do cliente do banco de dados
  const clientContracts = mockClientContracts.filter((contract) => contract.clientId === client.id)

  const handleSave = () => {
    if (!name.trim()) {
      alert("Nome é obrigatório")
      return
    }

    const updatedClient: Client = {
      ...client,
      name: name.trim(),
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      updatedAt: new Date(),
    }

    onUpdateClient(updatedClient)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setName(client.name)
    setPhone(client.phone || "")
    setEmail(client.email || "")
    setIsEditing(false)
  }

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

  const totalLent = clientContracts.reduce((sum, contract) => sum + contract.loanAmount, 0)
  const totalBalance = clientContracts.reduce((sum, contract) => sum + contract.currentBalance, 0)
  const activeContracts = clientContracts.filter((c) => c.status === "active" || c.status === "overdue").length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Cliente</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="info">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="contracts">Contratos</TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="space-y-4 pt-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editName">Nome *</Label>
                  <Input id="editName" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="editPhone">Telefone</Label>
                  <Input id="editPhone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="editEmail">Email</Label>
                  <Input id="editEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="flex-1">
                    Salvar
                  </Button>
                  <Button variant="outline" onClick={handleCancel} className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nome</p>
                    <p className="font-medium">{client.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Telefone</p>
                    <p className="font-medium">{client.phone || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{client.email || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Data de Cadastro</p>
                    <p className="font-medium">{client.createdAt.toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3">Resumo Financeiro</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Total Emprestado</p>
                      <p className="font-medium">{formatCurrency(totalLent)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Saldo Devedor</p>
                      <p className="font-medium">{formatCurrency(totalBalance)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Contratos Ativos</p>
                      <p className="font-medium">{activeContracts}</p>
                    </div>
                  </div>
                </div>

                <Button onClick={() => setIsEditing(true)} className="w-full">
                  Editar Informações
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="contracts" className="pt-4">
            {clientContracts.length === 0 ? (
              <p className="text-center py-4">Nenhum contrato encontrado para este cliente</p>
            ) : (
              <div className="space-y-3">
                {clientContracts.map((contract) => (
                  <div key={contract.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">Contrato #{contract.id}</p>
                        <p className="text-sm text-gray-500">{contract.loanDate.toLocaleDateString("pt-BR")}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          contract.status === "active"
                            ? "bg-green-100 text-green-800"
                            : contract.status === "overdue"
                              ? "bg-red-100 text-red-800"
                              : contract.status === "paid"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {getStatusText(contract.status)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Valor Emprestado</p>
                        <p className="font-medium">{formatCurrency(contract.loanAmount)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Saldo Atual</p>
                        <p className="font-medium">{formatCurrency(contract.currentBalance)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Taxa de Juros</p>
                        <p className="font-medium">{contract.interestRate}% a.m.</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Dia de Pagamento</p>
                        <p className="font-medium">Dia {contract.paymentDay}</p>
                      </div>
                    </div>
                  </div>
                ))}
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
