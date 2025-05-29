import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { verifyAuth } from "@/lib/auth"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")?.value

    const isAuthenticated = await verifyAuth(token)
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const contracts = await sql`
      SELECT 
        c.*,
        cl.name as client_name
      FROM contracts c
      JOIN clients cl ON c.client_id = cl.id
      ORDER BY c.created_at DESC
    `

    return NextResponse.json(contracts)
  } catch (error) {
    console.error("Erro ao buscar contratos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")?.value

    const isAuthenticated = await verifyAuth(token)
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const {
      client_id,
      principal_amount,
      interest_rate,
      interest_type,
      start_date,
      end_date,
      payment_frequency,
      late_fee_percentage,
      daily_interest_penalty,
      notes,
    } = await request.json()

    // Gerar número do contrato
    const contractNumber = `CONT-${Date.now()}`

    const result = await sql`
      INSERT INTO contracts (
        user_id, client_id, contract_number, principal_amount, interest_rate, 
        interest_type, start_date, end_date, payment_frequency, 
        late_fee_percentage, daily_interest_penalty, notes
      )
      VALUES (
        1, ${client_id}, ${contractNumber}, ${principal_amount}, ${interest_rate},
        ${interest_type}, ${start_date}, ${end_date}, ${payment_frequency},
        ${late_fee_percentage}, ${daily_interest_penalty}, ${notes}
      )
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Erro ao criar contrato:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
