import { log } from "console";
import { MongoClient, Db } from "mongodb";

let cachedDb: Db = null;

export default async function connectToDatabase(uri: string) {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db();
  console.log("db",db);
  

  cachedDb = db;

  return db;
}
