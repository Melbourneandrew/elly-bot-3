import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const submitLogin = async () => {
    if (username === "" || password === "") {
      alert("Please enter a username and password");
      return;
    }
    console.log("submitting login...");
    const loginRes = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (loginRes.status == 200) {
      console.log("login successful");
      navigate("/admin");
    } else {
      alert("Login failed");
    }
  };
  return (
    <div className="w-screen h-screen flex flex-col justify-center align-center pl-5">
      <h1 className="text-4xl font-bold">Elly Admin Login</h1>

      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text font-bold">Username</span>
        </div>
        <input
          type="text"
          placeholder="Enter username"
          className="input input-bordered w-full max-w-xs"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text font-bold">Password</span>
        </div>
        <input
          type="password"
          placeholder="Enter password"
          className="input input-bordered w-full max-w-xs"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button
        className="btn btn-primary w-[70px] mt-4"
        onClick={submitLogin}
      >
        Login
      </button>
    </div>
  );
}
