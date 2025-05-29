import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { verifyAuth } from "@/lib/auth"
import { cookies } from "next/headers"

export async function PUT(request, { params }) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")?.value

    const isAuthenticated = await verifyAuth(token)
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { id } = params
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

    const result = await sql`
      UPDATE contracts 
      SET client_id = ${client_id}, principal_amount = ${principal_amount}, 
          interest_rate = ${interest_rate}, interest_type = ${interest_type},
          start_date = ${start_date}, end_date = ${end_date}, 
          payment_frequency = ${payment_frequency}, 
          late_fee_percentage = ${late_fee_percentage}, 
          daily_interest_penalty = ${daily_interest_penalty}, 
          notes = ${notes}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Erro ao atualizar contrato:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")?.value

    const isAuthenticated = await verifyAuth(token)
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { id } = params

    await sql`
      DELETE FROM contracts WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir contrato:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
