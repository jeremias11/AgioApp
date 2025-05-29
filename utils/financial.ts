export function calculateCompoundInterest(
  principal: number,
  rate: number,
  time: number,
  compoundFrequency = 1,
): number {
  return principal * Math.pow(1 + rate / compoundFrequency, compoundFrequency * time)
}

export function calculateSimpleInterest(principal: number, rate: number, time: number): number {
  return principal * (1 + rate * time)
}

export function calculateOverdueFees(
  amount: number,
  daysOverdue: number,
  lateFeeRate: number,
  dailyInterestRate: number,
): { lateFee: number; overdueInterest: number; total: number } {
  const lateFee = amount * (lateFeeRate / 100)
  const overdueInterest = amount * (dailyInterestRate / 100) * daysOverdue

  return {
    lateFee,
    overdueInterest,
    total: lateFee + overdueInterest,
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function calculateDaysOverdue(dueDate: Date): number {
  const today = new Date()
  const diffTime = today.getTime() - dueDate.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
}
