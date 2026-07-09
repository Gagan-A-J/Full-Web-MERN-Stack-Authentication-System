import React, { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const sendReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/forgot-password", { email });
      localStorage.setItem("resetToken", res.data.token);
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || "Error sending reset link");
    }
  };

  return (
    <div>
      <form className="max-w-[400px] mx-auto mt-[90px] bg-white p-8 rounded-[10px] shadow-lg" onSubmit={sendReset}>
        <h1 className="text-2xl font-bold mb-3 mt-10">Forgot Password</h1>
        <input
          type="email"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button>Send Reset Link</button>
        <p>{msg}</p>
      </form>
    </div>
  );
}
