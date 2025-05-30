import "./globals.css"

export const metadata = {
  title: "AgioApp - Sistema de Gestão de Empréstimos",
  description: "Gerencie seus contratos de empréstimo de forma eficiente",
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  )
}
