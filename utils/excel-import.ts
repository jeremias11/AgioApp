import * as XLSX from "xlsx"
import type { LoanContract, Receipt, Client } from "@/types/loan"

// Função para converter data de string para objeto Date
export function parseDate(dateString: string): Date {
  // Tenta diferentes formatos de data
  if (!dateString) return new Date()

  // Verifica se é uma data no formato Excel (número de dias desde 1/1/1900)
  if (!isNaN(Number(dateString))) {
    // Converte número Excel para data JavaScript
    const excelDate = Number(dateString)
    // Excel usa 1/1/1900 como dia 1, e tem um bug onde considera 1900 como ano bissexto
    const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000))
    return date
  }

  try {
    // Tenta converter usando Date.parse
    const timestamp = Date.parse(dateString)
    if (!isNaN(timestamp)) {
      return new Date(timestamp)
    }

    // Tenta formato DD/MM/YYYY
    const parts = dateString.split(/[/\-.]/)
    if (parts.length === 3) {
      // Assume DD/MM/YYYY se o primeiro número for <= 31
      if (Number.parseInt(parts[0]) <= 31) {
        return new Date(Number.parseInt(parts[2]), Number.parseInt(parts[1]) - 1, Number.parseInt(parts[0]))
      }
      // Assume YYYY/MM/DD
      return new Date(Number.parseInt(parts[0]), Number.parseInt(parts[1]) - 1, Number.parseInt(parts[2]))
    }

    return new Date()
  } catch (e) {
    console.error("Erro ao converter data:", e)
    return new Date()
  }
}

// Função para processar arquivo Excel/CSV e extrair contratos
export async function processContractsFile(file: File): Promise<{
  contracts: Partial<LoanContract>[]
  errors: string[]
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    const errors: string[] = []

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })

        // Assume que a primeira planilha contém os dados
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]

        // Converte para JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        // Mapeia os dados para o formato de contrato
        const contracts: Partial<LoanContract>[] = jsonData
          .map((row: any, index) => {
            try {
              // Verifica campos obrigatórios
              if (!row["Nome do Cliente"] || !row["Valor do Empréstimo"] || !row["Taxa de Juros"]) {
                errors.push(`Linha ${index + 2}: Campos obrigatórios ausentes`)
                return null
              }

              const loanAmount = Number(row["Valor do Empréstimo"])
              const interestRate = Number(row["Taxa de Juros"])

              if (isNaN(loanAmount) || isNaN(interestRate)) {
                errors.push(`Linha ${index + 2}: Valores numéricos inválidos`)
                return null
              }

              // Cria cliente
              const client: Partial<Client> = {
                id: `c-import-${Date.now()}-${index}`,
                name: row["Nome do Cliente"],
                phone: row["Telefone"] || undefined,
                email: row["Email"] || undefined,
                createdAt: new Date(),
                updatedAt: new Date(),
              }

              // Cria contrato
              const contract: Partial<LoanContract> = {
                id: `loan-import-${Date.now()}-${index}`,
                clientId: client.id as string,
                client: client as Client,
                loanDate: parseDate(row["Data do Empréstimo"] || new Date().toISOString()),
                loanAmount,
                interestRate,
                totalWithInterest: loanAmount * (1 + interestRate / 100),
                currentBalance: loanAmount,
                monthlyInterestAmount: (loanAmount * interestRate) / 100,
                paymentDay: Number(row["Dia de Pagamento"] || 1),
                status: "active",
                observations: row["Observações"] || undefined,
                createdAt: new Date(),
                updatedAt: new Date(),
              }

              return contract
            } catch (err) {
              errors.push(`Linha ${index + 2}: ${err.message}`)
              return null
            }
          })
          .filter(Boolean) as Partial<LoanContract>[]

        resolve({ contracts, errors })
      } catch (err) {
        reject(`Erro ao processar arquivo: ${err.message}`)
      }
    }

    reader.onerror = () => {
      reject("Erro ao ler o arquivo")
    }

    reader.readAsArrayBuffer(file)
  })
}

// Função para processar arquivo Excel/CSV e extrair recebimentos
export async function processReceiptsFile(file: File): Promise<{
  receipts: Partial<Receipt>[]
  errors: string[]
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    const errors: string[] = []

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })

        // Assume que a primeira planilha contém os dados
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]

        // Converte para JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        // Mapeia os dados para o formato de recebimento
        const receipts: Partial<Receipt>[] = jsonData
          .map((row: any, index) => {
            try {
              // Verifica campos obrigatórios
              if (!row["ID do Contrato"] || !row["Nome do Cliente"] || !row["Valor"] || !row["Data do Recebimento"]) {
                errors.push(
                  `Linha ${index + 2}: Campos obrigatórios ausentes (ID do Contrato, Nome do Cliente, Valor e Data do Recebimento são obrigatórios)`,
                )
                return null
              }

              const amount = Number(row["Valor"])

              if (isNaN(amount)) {
                errors.push(`Linha ${index + 2}: Valor inválido`)
                return null
              }

              // Cria recebimento
              const receipt: Partial<Receipt> = {
                id: `r-import-${Date.now()}-${index}`,
                contractId: row["ID do Contrato"],
                clientName: row["Nome do Cliente"],
                amount,
                receiptDate: parseDate(row["Data do Recebimento"]),
                paymentMethod: row["Método de Pagamento"] || "pix",
                description: row["Descrição"] || undefined,
                receiptNumber: `REC-IMPORT-${Date.now()}-${index}`,
                createdAt: new Date(),
              }

              return receipt
            } catch (err) {
              errors.push(`Linha ${index + 2}: ${err.message}`)
              return null
            }
          })
          .filter(Boolean) as Partial<Receipt>[]

        resolve({ receipts, errors })
      } catch (err) {
        reject(`Erro ao processar arquivo: ${err.message}`)
      }
    }

    reader.onerror = () => {
      reject("Erro ao ler o arquivo")
    }

    reader.readAsArrayBuffer(file)
  })
}

// Função para gerar arquivo de modelo para importação de contratos
export function generateContractsTemplate(): Blob {
  const template = [
    {
      "Nome do Cliente": "João Silva",
      Telefone: "(11) 99999-9999",
      Email: "joao@email.com",
      "Valor do Empréstimo": 10000,
      "Taxa de Juros": 5,
      "Data do Empréstimo": "15/01/2024",
      "Dia de Pagamento": 15,
      Observações: "Empréstimo para reforma da casa",
    },
    {
      "Nome do Cliente": "Maria Santos",
      Telefone: "(11) 88888-8888",
      Email: "maria@email.com",
      "Valor do Empréstimo": 25000,
      "Taxa de Juros": 4,
      "Data do Empréstimo": "01/12/2023",
      "Dia de Pagamento": 5,
      Observações: "",
    },
  ]

  const worksheet = XLSX.utils.json_to_sheet(template)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Contratos")

  return new Blob([XLSX.write(workbook, { bookType: "xlsx", type: "array" })], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })
}

// Função para gerar arquivo de modelo para importação de recebimentos
export function generateReceiptsTemplate(): Blob {
  const template = [
    {
      "ID do Contrato": "1",
      "Nome do Cliente": "João Silva",
      Valor: 1500,
      "Data do Recebimento": "15/02/2024",
      "Método de Pagamento": "pix",
      Descrição: "Pagamento mensal",
    },
    {
      "ID do Contrato": "2",
      "Nome do Cliente": "Maria Santos",
      Valor: 2500,
      "Data do Recebimento": "10/02/2024",
      "Método de Pagamento": "transferência",
      Descrição: "Pagamento parcial",
    },
  ]

  const worksheet = XLSX.utils.json_to_sheet(template)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Recebimentos")

  return new Blob([XLSX.write(workbook, { bookType: "xlsx", type: "array" })], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })
}
