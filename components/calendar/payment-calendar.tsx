"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-react'
import { formatCurrency } from "@/utils/financial"
import { useLoan } from "@/contexts/loan-context"

interface PaymentCalendarProps {
  className?: string
}

export function PaymentCalendar({ className }: PaymentCalendarProps) {
  const { getPaymentsByDate } = useLoan()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  const paymentsByDate = getPaymentsByDate()

  // Função para navegar entre meses
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  // Função para obter dias do mês
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Adicionar dias vazios do início
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Adicionar dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  // Função para obter dados de pagamento de um dia específico
  const getPaymentDataForDay = (day: number) => {
    const dateKey = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString().split('T')[0]
    return paymentsByDate.get(dateKey)
  }

  // Função para lidar com clique no dia
  const handleDayClick = (day: number) => {
    const dateKey = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString().split('T')[0]
    const paymentData = paymentsByDate.get(dateKey)
    
    if (paymentData && paymentData.payments.length > 0) {
      setSelectedDate(dateKey)
      setIsDetailsModalOpen(true)
    }
  }

  const days = getDaysInMonth()
  const selectedDateData = selectedDate ? paymentsByDate.get(selectedDate) : null

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ]

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendário de Recebimentos
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-lg font-medium min-w-[200px] text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {dayNames.map(dayName => (
              <div key={dayName} className="p-2 text-center text-sm font-medium text-gray-500">
                {dayName}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={index} className="p-2 h-20" />
              }

              const paymentData = getPaymentDataForDay(day)
              const hasPayments = paymentData && paymentData.payments.length > 0
              const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()

              return (
                <div
                  key={day}
                  className={`
                    p-2 h-20 border rounded-lg cursor-pointer transition-colors
                    ${isToday ? 'bg-blue-50 border-blue-200' : 'border-gray-200'}
                    ${hasPayments ? 'hover:bg-green-50 border-green-200' : 'hover:bg-gray-50'}
                  `}
                  onClick={() => handleDayClick(day)}
                >
                  <div className="text-sm font-medium">{day}</div>
                  {hasPayments && (
                    <div className="mt-1">
                      <div className="text-xs text-green-600 font-medium">
                        {formatCurrency(paymentData.total)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {paymentData.payments.length} pagamento{paymentData.payments.length > 1 ? 's' : ''}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-4 text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                <span>Dias com pagamentos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
                <span>Hoje</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de detalhes do dia */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Pagamentos de {selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR') : ''}
            </DialogTitle>
          </DialogHeader>
          
          {selectedDateData && (
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(selectedDateData.total)}
                  </div>
                  <div className="text-sm text-green-700">
                    Total a receber ({selectedDateData.payments.length} pagamento{selectedDateData.payments.length > 1 ? 's' : ''})
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Detalhes dos Pagamentos:</h4>
                {selectedDateData.payments.map((payment, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{payment.clientName}</div>
                      <div className="text-sm text-gray-500">Contrato #{payment.contractId}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{formatCurrency(payment.amount)}</div>
                      <div className="text-xs text-gray-500">Juros mensal</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setIsDetailsModalOpen(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
