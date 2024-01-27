import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === "/login" || path === "/signup"

  const token = request.cookies.get("authorization")?.value || ""
  // Check if token is expired
  const isTokenExpired = isJwtExpired(token)

  if (path === "/") {
    return NextResponse.redirect(new URL("/login", request.nextUrl))
  }

  if (isPublicPath && token && !isTokenExpired) {
    return NextResponse.redirect(new URL("/profile", request.nextUrl))
  }

  if (!isPublicPath && (!token || isTokenExpired)) {
    return NextResponse.redirect(new URL("/login", request.nextUrl))
  }
}

export const config = {
  matcher: ["/", "/profile", "/login", "/signup"],
}

// Function to check if JWT is expired
function isJwtExpired(token: string): boolean {
  try {
    const decodedToken = jwt.decode(token)
    if (!decodedToken || typeof decodedToken === "string") {
      return true // Token is not a valid JWT
    }

    //@ts-ignore-next-error
    const expirationTimestamp = decodedToken?.exp * 1000
    const currentTimestamp = Date.now()

    return expirationTimestamp < currentTimestamp
  } catch (error) {
    console.error("Error decoding token:", error)
    return true // Assume token is expired in case of decoding error
  }
}
