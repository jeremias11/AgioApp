import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import ReportsPage from "@/components/reports-page"
import { verifyAuth } from "@/lib/auth"

export default async function Reports() {
  const cookieStore = cookies()
  const token = cookieStore.get("auth_token")?.value

  const isAuthenticated = await verifyAuth(token)
  if (!isAuthenticated) {
    redirect("/login")
  }

  return <ReportsPage />
}
