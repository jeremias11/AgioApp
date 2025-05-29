export interface Client {
  id: string
  name: string
  phone?: string
  email?: string
  createdAt: Date
  updatedAt: Date
}

export interface LoanContract {
  id: string
  clientId: string
  client: Client
  loanDate: Date
  loanAmount: number
  interestRate: number // Taxa de juros mensal em %
  totalWithInterest: number
  currentBalance: number
  monthlyInterestAmount: number
  paymentDay: number // Dia do mês para pagamento
  status: "active" | "overdue" | "paid" | "refinanced"
  observations?: string
  createdAt: Date
  updatedAt: Date
}

export interface Receipt {
  id: string
  contractId: string
  clientName: string
  amount: number
  receiptDate: Date
  paymentMethod: string
  description?: string
  receiptNumber: string
  interestPortion: number
  principalPortion: number
  balanceAfterPayment: number
  createdAt: Date
}

export interface DashboardMetrics {
  receivedToday: number
  receivedThisMonth: number
  overdueAmount: number
  expectedThisMonth: number
  activeContracts: number
  totalLent: number
  totalInterestReceived: number
}

export interface MonthlyPayment {
  month: string
  amount: number
}

export interface DailyPayment {
  day: number
  amount: number
}

export interface ClientPayment {
  client: string
  amount: number
}
