"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/AuthContext";
import { ForumTopic, listenTopics, createTopic } from "@/lib/forum";

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
              Kumpulkan topik, ajukan pertanyaan, dan jalin diskusi bersama anggota BukuWare.
            </p>
          </div>
          {user ? (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="bg-[#ffb703] text-[#233766] font-black px-6 py-3 border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] uppercase"
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
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
            <div className="w-[900px] bg-[#fff3e1] border-4 border-[#233766] shadow-[12px_12px_0px_0px_#233766] p-8 relative">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 bg-[#233766] text-[#fff3e1] px-4 py-2 border-4 border-[#233766] font-black uppercase"
              >
                Tutup
              </button>
              <h2 className="text-4xl font-black uppercase mb-4">Buat Topik Diskusi</h2>
              <form onSubmit={handleCreateTopic} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#233766] mb-2">Judul Topik</label>
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="w-full border-4 border-[#233766] p-3 bg-white"
                    required
                    placeholder="Contoh: Cara optimasi Firebase untuk aplikasi Next.js"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#233766] mb-2">Kategori</label>
                  <input
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="w-full border-4 border-[#233766] p-3 bg-white"
                    required
                    placeholder="Umum / React / Firebase / dll."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#233766] mb-2">Deskripsi</label>
                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    className="w-full h-40 border-4 border-[#233766] p-3 bg-white"
                    required
                    placeholder="Jelaskan latar belakang pertanyaan atau topik diskusi..."
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
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-[#fff3e1] text-[#233766] px-6 py-3 border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] uppercase font-black"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-3 p-6 bg-white border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] text-center uppercase font-black">
              Memuat topik...
            </div>
          ) : topics.length === 0 ? (
            <div className="col-span-3 p-6 bg-white border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] text-center uppercase font-black">
              Belum ada topik, jadilah yang pertama membuka diskusi.
            </div>
          ) : (
            topics.map((topic) => (
              <Link
                key={topic.id}
                href={`/forum/${topic.id}`}
                className="bg-white border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] p-6 flex flex-col gap-4 hover:bg-[#fff3e1] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="bg-[#233766] text-[#fff3e1] uppercase text-xs font-black px-2 py-1 border-4 border-[#233766]">{topic.category}</span>
                  <span className="text-xs text-[#96582e] uppercase font-bold">{topic.authorName}</span>
                </div>
                <h2 className="text-2xl font-black uppercase leading-tight">{topic.title}</h2>
                <p className="text-sm font-medium text-[#233766] overflow-hidden" style={{ display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical" }}>
                  {topic.description}
                </p>
                <div className="mt-auto flex justify-between items-center pt-4 border-t-2 border-[#233766] border-dashed text-xs uppercase text-[#96582e] font-bold">
                  <span>{topic.createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
    </>
  );
}
