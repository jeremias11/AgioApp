import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { verifyAuth } from "@/lib/auth"

export default async function Layout({ children }) {
  const cookieStore = cookies()
  const token = cookieStore.get("auth_token")?.value

  const isAuthenticated = await verifyAuth(token)
  if (!isAuthenticated) {
    redirect("/login")
  }

  return <DashboardLayout>{children}</DashboardLayout>
}
