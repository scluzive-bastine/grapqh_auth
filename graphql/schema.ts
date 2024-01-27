export const typeDefs = `#graphql
type User {
  id: ID!
  username: String!
  email: String!
  password: String!
  token: String
  failedLoginAttempts: Int
  isLocked: Boolean
}

type AuthResponse {
    user: User
    code: Int!
    success: Boolean!
    message: String!
}

type Query {
  user: User
  refreshAccessToken: RefreshAccessTokenResponse
  logoutUser: LogoutUserResponse
}

type Mutation {
  register(username: String!, email: String!, password: String!): AuthResponse
  login(email: String!, password: String!): AuthResponse
  logoutUser: LogoutUserResponse
}

type RefreshAccessTokenResponse {
  access_token: String!
}

type LogoutUserResponse {
  code: Int!
  success: Boolean!
  message: String!
}

`
