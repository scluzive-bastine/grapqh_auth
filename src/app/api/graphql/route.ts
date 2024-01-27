import { createSchema, createYoga } from "graphql-yoga"
import { typeDefs } from "../../../../graphql/schema"
import resolvers from "../../../../graphql/resolvers"
import { createContext } from "@/context"

const { handleRequest } = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),

  // While using Next.js file convention for routing, we need to configure Yoga to use the correct endpoint
  graphqlEndpoint: "/api/graphql",
  // Pass the MongoDB client to the context
  context: createContext,

  fetchAPI: { Response },
})

export { handleRequest as GET, handleRequest as POST, handleRequest as OPTIONS }
