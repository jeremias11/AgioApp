import type React from "react"
import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { Sidebar } from "@/components/layout/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { LoanProvider } from "@/contexts/loan-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LoanManager - Gestão de Empréstimos",
  description: "Sistema de gestão de empréstimos privados",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <LoanProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1 md:ml-64">
                <div className="container mx-auto p-6">{children}</div>
              </main>
            </div>
          </LoanProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
