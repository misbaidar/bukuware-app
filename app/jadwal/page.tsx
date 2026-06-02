"use client";

import Navbar from "@/components/Navbar";
import Jadwal from "@/components/Jadwal";

export default function JadwalPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24">
        <Jadwal />
      </main>
    </>
  );
}
