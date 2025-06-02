"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Upload, FileText } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Contrato {
  id: number
  nomeDevedor: string
  saldoDevedor: number
  taxaJuros: number
}

export function PaymentForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    contratoId: "",
    dataPagamento: "",
    valorPago: "",
    observacoes: "",
  })
  const [comprovante, setComprovante] = useState<File | null>(null)
  const [contratos, setContratos] = useState<Contrato[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContratos = async () => {
      try {
        const response = await fetch("/api/contratos")
        if (!response.ok) {
          throw new Error("Erro ao buscar contratos")
        }
        const data = await response.json()
        setContratos(data)
      } catch (err) {
        console.error("Erro:", err)
        toast({
          title: "Erro ao carregar contratos",
          description: "Não foi possível carregar a lista de contratos.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchContratos()
  }, [toast])

  const contratoSelecionado = contratos.find((c) => c.id.toString() === formData.contratoId)

  const calcularDistribuicao = () => {
    if (!contratoSelecionado || !formData.valorPago) return null

    const valorPago = Number.parseFloat(formData.valorPago)
    const jurosDevido = (contratoSelecionado.saldoDevedor * contratoSelecionado.taxaJuros) / 100

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Preparar dados para envio
      const paymentData = {
        ...formData,
        valorPago: Number.parseFloat(formData.valorPago),
      }

      // Enviar para API
      const response = await fetch("/api/pagamentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erro ao registrar pagamento")
      }

      const result = await response.json()

      toast({
        title: "Pagamento registrado com sucesso!",
        description: `Pagamento de ${new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(Number.parseFloat(formData.valorPago))} registrado.`,
      })

      // Redirecionar para página de sucesso com dados do pagamento
      const params = new URLSearchParams({
        id: result.pagamento.id.toString(),
        devedor: contratoSelecionado?.nomeDevedor || "",
        valor: formData.valorPago,
        juros: result.pagamento.valorJuros.toString(),
        capital: result.pagamento.valorCapital.toString(),
        data: formData.dataPagamento,
        obs: formData.observacoes,
        saldoAnterior: result.saldoAnterior.toString(),
        novoSaldo: result.novoSaldo.toString(),
      })

      router.push(`/pagamentos/sucesso?${params.toString()}`)
    } catch (error) {
      console.error("Erro:", error)
      toast({
        title: "Erro ao registrar pagamento",
        description: (error as Error).message || "Ocorreu um erro ao registrar o pagamento.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
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
                  <SelectValue placeholder={loading ? "Carregando contratos..." : "Selecione o devedor"} />
                </SelectTrigger>
                <SelectContent>
                  {contratos.map((contrato) => (
                    <SelectItem key={contrato.id} value={contrato.id.toString()}>
                      {contrato.nomeDevedor} - Saldo:{" "}
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
              <Button type="submit" className="flex-1" disabled={isSubmitting || !contratoSelecionado}>
                {isSubmitting ? "Registrando..." : "Registrar Pagamento"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/pagamentos")}
                disabled={isSubmitting}
              >
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
                  }).format((contratoSelecionado.saldoDevedor * contratoSelecionado.taxaJuros) / 100)}
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
