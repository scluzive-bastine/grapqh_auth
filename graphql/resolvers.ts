import { hash, compare, genSalt } from "bcryptjs"
import jwt from "jsonwebtoken"

const MAX_LOGIN_ATTEMPTS = 5 // login attempts before account is locked

const createToken = async (email: string) => {
  return await jwt.sign({ email }, process.env.JWT_SECRET!, {
    expiresIn: "1h", // Adjust the expiration time as needed
  })
}

const resolvers = {
  Query: {
    user: async (_: any, __: any, context: any) => {
      if (context.currentUser === null) {
        throw new Error("Unauthenticated!")
      }

      const userWithId = { ...context.currentUser, id: context.currentUser._id.toString() }

      return userWithId
    },
  },
  Mutation: {
    register: async (
      _: any,
      { username, email, password }: { username: string; email: string; password: string },
      context: any
    ) => {
      try {
        // Check if username is unique
        const usernameExists = await context.client
          .db("graphql_auth")
          .collection("users")
          .findOne({ username })
        if (usernameExists) {
          return {
            code: 422,
            success: false,
            message: "Username already exists. Please try anther username",
            user: null,
          }
        }

        // Check if email already exists
        const emailExists = await context.client
          .db("graphql_auth")
          .collection("users")
          .findOne({ email })
        if (emailExists) {
          return {
            code: 422,
            success: false,
            message: "Email already exists. Please try another email",
            user: null,
          }
        }

        // Hash the password before saving to the database
        const salt = await genSalt(10)
        const hashedPassword = await hash(password, salt)
        // Generate JWT token and return it along with the user details
        const token = await createToken(email)

        // Implement your logic to save the user to the database
        const db = await context.client.db("graphql_auth")
        const user = await db.collection("users").insertOne({
          username,
          email,
          password: hashedPassword,
          token,
        })

        return {
          code: 200,
          success: true,
          message: `User registered successfully`,
        }
      } catch (error: any) {
        return {
          code: 500,
          success: false,
          message: "Something Went Wrong",
          user: null,
        }
      }
    },

    login: async (
      _: any,
      { email, password }: { email: string; password: string },
      context: any
    ) => {
      try {
        //  logic to fetch the user by email from the database
        const db = await context.client.db("graphql_auth")
        const user = await db.collection("users").findOne({ email })

        if (!user) {
          //  failed login attempts if the user is not found
          await db.collection("users").updateOne(
            { email },
            {
              $inc: {
                failedLoginAttempts: 1,
              },
            }
          )
          return {
            code: 401,
            success: false,
            message: "Invalid User or Password, Please try again",
            user: null,
          }
        }

        if (user.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
          // Lock the account if failed login attempts exceed the limit
          await db.collection("users").updateOne(
            { email },
            {
              $set: {
                isLocked: true,
              },
            }
          )

          return {
            code: 401,
            success: false,
            message: "Account has been Locked because of too many tries. Please contact admin",
            user: null,
          }
        }

        if (!user.isLocked) {
          // Compare the provided password with the hashed password in the database
          const passwordMatch = await compare(password, user.password)

          if (!passwordMatch) {
            // Increment failed login attempts if the password is incorrect
            await db.collection("users").updateOne(
              { email },
              {
                $inc: {
                  failedLoginAttempts: 1,
                },
              }
            )

            return {
              code: 401,
              success: false,
              message: "Invalid User or Password, Please try again",
              user: null,
            }
          }

          // Reset failed login attempts on successful login
          await db.collection("users").updateOne(
            { email },
            {
              $set: {
                failedLoginAttempts: 0,
              },
            }
          )

          // Generate JWT token and return it along with the user details
          const token = await createToken(user.email)
          return {
            code: 200,
            success: false,
            message: "Login Successful",
            user: { ...user, id: user?._id.toString(), token: token },
          }
        } else {
          return {
            code: 401,
            success: false,
            message: `Account Locked. Please contact admin`,
            user: null,
          }
        }
      } catch (error: any) {
        return {
          code: 500,
          success: false,
          message: "Something Went Wrong",
          user: null,
        }
      }
    },
  },
}

export default resolvers
