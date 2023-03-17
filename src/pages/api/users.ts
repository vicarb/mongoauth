import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcryptjs";

interface User {
  name: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  success: boolean;
  data?: {
    insertedCount: number;
  };
  error?: string;
}

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export default async function users(req: NextApiRequest, res: NextApiResponse<RegisterResponse>) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    await client.connect();
    const db = client.db("myDatabase");
    const collection = db.collection<User>("users");
    const existingUser = await collection.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).json({ success: false, error: "User with that email already exists" });
    }

    const hashedPassword = await hash(req.body.password, 10);
    const result = await collection.insertOne({ ...req.body, password: hashedPassword });

    return res.status(200).json({ success: true, data: { insertedCount: result.insertedCount } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  } finally {
    await client.close();
  }
}
