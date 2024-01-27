import { YogaInitialContext } from "graphql-yoga"
import { authenticateUser } from "./auth"
import { MongoClient } from "mongodb"
import clientPromise from "./lib/mongodb/mongodb"

export type GraphQLContext = {
  client: any
  currentUser: any
}

export async function createContext(initialContext: YogaInitialContext): Promise<GraphQLContext> {
  return {
    client: await clientPromise,
    currentUser: await authenticateUser(initialContext.request),
  }
}
