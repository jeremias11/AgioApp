import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { createUser, createSubscription } from "@/lib/db"

export async function POST(request) {
  try {
    const { name, email, password, company, plan } = await request.json()

    // Hash da senha
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    // Criar usuário
    const userResult = await createUser({
      name,
      email,
      passwordHash,
      company,
      plan,
    })

    if (!userResult.success) {
      return NextResponse.json({ error: "Falha ao criar usuário", details: userResult.error }, { status: 400 })
    }

    // Definir preço com base no plano
    let price = 97.0 // basic
    if (plan === "premium") price = 197.0
    if (plan === "enterprise") price = 397.0

    // Criar assinatura
    const subscriptionResult = await createSubscription({
      userId: userResult.user.id,
      plan,
      price,
    })

    if (!subscriptionResult.success) {
      return NextResponse.json(
        { error: "Falha ao criar assinatura", details: subscriptionResult.error },
        { status: 400 },
      )
    }

    // Retornar sucesso (sem a senha)
    return NextResponse.json({
      success: true,
      user: {
        id: userResult.user.id,
        name: userResult.user.name,
        email: userResult.user.email,
        plan: userResult.user.plan,
      },
    })
  } catch (error) {
    console.error("Erro no registro:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
