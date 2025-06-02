"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText, Download, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

type ImportType = "contratos" | "pagamentos"
type ImportStep = "upload" | "mapping" | "preview" | "complete"

interface ColumnMapping {
  [key: string]: string
}

interface PreviewData {
  [key: string]: string | number
}

export function ImportData() {
  const router = useRouter()
  const { toast } = useToast()
  const [importType, setImportType] = useState<ImportType>("contratos")
  const [currentStep, setCurrentStep] = useState<ImportStep>("upload")
  const [file, setFile] = useState<File | null>(null)
  const [csvData, setCsvData] = useState<string[][]>([])
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({})
  const [previewData, setPreviewData] = useState<PreviewData[]>([])
  const [importResults, setImportResults] = useState<{ success: number; errors: number; detalhes?: any[] }>({
    success: 0,
    errors: 0,
  })
  const [isImporting, setIsImporting] = useState(false)

  // Campos obrigatórios para cada tipo de importação
  const requiredFields = {
    contratos: [
      { key: "nomeDevedor", label: "Nome do Devedor" },
      { key: "telefone", label: "Telefone" },
      { key: "valorEmprestado", label: "Valor Emprestado" },
      { key: "taxaJuros", label: "Taxa de Juros (%)" },
      { key: "dataEmprestimo", label: "Data do Empréstimo" },
      { key: "diaVencimento", label: "Dia de Vencimento" },
      { key: "observacoes", label: "Observações (Opcional)" },
    ],
    pagamentos: [
      { key: "contratoId", label: "ID do Contrato" },
      { key: "dataPagamento", label: "Data do Pagamento" },
      { key: "valorPago", label: "Valor Pago" },
      { key: "observacoes", label: "Observações (Opcional)" },
    ],
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (!uploadedFile) return

    setFile(uploadedFile)

    // Simular leitura do CSV
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const rows = text.split("\n").map((row) => row.split(",").map((cell) => cell.trim().replace(/"/g, "")))
      setCsvData(rows)
      setCurrentStep("mapping")
    }
    reader.readAsText(uploadedFile)
  }

  const handleColumnMapping = (fieldKey: string, columnIndex: string) => {
    setColumnMapping((prev) => ({
      ...prev,
      [fieldKey]: columnIndex,
    }))
  }

  const generatePreview = () => {
    if (csvData.length < 2) return

    const headers = csvData[0]
    const dataRows = csvData.slice(1, 6) // Primeiras 5 linhas para preview

    const preview = dataRows.map((row) => {
      const mappedRow: PreviewData = {}

      Object.entries(columnMapping).forEach(([fieldKey, columnIndex]) => {
        if (columnIndex && columnIndex !== "ignore") {
          const colIndex = Number.parseInt(columnIndex)
          mappedRow[fieldKey] = row[colIndex] || ""
        }
      })

      return mappedRow
    })

    setPreviewData(preview)
    setCurrentStep("preview")
  }

  const executeImport = async () => {
    setIsImporting(true)

    try {
      // Preparar dados para importação
      const dataRows = csvData.slice(1) // Pular cabeçalho
      const importData = dataRows
        .map((row) => {
          const mappedRow: Record<string, any> = {}

          Object.entries(columnMapping).forEach(([fieldKey, columnIndex]) => {
            if (columnIndex && columnIndex !== "ignore") {
              const colIndex = Number.parseInt(columnIndex)
              mappedRow[fieldKey] = row[colIndex] || ""
            }
          })

          return mappedRow
        })
        .filter((row) => {
          // Filtrar linhas vazias
          const requiredKeys = requiredFields[importType]
            .filter((field) => !field.label.includes("Opcional"))
            .map((field) => field.key)

          return requiredKeys.every((key) => row[key] && row[key].trim() !== "")
        })

      // Enviar para API
      const endpoint = importType === "contratos" ? "/api/contratos/importar" : "/api/pagamentos/importar"

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [importType]: importData,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || `Erro ao importar ${importType}`)
      }

      const result = await response.json()
      setImportResults(result)
      setCurrentStep("complete")

      toast({
        title: "Importação concluída",
        description: `${result.sucesso} ${importType} importados com sucesso.`,
      })
    } catch (error) {
      console.error("Erro:", error)
      toast({
        title: "Erro na importação",
        description: (error as Error).message || `Ocorreu um erro ao importar os ${importType}.`,
        variant: "destructive",
      })
      setImportResults({
        success: 0,
        errors: csvData.length - 1,
      })
      setCurrentStep("complete")
    } finally {
      setIsImporting(false)
    }
  }

  const resetImport = () => {
    setCurrentStep("upload")
    setFile(null)
    setCsvData([])
    setColumnMapping({})
    setPreviewData([])
    setImportResults({ success: 0, errors: 0 })
  }

  const downloadTemplate = () => {
    const fields = requiredFields[importType]
    const headers = fields.map((field) => field.label).join(",")

    let sampleData = ""
    if (importType === "contratos") {
      sampleData =
        "João Silva,11999887766,5000,5,2024-01-01,15,Primeiro empréstimo\nMaria Santos,11888776655,3000,4,2024-01-15,20,Cliente regular"
    } else {
      sampleData = "1,2024-01-15,500,Pagamento em dia\n2,2024-01-14,300,Pagamento parcial"
    }

    const csvContent = `${headers}\n${sampleData}`
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `template_${importType}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Importação de Dados</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={importType} onValueChange={(value) => setImportType(value as ImportType)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="contratos">Contratos</TabsTrigger>
              <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
            </TabsList>

            <TabsContent value="contratos" className="space-y-4">
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  Importe contratos existentes com informações de devedores, valores e condições de empréstimo.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="pagamentos" className="space-y-4">
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  Importe histórico de pagamentos para atualizar os saldos dos contratos existentes.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Etapa 1: Upload do Arquivo */}
      {currentStep === "upload" && (
        <Card>
          <CardHeader>
            <CardTitle>1. Upload do Arquivo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Button onClick={downloadTemplate} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Baixar Template
              </Button>
              <span className="text-sm text-muted-foreground">Baixe o template para ver o formato correto</span>
            </div>

            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <div className="space-y-2">
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-lg font-medium">Clique para selecionar arquivo</span>
                  <br />
                  <span className="text-sm text-muted-foreground">ou arraste e solte aqui</span>
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Formatos suportados: CSV, XLSX, XLS</p>
            </div>

            {file && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <FileText className="h-4 w-4" />
                <span className="text-sm">{file.name}</span>
                <Badge variant="secondary">{(file.size / 1024).toFixed(1)} KB</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Etapa 2: Mapeamento de Colunas */}
      {currentStep === "mapping" && csvData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>2. Mapeamento de Colunas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Mapeie as colunas do seu arquivo com os campos do sistema:</p>

            <div className="grid gap-4">
              {requiredFields[importType].map((field) => (
                <div key={field.key} className="flex items-center gap-4">
                  <Label className="w-48 text-sm">{field.label}</Label>
                  <Select onValueChange={(value) => handleColumnMapping(field.key, value)}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Selecione a coluna" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ignore">Ignorar</SelectItem>
                      {csvData[0]?.map((header, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          Coluna {index + 1}: {header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={generatePreview} disabled={Object.keys(columnMapping).length === 0}>
                Gerar Preview
              </Button>
              <Button variant="outline" onClick={resetImport}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Etapa 3: Preview dos Dados */}
      {currentStep === "preview" && (
        <Card>
          <CardHeader>
            <CardTitle>3. Preview dos Dados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Visualize como os dados serão importados (primeiras 5 linhas):
            </p>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    {requiredFields[importType].map((field) => (
                      <TableHead key={field.key}>{field.label}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.map((row, index) => (
                    <TableRow key={index}>
                      {requiredFields[importType].map((field) => (
                        <TableCell key={field.key}>{row[field.key] || "-"}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={executeImport} disabled={isImporting}>
                {isImporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importando...
                  </>
                ) : (
                  "Confirmar Importação"
                )}
              </Button>
              <Button variant="outline" onClick={() => setCurrentStep("mapping")} disabled={isImporting}>
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Etapa 4: Resultado da Importação */}
      {currentStep === "complete" && (
        <Card>
          <CardHeader>
            <CardTitle>4. Importação Concluída</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Importação realizada com sucesso!</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{importResults.success}</div>
                <div className="text-sm text-green-700 dark:text-green-300">Registros importados</div>
              </div>

              {importResults.errors > 0 && (
                <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{importResults.errors}</div>
                  <div className="text-sm text-red-700 dark:text-red-300">Erros encontrados</div>
                </div>
              )}
            </div>

            {importResults.errors > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Alguns registros não puderam ser importados devido a dados inválidos ou incompletos.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4 pt-4">
              <Button onClick={resetImport}>Nova Importação</Button>
              <Button variant="outline" onClick={() => router.push(`/${importType}`)}>
                Ver {importType === "contratos" ? "Contratos" : "Pagamentos"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
