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

export function ContractForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nomeDevedor: "",
    telefone: "",
    valorEmprestado: "",
    taxaJuros: "",
    dataEmprestimo: "",
    diaVencimento: "",
    observacoes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui seria feita a chamada para a API
    console.log("Dados do contrato:", formData)
    router.push("/contratos")
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Cadastro de Novo Contrato</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nomeDevedor">Nome do Devedor</Label>
              <Input
                id="nomeDevedor"
                value={formData.nomeDevedor}
                onChange={(e) => handleChange("nomeDevedor", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleChange("telefone", e.target.value)}
                placeholder="11999887766"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valorEmprestado">Valor Emprestado (R$)</Label>
              <Input
                id="valorEmprestado"
                type="number"
                step="0.01"
                value={formData.valorEmprestado}
                onChange={(e) => handleChange("valorEmprestado", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxaJuros">Taxa de Juros Mensal (%)</Label>
              <Input
                id="taxaJuros"
                type="number"
                step="0.1"
                value={formData.taxaJuros}
                onChange={(e) => handleChange("taxaJuros", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataEmprestimo">Data do Empréstimo</Label>
              <Input
                id="dataEmprestimo"
                type="date"
                value={formData.dataEmprestimo}
                onChange={(e) => handleChange("dataEmprestimo", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="diaVencimento">Dia Fixo de Pagamento</Label>
              <Select onValueChange={(value) => handleChange("diaVencimento", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o dia" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      Dia {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => handleChange("observacoes", e.target.value)}
              placeholder="Informações adicionais sobre o contrato..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              Salvar Contrato
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/contratos")}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
