"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Eye, Save, RotateCcw } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ReceiptPreview } from "../payments/receipt-preview"

interface ReceiptConfig {
  // Empresa
  nomeEmpresa: string
  cnpj: string
  endereco: string
  telefone: string
  email: string
  logo: string | null

  // Layout
  template: "moderno" | "classico" | "minimalista"
  corPrimaria: string
  corSecundaria: string
  fonte: "arial" | "helvetica" | "times"

  // Conteúdo
  tituloRecibo: string
  rodape: string
  observacoesDefault: string
  mostrarAssinatura: boolean
  mostrarCarimbo: boolean
}

export function ReceiptSettings() {
  const [config, setConfig] = useState<ReceiptConfig>({
    nomeEmpresa: "ÁgioApp Financeira",
    cnpj: "00.000.000/0001-00",
    endereco: "Rua das Finanças, 123 - Centro",
    telefone: "(11) 99999-9999",
    email: "contato@agioapp.com",
    logo: null,
    template: "moderno",
    corPrimaria: "#2563eb",
    corSecundaria: "#64748b",
    fonte: "helvetica",
    tituloRecibo: "RECIBO DE PAGAMENTO",
    rodape: "Este recibo comprova o pagamento realizado na data especificada.",
    observacoesDefault: "",
    mostrarAssinatura: true,
    mostrarCarimbo: false,
  })

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [previewLogo, setPreviewLogo] = useState<string | null>(null)

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreviewLogo(result)
        setConfig((prev) => ({ ...prev, logo: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    // Aqui salvaria as configurações na API/localStorage
    localStorage.setItem("receiptConfig", JSON.stringify(config))
    console.log("Configurações salvas:", config)
  }

  const handleReset = () => {
    setConfig({
      nomeEmpresa: "ÁgioApp Financeira",
      cnpj: "00.000.000/0001-00",
      endereco: "Rua das Finanças, 123 - Centro",
      telefone: "(11) 99999-9999",
      email: "contato@agioapp.com",
      logo: null,
      template: "moderno",
      corPrimaria: "#2563eb",
      corSecundaria: "#64748b",
      fonte: "helvetica",
      tituloRecibo: "RECIBO DE PAGAMENTO",
      rodape: "Este recibo comprova o pagamento realizado na data especificada.",
      observacoesDefault: "",
      mostrarAssinatura: true,
      mostrarCarimbo: false,
    })
    setPreviewLogo(null)
    setLogoFile(null)
  }

  const updateConfig = (field: keyof ReceiptConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [field]: value }))
  }

  // Dados de exemplo para preview
  const samplePaymentData = {
    id: "000123",
    devedor: "João Silva",
    valorPago: 500,
    valorJuros: 250,
    valorCapital: 250,
    dataPagamento: new Date().toISOString().split("T")[0],
    observacoes: "Pagamento em dia",
    contratoId: "001",
    saldoAnterior: 4200,
    novoSaldo: 3950,
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personalização de Recibos</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="empresa" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="empresa">Empresa</TabsTrigger>
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="conteudo">Conteúdo</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="empresa" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomeEmpresa">Nome da Empresa</Label>
                  <Input
                    id="nomeEmpresa"
                    value={config.nomeEmpresa}
                    onChange={(e) => updateConfig("nomeEmpresa", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={config.cnpj}
                    onChange={(e) => updateConfig("cnpj", e.target.value)}
                    placeholder="00.000.000/0001-00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={config.telefone}
                    onChange={(e) => updateConfig("telefone", e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={config.email}
                    onChange={(e) => updateConfig("email", e.target.value)}
                    placeholder="contato@empresa.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={config.endereco}
                  onChange={(e) => updateConfig("endereco", e.target.value)}
                  placeholder="Rua, número - Bairro - Cidade/UF"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo da Empresa</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4">
                  {previewLogo ? (
                    <div className="flex items-center gap-4">
                      <img src={previewLogo || "/placeholder.svg"} alt="Logo" className="h-16 w-auto object-contain" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Logo carregada</p>
                        <p className="text-xs text-muted-foreground">{logoFile?.name}</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPreviewLogo(null)
                          setLogoFile(null)
                          updateConfig("logo", null)
                        }}
                      >
                        Remover
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Label htmlFor="logo-upload" className="cursor-pointer flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Clique para fazer upload do logo</span>
                        <span className="text-xs text-muted-foreground">PNG, JPG até 2MB</span>
                      </Label>
                      <Input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="layout" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="template">Template</Label>
                  <Select value={config.template} onValueChange={(value: any) => updateConfig("template", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="moderno">Moderno</SelectItem>
                      <SelectItem value="classico">Clássico</SelectItem>
                      <SelectItem value="minimalista">Minimalista</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="corPrimaria">Cor Primária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="corPrimaria"
                      type="color"
                      value={config.corPrimaria}
                      onChange={(e) => updateConfig("corPrimaria", e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={config.corPrimaria}
                      onChange={(e) => updateConfig("corPrimaria", e.target.value)}
                      placeholder="#2563eb"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="corSecundaria">Cor Secundária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="corSecundaria"
                      type="color"
                      value={config.corSecundaria}
                      onChange={(e) => updateConfig("corSecundaria", e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={config.corSecundaria}
                      onChange={(e) => updateConfig("corSecundaria", e.target.value)}
                      placeholder="#64748b"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fonte">Fonte</Label>
                <Select value={config.fonte} onValueChange={(value: any) => updateConfig("fonte", value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="helvetica">Helvetica</SelectItem>
                    <SelectItem value="arial">Arial</SelectItem>
                    <SelectItem value="times">Times New Roman</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="mostrarAssinatura"
                    checked={config.mostrarAssinatura}
                    onChange={(e) => updateConfig("mostrarAssinatura", e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="mostrarAssinatura">Mostrar campos de assinatura</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="mostrarCarimbo"
                    checked={config.mostrarCarimbo}
                    onChange={(e) => updateConfig("mostrarCarimbo", e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="mostrarCarimbo">Mostrar espaço para carimbo</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="conteudo" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tituloRecibo">Título do Recibo</Label>
                <Input
                  id="tituloRecibo"
                  value={config.tituloRecibo}
                  onChange={(e) => updateConfig("tituloRecibo", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rodape">Rodapé</Label>
                <Textarea
                  id="rodape"
                  value={config.rodape}
                  onChange={(e) => updateConfig("rodape", e.target.value)}
                  placeholder="Texto que aparecerá no rodapé do recibo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoesDefault">Observações Padrão</Label>
                <Textarea
                  id="observacoesDefault"
                  value={config.observacoesDefault}
                  onChange={(e) => updateConfig("observacoesDefault", e.target.value)}
                  placeholder="Observações que aparecerão por padrão nos recibos"
                />
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <div className="text-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg">
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar Recibo Personalizado
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Preview do Recibo Personalizado</DialogTitle>
                    </DialogHeader>
                    <ReceiptPreview paymentData={samplePaymentData} config={config} />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Configuração Atual:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    Template: <span className="font-medium">{config.template}</span>
                  </div>
                  <div>
                    Fonte: <span className="font-medium">{config.fonte}</span>
                  </div>
                  <div>
                    Cor Primária: <span className="font-medium">{config.corPrimaria}</span>
                  </div>
                  <div>
                    Cor Secundária: <span className="font-medium">{config.corSecundaria}</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 pt-6 border-t">
            <Button onClick={handleSave} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Salvar Configurações
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Restaurar Padrão
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
