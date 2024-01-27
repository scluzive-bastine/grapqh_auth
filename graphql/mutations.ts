import { gql } from "graphql-request"

export const REGISTER_USER = gql`
  mutation RegisterUser($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      code
      success
      message
      user {
        id
        username
        email
        password
        token
        failedLoginAttempts
        isLocked
      }
    }
  }
`

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      code
      success
      message
      user {
        id
        username
        email
        password
        token
        failedLoginAttempts
        isLocked
      }
    }
  }
`
