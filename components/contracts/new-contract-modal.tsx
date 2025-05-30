"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { LoanContract } from "@/types/loan"

interface NewContractModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateContract: (contract: LoanContract) => void
}

export function NewContractModal({ isOpen, onClose, onCreateContract }: NewContractModalProps) {
  const [clientName, setClientName] = useState("")
  const [loanAmount, setLoanAmount] = useState("")
  const [interestRate, setInterestRate] = useState("")
  const [paymentDay, setPaymentDay] = useState("")
  const [observations, setObservations] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const amount = Number.parseFloat(loanAmount)
    const rate = Number.parseFloat(interestRate) / 100
    const day = Number.parseInt(paymentDay)

    if (isNaN(amount) || isNaN(rate) || isNaN(day)) {
      alert("Por favor, preencha todos os campos corretamente")
      return
    }

    if (day < 1 || day > 31) {
      alert("O dia de pagamento deve estar entre 1 e 31")
      return
    }

    const monthlyInterestAmount = amount * rate
    const totalWithInterest = amount + monthlyInterestAmount

    const newContract: LoanContract = {
      id: `c${Date.now()}`,
      clientId: `client-${Date.now()}`,
      client: {
        id: `client-${Date.now()}`,
        name: clientName,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      loanDate: new Date(),
      loanAmount: amount,
      interestRate: Number.parseFloat(interestRate),
      totalWithInterest,
      currentBalance: amount,
      monthlyInterestAmount,
      paymentDay: day,
      status: "active",
      observations,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    onCreateContract(newContract)
    resetForm()
  }

  const resetForm = () => {
    setClientName("")
    setLoanAmount("")
    setInterestRate("")
    setPaymentDay("")
    setObservations("")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Contrato de Empréstimo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="clientName">Nome do Cliente</Label>
            <Input id="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
          </div>

          <div>
            <Label htmlFor="loanAmount">Valor do Empréstimo</Label>
            <Input
              id="loanAmount"
              type="number"
              step="0.01"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="interestRate">Taxa de Juros Mensal (%)</Label>
            <Input
              id="interestRate"
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="paymentDay">Dia de Pagamento</Label>
            <Input
              id="paymentDay"
              type="number"
              min="1"
              max="31"
              value={paymentDay}
              onChange={(e) => setPaymentDay(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="observations">Observações</Label>
            <Textarea
              id="observations"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Criar Contrato
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
