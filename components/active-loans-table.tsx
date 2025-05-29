"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Phone, MessageSquare, FileText, Search, Filter } from "lucide-react"
import type { LoanContract } from "@/types/loan"
import { formatCurrency } from "@/utils/financial"
import { PaymentModal } from "./payment-modal"

interface ActiveLoansTableProps {
  loans: LoanContract[]
}

export function ActiveLoansTable({ loans }: ActiveLoansTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState<LoanContract | null>(null)

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, "_self")
  }

  const handleWhatsApp = (phone: string, clientName: string) => {
    const message = encodeURIComponent(`Olá ${clientName}, entrando em contato sobre seu empréstimo.`)
    const cleanPhone = phone.replace(/\D/g, "")
    window.open(`https://wa.me/55${cleanPhone}?text=${message}`, "_blank")
  }

  const handleGenerateReceipt = (loanId: string) => {
    alert(`Gerando recibo para o empréstimo ${loanId}`)
    // Aqui você implementaria a geração do PDF
  }

  const handleViewDetails = (loanId: string) => {
    alert(`Visualizando detalhes do empréstimo ${loanId}`)
    // Aqui você navegaria para a página de detalhes
  }

  const handleRegisterPayment = (loan: LoanContract) => {
    setSelectedLoan(loan)
    setPaymentModalOpen(true)
  }

  const handleRenegotiate = (loanId: string) => {
    alert(`Iniciando renegociação do empréstimo ${loanId}`)
    // Aqui você abriria o modal de renegociação
  }

  const filteredLoans = loans.filter((loan) => {
    const matchesSearch =
      loan.client.name.toLowerCase().includes(searchTerm.toLowerCase()) || loan.client.cpf.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || loan.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string, daysOverdue: number) => {
    if (status === "overdue") {
      return <Badge variant="destructive">Atrasado {daysOverdue}d</Badge>
    }
    if (status === "active") {
      return <Badge variant="default">Ativo</Badge>
    }
    if (status === "paid") {
      return <Badge variant="secondary">Quitado</Badge>
    }
    return <Badge variant="outline">Renegociado</Badge>
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por cliente ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter("all")}>Todos</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("active")}>Ativos</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("overdue")}>Atrasados</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("paid")}>Quitados</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Taxa</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Próximo Pagamento</TableHead>
              <TableHead>Saldo Atual</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLoans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{loan.client.name}</div>
                    <div className="text-sm text-muted-foreground">{loan.client.phone}</div>
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(loan.principalAmount)}</TableCell>
                <TableCell>{loan.interestRate}% a.m.</TableCell>
                <TableCell>{getStatusBadge(loan.status, loan.daysOverdue)}</TableCell>
                <TableCell>{loan.nextPaymentDate.toLocaleDateString("pt-BR")}</TableCell>
                <TableCell className="font-medium">{formatCurrency(loan.currentBalance)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="outline" onClick={() => handleCall(loan.client.phone)}>
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleWhatsApp(loan.client.phone, loan.client.name)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleGenerateReceipt(loan.id)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Gerar Recibo
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewDetails(loan.id)}>Ver Detalhes</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRegisterPayment(loan)}>
                          Registrar Pagamento
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRenegotiate(loan.id)}>Renegociar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {selectedLoan && (
        <PaymentModal
          loanId={selectedLoan.id}
          clientName={selectedLoan.client.name}
          currentBalance={selectedLoan.currentBalance}
          isOpen={paymentModalOpen}
          onClose={() => {
            setPaymentModalOpen(false)
            setSelectedLoan(null)
          }}
        />
      )}
    </div>
  )
}
