import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Limpar dados existentes
  await prisma.pagamento.deleteMany({})
  await prisma.contrato.deleteMany({})

  // Criar contratos de exemplo
  const contratos = await Promise.all([
    prisma.contrato.create({
      data: {
        nomeDevedor: "João Silva",
        telefone: "11999887766",
        valorEmprestado: 5000,
        taxaJuros: 5,
        dataEmprestimo: new Date("2024-01-01"),
        diaVencimento: 15,
        observacoes: "Primeiro empréstimo",
        saldoDevedor: 4200,
        status: "ativo",
      },
    }),
    prisma.contrato.create({
      data: {
        nomeDevedor: "Maria Santos",
        telefone: "11888776655",
        valorEmprestado: 3000,
        taxaJuros: 4,
        dataEmprestimo: new Date("2023-12-15"),
        diaVencimento: 20,
        observacoes: "Cliente regular",
        saldoDevedor: 2100,
        status: "ativo",
      },
    }),
    prisma.contrato.create({
      data: {
        nomeDevedor: "Carlos Oliveira",
        telefone: "11777665544",
        valorEmprestado: 8000,
        taxaJuros: 6,
        dataEmprestimo: new Date("2023-11-10"),
        diaVencimento: 10,
        observacoes: "Empréstimo para reforma",
        saldoDevedor: 6800,
        status: "atrasado",
      },
    }),
  ])

  // Criar pagamentos de exemplo
  await Promise.all([
    prisma.pagamento.create({
      data: {
        contratoId: contratos[0].id,
        valor: 800,
        dataPagamento: new Date("2024-01-15"),
        tipo: "parcial",
        observacoes: "Pagamento em dinheiro",
      },
    }),
    prisma.pagamento.create({
      data: {
        contratoId: contratos[1].id,
        valor: 900,
        dataPagamento: new Date("2023-12-20"),
        tipo: "parcial",
        observacoes: "Transferência bancária",
      },
    }),
    prisma.pagamento.create({
      data: {
        contratoId: contratos[0].id,
        valor: 1000,
        dataPagamento: new Date("2024-02-15"),
        tipo: "parcial",
        observacoes: "PIX",
      },
    }),
  ])

  console.log("Seed executado com sucesso!")
  console.log(`Criados ${contratos.length} contratos`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
