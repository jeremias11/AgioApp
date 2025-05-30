"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, AlertCircle, CheckCircle2 } from "lucide-react"
import { processReceiptsFile, generateReceiptsTemplate } from "@/utils/excel-import"
import type { Receipt } from "@/types/loan"

interface ImportReceiptsModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (receipts: Omit<Receipt, "interestPortion" | "principalPortion" | "balanceAfterPayment">[]) => {
    processed: number
    errors: string[]
  }
}

export function ImportReceiptsModal({ isOpen, onClose, onImport }: ImportReceiptsModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [preview, setPreview] = useState<Partial<Receipt>[]>([])
  const [imported, setImported] = useState(false)
  const [importResult, setImportResult] = useState<{ processed: number; errors: string[] } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setErrors([])
      setPreview([])
      setImported(false)
      setImportResult(null)
      processFile(selectedFile)
    }
  }

  const processFile = async (selectedFile: File) => {
    setIsLoading(true)
    try {
      const { receipts, errors } = await processReceiptsFile(selectedFile)
      setPreview(receipts)
      setErrors(errors)
    } catch (error) {
      setErrors([error.toString()])
    } finally {
      setIsLoading(false)
    }
  }

  const handleImport = () => {
    if (preview.length > 0) {
      setIsLoading(true)
      try {
        const result = onImport(
          preview as Omit<Receipt, "interestPortion" | "principalPortion" | "balanceAfterPayment">[],
        )
        setImportResult(result)
        setImported(true)
      } catch (error) {
        setErrors([...errors, error.toString()])
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleDownloadTemplate = () => {
    const blob = generateReceiptsTemplate()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "modelo_importacao_recebimentos.xlsx"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleClose = () => {
    setFile(null)
    setErrors([])
    setPreview([])
    setImported(false)
    setImportResult(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Importar Recebimentos</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!imported ? (
            <>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <Label htmlFor="file-upload">Arquivo Excel/CSV</Label>
                    <p className="text-sm text-gray-500">
                      Selecione um arquivo Excel (.xlsx) ou CSV (.csv) com os dados dos recebimentos
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleDownloadTemplate} className="flex gap-2">
                    <Download className="h-4 w-4" />
                    Baixar Modelo
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    disabled={isLoading}
                  />
                  <Button onClick={() => document.getElementById("file-upload")?.click()} disabled={isLoading}>
                    Selecionar
                  </Button>
                </div>

                {file && (
                  <p className="text-sm">
                    Arquivo selecionado: <span className="font-medium">{file.name}</span>
                  </p>
                )}
              </div>

              {errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-medium mb-2">Erros encontrados:</div>
                    <ul className="list-disc pl-5 space-y-1">
                      {errors.map((error, index) => (
                        <li key={index} className="text-sm">
                          {error}
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {preview.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-medium">Pré-visualização ({preview.length} recebimentos)</h3>
                  <div className="max-h-60 overflow-auto border rounded-md">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID Contrato
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cliente
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Valor
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Data
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Método
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {preview.map((receipt, index) => (
                          <tr key={index}>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">{receipt.contractId}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">{receipt.clientName}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">
                              {receipt.amount?.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">
                              {receipt.receiptDate?.toLocaleDateString("pt-BR")}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">{receipt.paymentMethod}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button onClick={handleImport} disabled={isLoading || preview.length === 0} className="flex gap-2">
                  {isLoading ? (
                    "Processando..."
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Importar {preview.length} Recebimentos
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-medium text-center">Importação Concluída!</h3>
                <p className="text-center mt-2">
                  {importResult?.processed} recebimentos foram processados com sucesso.
                </p>
              </div>

              {importResult?.errors && importResult.errors.length > 0 && (
                <Alert variant="warning">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-medium mb-2">Alguns recebimentos não puderam ser processados:</div>
                    <ul className="list-disc pl-5 space-y-1">
                      {importResult.errors.map((error, index) => (
                        <li key={index} className="text-sm">
                          {error}
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-center">
                <Button onClick={handleClose}>Fechar</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
