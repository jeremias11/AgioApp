"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, AlertCircle, CheckCircle2 } from "lucide-react"
import { processContractsFile, generateContractsTemplate } from "@/utils/excel-import"
import type { LoanContract } from "@/types/loan"

interface ImportContractsModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (contracts: LoanContract[]) => number
}

export function ImportContractsModal({ isOpen, onClose, onImport }: ImportContractsModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [preview, setPreview] = useState<Partial<LoanContract>[]>([])
  const [imported, setImported] = useState(false)
  const [importCount, setImportCount] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setErrors([])
      setPreview([])
      setImported(false)
      processFile(selectedFile)
    }
  }

  const processFile = async (selectedFile: File) => {
    setIsLoading(true)
    try {
      const { contracts, errors } = await processContractsFile(selectedFile)
      setPreview(contracts)
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
        const count = onImport(preview as LoanContract[])
        setImportCount(count)
        setImported(true)
      } catch (error) {
        setErrors([...errors, error.toString()])
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleDownloadTemplate = () => {
    const blob = generateContractsTemplate()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "modelo_importacao_contratos.xlsx"
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
    setImportCount(0)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Importar Contratos</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!imported ? (
            <>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <Label htmlFor="file-upload">Arquivo Excel/CSV</Label>
                    <p className="text-sm text-gray-500">
                      Selecione um arquivo Excel (.xlsx) ou CSV (.csv) com os dados dos contratos
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
                  <h3 className="font-medium">Pré-visualização ({preview.length} contratos)</h3>
                  <div className="max-h-60 overflow-auto border rounded-md">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cliente
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Valor
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Taxa
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Data
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {preview.map((contract, index) => (
                          <tr key={index}>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">{contract.client?.name}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">
                              {contract.loanAmount?.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">{contract.interestRate}%</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">
                              {contract.loanDate?.toLocaleDateString("pt-BR")}
                            </td>
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
                      Importar {preview.length} Contratos
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
                <p className="text-center mt-2">{importCount} contratos foram importados com sucesso.</p>
              </div>

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
