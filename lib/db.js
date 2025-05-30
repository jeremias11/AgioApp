import { neon } from "@neondatabase/serverless"

export const sql = neon(process.env.DATABASE_URL)

export async function executeQuery(query, params = []) {
  try {
    const result = await sql(query, params)
    return result
  } catch (error) {
    console.error("Database error:", error)
    throw new Error("Database error: " + error.message)
  }
}
