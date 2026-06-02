"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthContext";

export default function LoginPage() {
  const [mode, setMode] = useState<"L" | "R">("L");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === "L") {
        await signIn(email, password);
      } else {
        await signUp(email, password, displayName || undefined);
      }
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Gagal autentikasi");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-[900px] border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] bg-white p-8">
        <div className="text-3xl font-black tracking-tighter uppercase flex items-center gap-2">
            <span className="bg-bwText text-bwLight px-2 py-1 border-brutal shadow-brutal-sm">BW</span>
            BukuWare
        </div>        

        <div className="mb-6 flex items-center justify-center gap-4">
          <button
            aria-pressed={mode === "L"}
            onClick={() => setMode("L")}
            className={`p-2 border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] flex items-center justify-center text-lg ${
              mode === "L" ? "bg-[#ffb703]" : "bg-[#fff3e1]"
            }`}
          >
            Login
          </button>
          <button
            aria-pressed={mode === "R"}
            onClick={() => setMode("R")}
            className={`p-2 border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] flex items-center justify-center text-lg ${
              mode === "R" ? "bg-[#ffb703]" : "bg-[#fff3e1]"
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "R" && (
            <div>
              <label className="block text-sm text-[#233766]">Nama tampil</label>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full border-4 border-[#233766] p-2 shadow-none bg-[#fff3e1]"
                placeholder="Nama kamu"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-[#233766]">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-4 border-[#233766] p-2 bg-white"
              placeholder="email@contoh.com"
              type="email"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-[#233766]">Kata sandi</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-4 border-[#233766] p-2 bg-white"
              placeholder="Minimal 6 karakter"
              type="password"
              required
            />
          </div>

          {error && <div className="text-red-600">{error}</div>}

          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="px-4 py-2 border-4 border-[#233766] bg-[#96582e] text-white shadow-[8px_8px_0px_0px_#233766]"
            >
              {mode === "L" ? "Masuk" : "Daftar"}
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail("");
                setPassword("");
                setDisplayName("");
              }}
              className="px-4 py-2 border-4 border-[#233766] bg-[#fff3e1] text-[#233766] shadow-[8px_8px_0px_0px_#233766]"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
