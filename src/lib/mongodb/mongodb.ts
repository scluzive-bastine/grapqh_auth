import { MongoClient } from "mongodb"

if (!process.env.MONGO_URI) {
  throw new Error('Invalid environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGO_URI
const options = {}

let client
let clientPromise: Promise<MongoClient>
declare global {
  var _mongoClientPromise: Promise<MongoClient>
}

if (!process.env.MONGO_URI) {
  throw new Error("Please add your Mongo URI to .env.local")
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise

export const connectDb = async () => {
  const db = await clientPromise
  const collection = db.db("graphql_auth").collection("users")
  return collection
}
