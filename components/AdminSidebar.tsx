"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

type AdminTab = "dashboard" | "jadwal" | "pustaka";

type AdminSidebarProps = {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
};

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const menuItems: { label: string; value: AdminTab; icon: string }[] = [
    { label: "Dashboard", value: "dashboard", icon: "📊" },
    { label: "Jadwal", value: "jadwal", icon: "📅" },
    { label: "Pustaka", value: "pustaka", icon: "📚" },
  ];

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-[#233766] text-[#fff3e1] border-r-4 border-[#233766] flex flex-col pt-24 z-40">
      {/* Logo */}
      <div className="px-6 py-6 border-b-4 border-[#fff3e1]">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-[#ffb703] text-[#233766] px-3 py-2 border-2 border-[#ffb703] font-black text-lg">
            BW
          </div>
          <div>
            <p className="font-black text-lg uppercase leading-none">BukuWare</p>
            <p className="text-xs uppercase font-bold text-[#96582e]">Admin</p>
          </div>
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-6 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.value}
            onClick={() => onTabChange(item.value)}
            className={`w-full text-left px-4 py-3 border-4 font-black uppercase text-sm transition-all ${
              activeTab === item.value
                ? "bg-[#ffb703] text-[#233766] border-[#ffb703] shadow-[4px_4px_0px_0px_#fff3e1]"
                : "bg-transparent border-[#fff3e1] hover:bg-[#fff3e1] hover:text-[#233766]"
            }`}
          >
            <span className="inline-block mr-2">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t-4 border-[#fff3e1] p-4 space-y-3">
        <Link
          href="/"
          className="w-full block text-center px-4 py-2 border-4 border-[#fff3e1] font-black uppercase text-sm hover:bg-[#fff3e1] hover:text-[#233766] transition-all"
        >
          Ke Beranda
        </Link>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 border-4 border-[#ff6b6b] bg-[#ff6b6b] text-[#fff3e1] font-black uppercase text-sm hover:bg-[#ff5252] transition-all"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
