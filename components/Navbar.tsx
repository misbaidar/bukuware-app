"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <nav className="fixed top-0 w-full bg-[#fff3e1] border-b-4 border-[#233766] z-50 px-6 py-4 flex justify-between items-center min-w-[1024px]">
      <Link href="/" className="text-3xl font-black tracking-tighter uppercase flex items-center gap-2">
        <span className="bg-[#233766] text-[#fff3e1] px-2 py-1 border-4 border-[#233766] shadow-[4px_4px_0px_0px_#233766]">BW</span>
        BukuWare
      </Link>

      <div className="flex gap-6 font-bold text-lg">
        <Link href="/" className="hover:bg-[#ffb703] px-2 transition-colors border-2 border-transparent hover:border-[#233766]">
          Beranda
        </Link>
        <Link href="/jadwal" className="hover:bg-[#ffb703] px-2 transition-colors border-2 border-transparent hover:border-[#233766]">
          Jadwal
        </Link>
        <Link href="/forum" className="hover:bg-[#ffb703] px-2 transition-colors border-2 border-transparent hover:border-[#233766]">
          Forum Diskusi
        </Link>
        <Link href="/showcase" className="hover:bg-[#ffb703] px-2 transition-colors border-2 border-transparent hover:border-[#233766]">
          Showcase
        </Link>
        <Link href="/pustaka" className="hover:bg-[#ffb703] px-2 transition-colors border-2 border-transparent hover:border-[#233766]">
          Pustaka
        </Link>
        {user?.role === "admin" ? (
          <Link href="/admin" className="hover:bg-[#ffb703] px-2 transition-colors border-2 border-transparent hover:border-[#233766]">
            Admin
          </Link>
        ) : null}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="bg-[#96582e] text-[#fff3e1] px-4 py-2 border-4 border-[#233766] shadow-[4px_4px_0px_0px_#233766] uppercase font-bold">
              {user.displayName || user.email?.split("@")[0] || "Member"}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="bg-[#233766] text-[#fff3e1] px-6 py-2 border-4 border-[#233766] shadow-[4px_4px_0px_0px_#233766] font-black uppercase"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="bg-[#233766] text-[#fff3e1] px-6 py-2 border-4 border-[#233766] shadow-[4px_4px_0px_0px_#233766] font-black uppercase"
          >
            Masuk
          </Link>
        )}
      </div>
    </nav>
  );
}
