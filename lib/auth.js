import jwt from "jsonwebtoken"
import { sql } from "./db"
import bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function verifyAuth(token) {
  if (!token) return false

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await sql`SELECT id, email FROM users WHERE id = ${decoded.userId} LIMIT 1`
    return user && user.length > 0
  } catch (error) {
    console.error("Auth verification error:", error)
    return false
  }
}

export async function authenticateUser(email, password) {
  try {
    const users = await sql`SELECT id, email, password_hash FROM users WHERE email = ${email} LIMIT 1`

    if (!users || users.length === 0) {
      return null
    }

    const user = users[0]
    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      return null
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" })

    return { token, user: { id: user.id, email: user.email } }
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}
