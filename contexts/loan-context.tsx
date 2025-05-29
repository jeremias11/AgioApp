"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import type { LoanContract, Receipt, Client } from "@/types/loan"

interface LoanContextType {
  // Estados
  contracts: LoanContract[]
  receipts: Receipt[]
  clients: Client[]

  // Ações para contratos
  addContract: (contract: LoanContract) => void
  updateContract: (id: string, updates: Partial<LoanContract>) => void
  deleteContract: (id: string) => void
  importContracts: (contracts: LoanContract[]) => number

  // Ações para recebimentos
  addReceipt: (receipt: Receipt) => void
  processReceipt: (receipt: Omit<Receipt, "interestPortion" | "principalPortion" | "balanceAfterPayment">) => Receipt
  importReceipts: (receipts: Omit<Receipt, "interestPortion" | "principalPortion" | "balanceAfterPayment">[]) => {
    processed: number
    errors: string[]
  }

  // Ações para clientes
  addClient: (client: Client) => void
  updateClient: (id: string, updates: Partial<Client>) => void
  deleteClient: (id: string) => void

  // Funções utilitárias
  getActiveContracts: () => LoanContract[]
  getContractById: (id: string) => LoanContract | undefined
  getClientById: (id: string) => Client | undefined
  calculatePaymentDistribution: (
    amount: number,
    contract: LoanContract,
  ) => {
    interestPortion: number
    principalPortion: number
    newBalance: number
  }

  // Métricas calculadas
  getDashboardMetrics: () => {
    receivedToday: number
    receivedThisMonth: number
    overdueAmount: number
    expectedThisMonth: number
    activeContracts: number
    totalLent: number
    totalInterestReceived: number
  }

  // Dados para calendário
  getPaymentsByDate: () => Map<
    string,
    { total: number; payments: Array<{ clientName: string; amount: number; contractId: string }> }
  >
}

const LoanContext = createContext<LoanContextType | undefined>(undefined)

// Dados iniciais mockados
const initialContracts: LoanContract[] = [
  {
    id: "1",
    clientId: "c1",
    client: {
      id: "c1",
      name: "João Silva",
      phone: "(11) 99999-9999",
      email: "joao@email.com",
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
    observations: "Empréstimo para reforma da casa",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    clientId: "c2",
    client: {
      id: "c2",
      name: "Maria Santos",
      phone: "(11) 88888-8888",
      email: "maria@email.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    loanDate: new Date("2023-12-01"),
    loanAmount: 25000,
    interestRate: 4,
    totalWithInterest: 26000,
    currentBalance: 22000,
    monthlyInterestAmount: 880,
    paymentDay: 5,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const initialReceipts: Receipt[] = [
  {
    id: "r1",
    contractId: "1",
    clientName: "João Silva",
    amount: 1500,
    receiptDate: new Date("2024-02-15"),
    paymentMethod: "pix",
    description: "Pagamento mensal",
    receiptNumber: "REC-2024-001",
    interestPortion: 425,
    principalPortion: 1075,
    balanceAfterPayment: 7425,
    createdAt: new Date("2024-02-15"),
  },
  {
    id: "r2",
    contractId: "2",
    clientName: "Maria Santos",
    amount: 1000,
    receiptDate: new Date("2024-02-05"),
    paymentMethod: "transferência",
    description: "Pagamento de juros",
    receiptNumber: "REC-2024-002",
    interestPortion: 880,
    principalPortion: 120,
    balanceAfterPayment: 21880,
    createdAt: new Date("2024-02-05"),
  },
]

const initialClients: Client[] = [
  {
    id: "c1",
    name: "João Silva",
    phone: "(11) 99999-9999",
    email: "joao@email.com",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "c2",
    name: "Maria Santos",
    phone: "(11) 88888-8888",
    email: "maria@email.com",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export function LoanProvider({ children }: { children: React.ReactNode }) {
  const [contracts, setContracts] = useState<LoanContract[]>(initialContracts)
  const [receipts, setReceipts] = useState<Receipt[]>(initialReceipts)
  const [clients, setClients] = useState<Client[]>(initialClients)

  // Função para calcular distribuição de pagamento
  const calculatePaymentDistribution = (amount: number, contract: LoanContract) => {
    const monthlyInterest = (contract.currentBalance * contract.interestRate) / 100

    if (amount <= monthlyInterest) {
      return {
        interestPortion: amount,
        principalPortion: 0,
        newBalance: contract.currentBalance,
      }
    } else {
      const principalPayment = amount - monthlyInterest
      const newBalance = Math.max(0, contract.currentBalance - principalPayment)

      return {
        interestPortion: monthlyInterest,
        principalPortion: principalPayment,
        newBalance,
      }
    }
  }

  // Ações para contratos
  const addContract = (contract: LoanContract) => {
    setContracts((prev) => [...prev, contract])

    // Adicionar cliente se não existir
    if (!clients.find((c) => c.id === contract.client.id)) {
      setClients((prev) => [...prev, contract.client])
    }
  }

  const updateContract = (id: string, updates: Partial<LoanContract>) => {
    setContracts((prev) =>
      prev.map((contract) => (contract.id === id ? { ...contract, ...updates, updatedAt: new Date() } : contract)),
    )
  }

  const deleteContract = (id: string) => {
    setContracts((prev) => prev.filter((contract) => contract.id !== id))
  }

  const importContracts = (newContracts: LoanContract[]) => {
    setContracts((prev) => [...prev, ...newContracts])

    // Adicionar clientes que não existem
    const newClients = newContracts.map((c) => c.client).filter((client) => !clients.find((c) => c.id === client.id))

    if (newClients.length > 0) {
      setClients((prev) => [...prev, ...newClients])
    }

    return newContracts.length
  }

  // Ações para recebimentos
  const addReceipt = (receipt: Receipt) => {
    setReceipts((prev) => [...prev, receipt])
  }

  const processReceipt = (receipt: Omit<Receipt, "interestPortion" | "principalPortion" | "balanceAfterPayment">) => {
    const contract = contracts.find((c) => c.id === receipt.contractId)
    if (!contract) {
      throw new Error("Contrato não encontrado")
    }

    const { interestPortion, principalPortion, newBalance } = calculatePaymentDistribution(receipt.amount, contract)

    // Atualizar o saldo do contrato
    updateContract(receipt.contractId, {
      currentBalance: newBalance,
      status: newBalance === 0 ? "paid" : contract.status,
      monthlyInterestAmount: (newBalance * contract.interestRate) / 100,
    })

    // Criar recibo completo
    const completeReceipt = {
      ...receipt,
      interestPortion,
      principalPortion,
      balanceAfterPayment: newBalance,
    } as Receipt

    // Adicionar o recibo
    addReceipt(completeReceipt)

    return completeReceipt
  }

  const importReceipts = (
    newReceipts: Omit<Receipt, "interestPortion" | "principalPortion" | "balanceAfterPayment">[],
  ) => {
    const processedReceipts: Receipt[] = []
    const errors: string[] = []

    for (const receipt of newReceipts) {
      try {
        const processedReceipt = processReceipt(receipt)
        processedReceipts.push(processedReceipt)
      } catch (error) {
        errors.push(`Erro ao processar recebimento para ${receipt.clientName}: ${error.message}`)
      }
    }

    return {
      processed: processedReceipts.length,
      errors,
    }
  }

  // Ações para clientes
  const addClient = (client: Client) => {
    setClients((prev) => [...prev, client])
  }

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients((prev) =>
      prev.map((client) => (client.id === id ? { ...client, ...updates, updatedAt: new Date() } : client)),
    )
  }

  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((client) => client.id !== id))
  }

  // Funções utilitárias
  const getActiveContracts = () => {
    return contracts.filter((contract) => contract.status === "active" || contract.status === "overdue")
  }

  const getContractById = (id: string) => {
    return contracts.find((contract) => contract.id === id)
  }

  const getClientById = (id: string) => {
    return clients.find((client) => client.id === id)
  }

  // Métricas do dashboard
  const getDashboardMetrics = () => {
    const today = new Date()
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    const todayReceipts = receipts.filter((r) => {
      const receiptDate = new Date(r.receiptDate)
      return receiptDate.toDateString() === today.toDateString()
    })

    const monthReceipts = receipts.filter((r) => {
      const receiptDate = new Date(r.receiptDate)
      return receiptDate >= thisMonth
    })

    const activeContracts = getActiveContracts()
    const overdueContracts = contracts.filter((c) => c.status === "overdue")

    return {
      receivedToday: todayReceipts.reduce((sum, r) => sum + r.amount, 0),
      receivedThisMonth: monthReceipts.reduce((sum, r) => sum + r.amount, 0),
      overdueAmount: overdueContracts.reduce((sum, c) => sum + c.currentBalance, 0),
      expectedThisMonth: activeContracts.reduce((sum, c) => sum + c.monthlyInterestAmount, 0),
      activeContracts: activeContracts.length,
      totalLent: contracts.reduce((sum, c) => sum + c.loanAmount, 0),
      totalInterestReceived: receipts.reduce((sum, r) => sum + r.interestPortion, 0),
    }
  }

  // Dados para calendário
  const getPaymentsByDate = () => {
    const paymentsByDate = new Map<
      string,
      { total: number; payments: Array<{ clientName: string; amount: number; contractId: string }> }
    >()

    // Calcular próximos pagamentos baseado no dia de pagamento de cada contrato
    const activeContracts = getActiveContracts()
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()

    activeContracts.forEach((contract) => {
      // Calcular próximo pagamento para este mês e próximo
      for (let monthOffset = 0; monthOffset <= 1; monthOffset++) {
        const paymentDate = new Date(currentYear, currentMonth + monthOffset, contract.paymentDay)
        const dateKey = paymentDate.toISOString().split("T")[0]

        if (!paymentsByDate.has(dateKey)) {
          paymentsByDate.set(dateKey, { total: 0, payments: [] })
        }

        const dayData = paymentsByDate.get(dateKey)!
        dayData.total += contract.monthlyInterestAmount
        dayData.payments.push({
          clientName: contract.client.name,
          amount: contract.monthlyInterestAmount,
          contractId: contract.id,
        })
      }
    })

    return paymentsByDate
  }

  const value: LoanContextType = {
    // Estados
    contracts,
    receipts,
    clients,

    // Ações
    addContract,
    updateContract,
    deleteContract,
    importContracts,
    addReceipt,
    processReceipt,
    importReceipts,
    addClient,
    updateClient,
    deleteClient,

    // Funções utilitárias
    getActiveContracts,
    getContractById,
    getClientById,
    calculatePaymentDistribution,
    getDashboardMetrics,
    getPaymentsByDate,
  }

  return <LoanContext.Provider value={value}>{children}</LoanContext.Provider>
}

export function useLoan() {
  const context = useContext(LoanContext)
  if (context === undefined) {
    throw new Error("useLoan must be used within a LoanProvider")
  }
  return context
}
