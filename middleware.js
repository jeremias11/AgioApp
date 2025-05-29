import { NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"

export async function middleware(request) {
  // Verificar se a rota precisa de autenticação
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    const isAuthenticated = await verifyAuth(token)
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
