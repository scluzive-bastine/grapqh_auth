import { gql } from "graphql-request"

export const GET_USER = gql`
  query GetUser {
    user {
      id
      username
      email
      token
      isLocked
    }
  }
`

export const LOGOUT_USER = gql`
  query LogoutUser {
    logoutUser {
      code
      success
      message
    }
  }
`
