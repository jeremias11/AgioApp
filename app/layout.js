import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AgioApp - Gestão de Empréstimos",
  description: "Sistema profissional para gestão de empréstimos privados",
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
