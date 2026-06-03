"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/AuthContext";
import { ForumTopic, listenTopics, createTopic } from "@/lib/forum";
import BBCodeEditor from "@/components/BBCodeEditor";
import ForumCard from "@/components/ForumCard"; // <-- Import Komponen Card Horizontal

export default function ForumPage() {
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [hint, setHint] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Umum");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribe = listenTopics((items) => {
      setTopics(items);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleCreateTopic = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    if (!description.trim()) {
      setError("Deskripsi tidak boleh kosong.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await createTopic({
        title,
        category,
        description,
        authorName: user.displayName || user.email?.split("@")[0] || "Anonim",
        authorId: user.uid,
      });
      setTitle("");
      setCategory("Umum");
      setDescription("");
      setShowModal(false);
      setHint("Topik baru berhasil dibuat. Terima kasih sudah berkontribusi!");
    } catch (err: any) {
      setError(err.message || "Gagal membuat topik.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12 gap-4">
          <div>
            <h1 className="text-5xl font-black uppercase mb-4">Forum Diskusi</h1>
            <p className="text-lg font-bold bg-[#fff3e1] inline-block px-3 py-1 border-4 border-[#233766] text-[#233766]">
              Ajukan pertanyaan dan jalin diskusi bersama anggota BukuWare.
            </p>
          </div>
          {user ? (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="bg-[#ffb703] text-[#233766] font-black px-6 py-3 border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#233766] transition-all uppercase"
            >
              Buat Topik Baru
            </button>
          ) : (
            <Link
              href="/login"
              className="bg-[#233766] text-[#fff3e1] font-black px-6 py-3 border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] uppercase"
            >
              Login untuk Menulis
            </Link>
          )}
        </div>

        {hint && (
          <div className="mb-8 p-4 bg-[#fff3e1] border-4 border-[#233766] text-[#96582e] font-bold">
            {hint}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
            <div className="w-[900px] max-h-[90vh] overflow-y-auto bg-[#fff3e1] border-4 border-[#233766] shadow-[12px_12px_0px_0px_#233766] p-8 relative">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 bg-[#233766] text-[#fff3e1] px-4 py-2 border-4 border-[#233766] font-black uppercase hover:bg-red-500 transition-colors"
              >
                ✕ Tutup
              </button>
              <h2 className="text-4xl font-black uppercase mb-4">Buat Topik Diskusi</h2>
              <form onSubmit={handleCreateTopic} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#233766] mb-2">Judul Topik</label>
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="w-full border-4 border-[#233766] p-3 bg-white outline-none"
                    required
                    placeholder="Contoh: Cara optimasi Firebase untuk aplikasi Next.js"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#233766] mb-2">Kategori</label>
                  <input
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="w-full border-4 border-[#233766] p-3 bg-white outline-none"
                    required
                    placeholder="Umum / React / Firebase / dll."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#233766] mb-2">Deskripsi</label>
                  <BBCodeEditor
                    value={description}
                    onChange={setDescription}
                    placeholder="Jelaskan latar belakang pertanyaan atau topik diskusi..."
                    disabled={submitting}
                  />
                </div>
                {error && <div className="text-red-600 font-bold">{error}</div>}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#233766] text-[#fff3e1] px-6 py-3 border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] uppercase font-black"
                  >
                    {submitting ? "Menyimpan..." : "Publikasikan Topik"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- DAFTAR TOPIK MENGGUNAKAN FORUM CARD --- */}
        <div className="flex flex-col gap-6">
          {loading ? (
            <div className="p-6 bg-white border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] text-center uppercase font-black">
              Memuat topik...
            </div>
          ) : topics.length === 0 ? (
            <div className="p-6 bg-white border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] text-center uppercase font-black">
              Belum ada topik, jadilah yang pertama membuka diskusi.
            </div>
          ) : (
            topics.map((topic) => (
              <ForumCard key={topic.id} topic={topic} />
            ))
          )}
        </div>
      </main>
    </>
  );
}