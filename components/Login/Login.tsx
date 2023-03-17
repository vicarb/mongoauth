import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault();

  try {
    // const response = await axios.post("/api/login", { email, password });
    const response = await axios.post("/api/login", { username, password });

    if (response.status === 200) {
      localStorage.setItem("token", response.data.token);
      router.push("/chat");
    }
  } catch (error) {
    console.error(error);
  }
};


  return (
    <form className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg" onSubmit={handleSubmit}>
    <h2 className="text-3xl font-bold mb-8 text-center">Login</h2>
  
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-2" htmlFor="username">Username</label>
      <input className="form-input mt-1 block w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" type="username" id="username" value={username} onChange={(event) => setUsername(event.target.value)} />
    </div>
  
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-2" htmlFor="password">Password</label>
      <input className="form-input mt-1 block w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} />
    </div>
  
    <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md shadow-md transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110">
      Login
    </button>
  </form>
  

    // <form onSubmit={handleSubmit}>
    //   <div>
    //     <label htmlFor="email">Email</label>
    //     <input
    //       type="email"
    //       id="email"
    //       value={email}
    //       onChange={(event) => setEmail(event.target.value)}
    //     />
    //   </div>
    //   <div>
    //     <label htmlFor="username">Username</label>
    //     <input
    //       type="username"
    //       id="username"
    //       value={username}
    //       onChange={(event) => setUsername(event.target.value)}
    //     />
    //   </div>
    //   <div>
    //     <label htmlFor="password">Password</label>
    //     <input
    //       type="password"
    //       id="password"
    //       value={password}
    //       onChange={(event) => setPassword(event.target.value)}
    //     />
    //   </div>

    //   <button type="submit">Login</button>
    // </form>
  );
}
