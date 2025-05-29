import { neon } from "@neondatabase/serverless"

// Criar conexão com o banco de dados
export const sql = neon(process.env.DATABASE_URL)

// Função para criar usuário
export async function createUser({ name, email, passwordHash, company, plan }) {
  try {
    const result = await sql`
      INSERT INTO users (name, email, password_hash, company, plan)
      VALUES (${name}, ${email}, ${passwordHash}, ${company}, ${plan})
      RETURNING id, name, email, company, plan
    `
    return { success: true, user: result[0] }
  } catch (error) {
    console.error("Erro ao criar usuário:", error)
    return { success: false, error: error.message }
  }
}

// Função para buscar usuário por email
export async function getUserByEmail(email) {
  try {
    const users = await sql`
      SELECT id, name, email, password_hash, company, plan
      FROM users
      WHERE email = ${email}
    `
    return users[0] || null
  } catch (error) {
    console.error("Erro ao buscar usuário:", error)
    return null
  }
}

// Função para criar assinatura
export async function createSubscription({ userId, plan, price }) {
  try {
    // Calcular data de término (30 dias a partir de hoje)
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 30)

    const result = await sql`
      INSERT INTO subscriptions (user_id, plan, status, price, end_date)
      VALUES (${userId}, ${plan}, 'active', ${price}, ${endDate.toISOString()})
      RETURNING id
    `
    return { success: true, subscriptionId: result[0].id }
  } catch (error) {
    console.error("Erro ao criar assinatura:", error)
    return { success: false, error: error.message }
  }
}
