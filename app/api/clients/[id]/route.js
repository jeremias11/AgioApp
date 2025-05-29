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
    const { name, cpf, rg, email, phone, address, city, state, zip_code, notes } = await request.json()

    const result = await sql`
      UPDATE clients 
      SET name = ${name}, cpf = ${cpf}, rg = ${rg}, email = ${email}, 
          phone = ${phone}, address = ${address}, city = ${city}, 
          state = ${state}, zip_code = ${zip_code}, notes = ${notes},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error)
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
      DELETE FROM clients WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir cliente:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
