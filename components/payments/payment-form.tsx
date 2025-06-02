"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Upload, FileText } from "lucide-react"

export function PaymentForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    contratoId: "",
    dataPagamento: "",
    valorPago: "",
    observacoes: "",
  })
  const [comprovante, setComprovante] = useState<File | null>(null)

  // Dados simulados de contratos
  const contratos = [
    { id: "1", devedor: "João Silva", saldoDevedor: 4200, jurosDevido: 250 },
    { id: "2", devedor: "Maria Santos", saldoDevedor: 2100, jurosDevido: 120 },
    { id: "3", devedor: "Carlos Oliveira", saldoDevedor: 6800, jurosDevido: 480 },
  ]

  const contratoSelecionado = contratos.find((c) => c.id === formData.contratoId)

  const calcularDistribuicao = () => {
    if (!contratoSelecionado || !formData.valorPago) return null

    const valorPago = Number.parseFloat(formData.valorPago)
    const jurosDevido = contratoSelecionado.jurosDevido

    let valorJuros = 0
    let valorCapital = 0

    if (valorPago >= jurosDevido) {
      valorJuros = jurosDevido
      valorCapital = valorPago - jurosDevido
    } else {
      valorJuros = valorPago
      valorCapital = 0
    }

    return { valorJuros, valorCapital }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setComprovante(file)
    }
  }

  const distribuicao = calcularDistribuicao()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui seria feita a chamada para a API
    console.log("Dados do pagamento:", formData, distribuicao, comprovante)

    // Redirecionar para página de sucesso com dados do pagamento
    const params = new URLSearchParams({
      id: "1",
      devedor: contratoSelecionado?.devedor || "",
      valor: formData.valorPago,
      juros: distribuicao?.valorJuros.toString() || "0",
      capital: distribuicao?.valorCapital.toString() || "0",
      data: formData.dataPagamento,
      obs: formData.observacoes,
    })

    router.push(`/pagamentos/sucesso?${params.toString()}`)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Registrar Novo Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contratoId">Selecionar Devedor</Label>
              <Select onValueChange={(value) => handleChange("contratoId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o devedor" />
                </SelectTrigger>
                <SelectContent>
                  {contratos.map((contrato) => (
                    <SelectItem key={contrato.id} value={contrato.id}>
                      {contrato.devedor} - Saldo:{" "}
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(contrato.saldoDevedor)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataPagamento">Data do Pagamento</Label>
                <Input
                  id="dataPagamento"
                  type="date"
                  value={formData.dataPagamento}
                  onChange={(e) => handleChange("dataPagamento", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valorPago">Valor Pago (R$)</Label>
                <Input
                  id="valorPago"
                  type="number"
                  step="0.01"
                  value={formData.valorPago}
                  onChange={(e) => handleChange("valorPago", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => handleChange("observacoes", e.target.value)}
                placeholder="Motivo do atraso, forma de pagamento, etc..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comprovante">Comprovante de Pagamento (Opcional)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4">
                <div className="flex items-center justify-center">
                  <Label htmlFor="comprovante-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Clique para anexar comprovante</span>
                    <span className="text-xs text-muted-foreground">PNG, JPG, PDF até 5MB</span>
                  </Label>
                  <Input
                    id="comprovante-upload"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                {comprovante && (
                  <div className="mt-3 flex items-center gap-2 p-2 bg-muted rounded">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{comprovante.name}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setComprovante(null)}>
                      Remover
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                Registrar Pagamento
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/pagamentos")}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {contratoSelecionado && formData.valorPago && distribuicao && (
        <Card>
          <CardHeader>
            <CardTitle>Distribuição do Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Juros devido:</span>
                <span className="font-medium">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(contratoSelecionado.jurosDevido)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Valor para juros:</span>
                <span className="font-medium text-blue-600">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(distribuicao.valorJuros)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Valor para capital:</span>
                <span className="font-medium text-green-600">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(distribuicao.valorCapital)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>Novo saldo devedor:</span>
                <span className="font-bold">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(contratoSelecionado.saldoDevedor - distribuicao.valorCapital)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
