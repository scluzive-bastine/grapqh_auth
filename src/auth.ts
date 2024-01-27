import { JwtPayload, verify } from "jsonwebtoken"
import clientPromise from "@/lib/mongodb/mongodb"

const APP_SECRET = process.env.JWT_SECRET!

export async function authenticateUser(request: Request) {
  const header = request.headers.get("authorization")

  if (header !== null) {
    const token = header.split(" ")[1]
    const tokenPayload = verify(token, APP_SECRET) as JwtPayload
    const email = tokenPayload.email

    const client = await clientPromise
    const user = await client.db("graphql_auth").collection("users").findOne({ email })
    return user
  }

  return null
}
