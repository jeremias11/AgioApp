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
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // Summary statistics
    const [summaryResult] = await sql`
      SELECT 
        COALESCE(SUM(CASE WHEN c.status = 'active' THEN c.principal_amount ELSE 0 END), 0) as total_revenue,
        COALESCE(SUM(p.amount), 0) as total_interest,
        COUNT(DISTINCT CASE WHEN cl.created_at::date BETWEEN ${startDate} AND ${endDate} THEN cl.id END) as new_clients,
        COUNT(CASE WHEN c.status = 'active' THEN 1 END) as active_contracts
      FROM contracts c
      LEFT JOIN clients cl ON c.client_id = cl.id
      LEFT JOIN payments p ON c.id = p.contract_id AND p.payment_date BETWEEN ${startDate} AND ${endDate}
      WHERE c.created_at::date BETWEEN ${startDate} AND ${endDate}
    `

    // Top clients
    const topClients = await sql`
      SELECT 
        cl.id,
        cl.name,
        COUNT(c.id) as contracts_count,
        COALESCE(SUM(c.principal_amount), 0) as total_amount
      FROM clients cl
      LEFT JOIN contracts c ON cl.id = c.client_id
      WHERE c.created_at::date BETWEEN ${startDate} AND ${endDate}
      GROUP BY cl.id, cl.name
      ORDER BY total_amount DESC
      LIMIT 5
    `

    // Contracts by status
    const contractsByStatus = await sql`
      SELECT 
        status,
        COUNT(*) as count,
        COALESCE(SUM(principal_amount), 0) as total_amount,
        ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM contracts WHERE created_at::date BETWEEN ${startDate} AND ${endDate})), 2) as percentage
      FROM contracts
      WHERE created_at::date BETWEEN ${startDate} AND ${endDate}
      GROUP BY status
      ORDER BY count DESC
    `

    return NextResponse.json({
      summary: {
        totalRevenue: Number.parseFloat(summaryResult.total_revenue) || 0,
        totalInterest: Number.parseFloat(summaryResult.total_interest) || 0,
        newClients: Number.parseInt(summaryResult.new_clients) || 0,
        activeContracts: Number.parseInt(summaryResult.active_contracts) || 0,
      },
      topClients,
      contractsByStatus,
    })
  } catch (error) {
    console.error("Erro ao buscar relatórios:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
