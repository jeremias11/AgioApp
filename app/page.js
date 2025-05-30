import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AgioApp</h1>
          <p className="text-gray-600">Sistema de Gestão de Empréstimos</p>
        </div>

        <div className="space-y-4">
          <Link
            href="/login"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Fazer Login
          </Link>

          <div className="text-center">
            <p className="text-sm text-gray-600">Credenciais demo: admin@agioapp.com / 123456</p>
          </div>
        </div>
      </div>
    </div>
  )
}
