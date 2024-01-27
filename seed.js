const mongoose = require("mongoose")
const { hash, genSalt } = require("bcryptjs")
require("dotenv").config()

const uri = process.env.MONGO_URI

if (!uri) {
  throw new Error('Invalid environment variable: "MONGO_URI"')
}

const options = {}

const connectDb = async () => {
  await mongoose.connect(`${uri}graphql_auth`, options)
  console.log("Connected to MongoDB")
}

const User = mongoose.model("User", {
  email: String,
  username: String,
  password: String,
})

async function seedDatabase() {
  await connectDb()

  const salt = await genSalt(10)
  const hashedPassword = await hash("password", salt)
  const username = "test"
  const email = "test@example.com"
  const password = hashedPassword

  // Check if the user already exists
  const existingUser = await User.findOne({ email })

  if (existingUser) {
    console.log(`User '${username}' already exists. Skipping seeding.`)
    mongoose.connection.close()
    return
  }

  // Insert the user details
  await User.create({
    email,
    username,
    password,
  })

  console.log("User seeded successfully")
  mongoose.connection.close()
}

seedDatabase().catch((error) => {
  console.error(error)
  mongoose.connection.close()
})
