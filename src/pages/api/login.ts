import { compare } from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";
import { sign } from "jsonwebtoken";
import { MongoClient } from 'mongodb';
import { log } from "console";

interface User {
  email: string;
  username:string
  password: string;
}

interface LoginResponse {
  success: boolean;
  data?: {
    accessToken: string;
  };
  error?: string;
}

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET not found in environment variables!");
}

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default async function login(req: NextApiRequest, res: NextApiResponse<LoginResponse>) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    await client.connect();
    const db = client.db("myDatabase");
    const usersCollection = db.collection<User>("users");

    const mail_user = await usersCollection.findOne({ email: req.body.email });
    const user = await usersCollection.findOne({ name: req.body.username });
    console.log("user-->", user);
    

    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const isPasswordValid = await compare(req.body.password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const accessToken = sign({ username: user.username }, JWT_SECRET);

    res.setHeader("Set-Cookie", `accessToken=${accessToken}; HttpOnly; Path=/;`);
    return res.redirect("/chat");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  } finally {
    await client.close()
  }
}
