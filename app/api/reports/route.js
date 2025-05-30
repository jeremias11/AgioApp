import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { verifyAuth } from "@/lib/auth"
import { cookies } from "next/headers"

export async function GET(request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")?.value

    const isAuthenticated = await verifyAuth(token)
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate") || "2024-01-01"
    const endDate = searchParams.get("endDate") || "2024-12-31"

    // 1. Estatísticas resumidas
    const summaryStats = await sql`
      SELECT 
        COALESCE(SUM(CASE WHEN c.status = 'active' THEN c.principal_amount ELSE 0 END), 0) as total_emprestado,
        COALESCE(SUM(CASE WHEN c.status = 'active' THEN 1 ELSE 0 END), 0) as contratos_ativos,
        COALESCE(COUNT(DISTINCT cl.id), 0) as total_clientes,
        COALESCE(SUM(p.amount), 0) as juros_recebidos,
        COALESCE(SUM(CASE WHEN c.status = 'completed' THEN c.principal_amount ELSE 0 END), 0) as total_quitado,
        COALESCE(SUM(CASE WHEN c.status = 'defaulted' THEN c.principal_amount ELSE 0 END), 0) as total_inadimplente
      FROM contracts c
      LEFT JOIN clients cl ON c.client_id = cl.id
      LEFT JOIN payments p ON c.id = p.contract_id 
        AND p.payment_date BETWEEN $1::date AND $2::date
      WHERE c.created_at::date BETWEEN $1::date AND $2::date
    `

    const summary = summaryStats[0] || {}

    // 2. Receita mensal (últimos 12 meses)
    const monthlyRevenue = await sql`
      SELECT 
        TO_CHAR(p.payment_date, 'YYYY-MM') as mes,
        TO_CHAR(p.payment_date, 'Mon/YY') as mes_formatado,
        SUM(p.amount) as receita,
        COUNT(p.id) as quantidade_pagamentos
      FROM payments p
      WHERE p.payment_date >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY TO_CHAR(p.payment_date, 'YYYY-MM'), TO_CHAR(p.payment_date, 'Mon/YY')
      ORDER BY mes ASC
    `

    // 3. Top 5 clientes por valor emprestado
    const topClients = await sql`
      SELECT 
        cl.id,
        cl.name,
        COUNT(c.id) as contratos_count,
        COALESCE(SUM(c.principal_amount), 0) as total_amount,
        COALESCE(SUM(p.amount), 0) as total_pago
      FROM clients cl
      LEFT JOIN contracts c ON cl.id = c.client_id
      LEFT JOIN payments p ON c.id = p.contract_id
      WHERE c.created_at::date BETWEEN $1::date AND $2::date
      GROUP BY cl.id, cl.name
      HAVING COUNT(c.id) > 0
      ORDER BY total_amount DESC
      LIMIT 5
    `

    // 4. Contratos por status
    const contractsByStatus = await sql`
      SELECT 
        status,
        COUNT(*) as count,
        COALESCE(SUM(principal_amount), 0) as total_amount,
        ROUND(
          (COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM contracts WHERE created_at::date BETWEEN $1::date AND $2::date), 0)), 
          2
        ) as percentage
      FROM contracts
      WHERE created_at::date BETWEEN $1::date AND $2::date
      GROUP BY status
      ORDER BY count DESC
    `

    // 5. Fluxo de pagamentos por mês
    const paymentFlow = await sql`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', payment_date), 'YYYY-MM') as mes,
        TO_CHAR(DATE_TRUNC('month', payment_date), 'Mon/YY') as mes_nome,
        SUM(amount) as total_recebido,
        COUNT(*) as quantidade_pagamentos,
        AVG(amount) as ticket_medio
      FROM payments
      WHERE payment_date BETWEEN $1::date AND $2::date
      GROUP BY DATE_TRUNC('month', payment_date)
      ORDER BY mes ASC
    `

    // 6. Análise de inadimplência
    const defaultAnalysis = await sql`
      SELECT 
        COUNT(CASE WHEN i.status = 'pending' AND i.due_date < CURRENT_DATE THEN 1 END) as parcelas_atrasadas,
        COALESCE(SUM(CASE WHEN i.status = 'pending' AND i.due_date < CURRENT_DATE THEN i.amount END), 0) as valor_atrasado,
        COUNT(CASE WHEN i.status = 'pending' AND i.due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days' THEN 1 END) as vencendo_7_dias,
        COALESCE(SUM(CASE WHEN i.status = 'pending' AND i.due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days' THEN i.amount END), 0) as valor_vencendo_7_dias
      FROM installments i
      JOIN contracts c ON i.contract_id = c.id
      WHERE c.status = 'active'
    `

    // 7. Performance por tipo de juros
    const interestTypeAnalysis = await sql`
      SELECT 
        interest_type,
        COUNT(*) as quantidade,
        AVG(interest_rate) as taxa_media,
        SUM(principal_amount) as valor_total,
        COALESCE(SUM(p.amount), 0) as juros_recebidos
      FROM contracts c
      LEFT JOIN payments p ON c.id = p.contract_id
      WHERE c.created_at::date BETWEEN $1::date AND $2::date
      GROUP BY interest_type
      ORDER BY valor_total DESC
    `

    return NextResponse.json(
      {
        summary: {
          totalEmprestado: Number.parseFloat(summary.total_emprestado) || 0,
          contratosAtivos: Number.parseInt(summary.contratos_ativos) || 0,
          totalClientes: Number.parseInt(summary.total_clientes) || 0,
          jurosRecebidos: Number.parseFloat(summary.juros_recebidos) || 0,
          totalQuitado: Number.parseFloat(summary.total_quitado) || 0,
          totalInadimplente: Number.parseFloat(summary.total_inadimplente) || 0,
        },
        monthlyRevenue: monthlyRevenue.map((row) => ({
          mes: row.mes,
          mesFormatado: row.mes_formatado,
          receita: Number.parseFloat(row.receita) || 0,
          quantidadePagamentos: Number.parseInt(row.quantidade_pagamentos) || 0,
        })),
        topClients: topClients.map((client) => ({
          id: client.id,
          name: client.name,
          contractsCount: Number.parseInt(client.contratos_count) || 0,
          totalAmount: Number.parseFloat(client.total_amount) || 0,
          totalPago: Number.parseFloat(client.total_pago) || 0,
        })),
        contractsByStatus: contractsByStatus.map((item) => ({
          status: item.status,
          count: Number.parseInt(item.count) || 0,
          totalAmount: Number.parseFloat(item.total_amount) || 0,
          percentage: Number.parseFloat(item.percentage) || 0,
        })),
        paymentFlow: paymentFlow.map((flow) => ({
          mes: flow.mes,
          mesNome: flow.mes_nome,
          totalRecebido: Number.parseFloat(flow.total_recebido) || 0,
          quantidadePagamentos: Number.parseInt(flow.quantidade_pagamentos) || 0,
          ticketMedio: Number.parseFloat(flow.ticket_medio) || 0,
        })),
        defaultAnalysis: {
          parcelasAtrasadas: Number.parseInt(defaultAnalysis[0]?.parcelas_atrasadas) || 0,
          valorAtrasado: Number.parseFloat(defaultAnalysis[0]?.valor_atrasado) || 0,
          vencendo7Dias: Number.parseInt(defaultAnalysis[0]?.vencendo_7_dias) || 0,
          valorVencendo7Dias: Number.parseFloat(defaultAnalysis[0]?.valor_vencendo_7_dias) || 0,
        },
        interestTypeAnalysis: interestTypeAnalysis.map((item) => ({
          interestType: item.interest_type,
          quantidade: Number.parseInt(item.quantidade) || 0,
          taxaMedia: Number.parseFloat(item.taxa_media) || 0,
          valorTotal: Number.parseFloat(item.valor_total) || 0,
          jurosRecebidos: Number.parseFloat(item.juros_recebidos) || 0,
        })),
      },
      [startDate, endDate],
    )
  } catch (error) {
    console.error("Erro ao buscar relatórios:", error)
    return NextResponse.json({ error: "Erro interno do servidor", details: error.message }, { status: 500 })
  }
}
