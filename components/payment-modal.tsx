"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/utils/financial"

interface PaymentModalProps {
  loanId: string
  clientName: string
  currentBalance: number
  isOpen: boolean
  onClose: () => void
}

export function PaymentModal({ loanId, clientName, currentBalance, isOpen, onClose }: PaymentModalProps) {
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentType, setPaymentType] = useState<"partial" | "full">("partial")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Number.parseFloat(paymentAmount)

    if (amount <= 0) {
      alert("Valor deve ser maior que zero")
      return
    }

    if (amount > currentBalance) {
      alert("Valor não pode ser maior que o saldo devedor")
      return
    }

    // Aqui você implementaria a lógica de registro do pagamento
    alert(`Pagamento de ${formatCurrency(amount)} registrado para ${clientName}`)
    onClose()
    setPaymentAmount("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar Pagamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Cliente</Label>
            <Input value={clientName} disabled />
          </div>

          <div>
            <Label>Saldo Atual</Label>
            <Input value={formatCurrency(currentBalance)} disabled />
          </div>

          <div>
            <Label htmlFor="amount">Valor do Pagamento</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="0,00"
              required
            />
          </div>

          <div>
            <Label>Tipo de Pagamento</Label>
            <Select value={paymentType} onValueChange={(value: "partial" | "full") => setPaymentType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="partial">Pagamento Parcial</SelectItem>
                <SelectItem value="full">Quitação Total</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Registrar Pagamento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
