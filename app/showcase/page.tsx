"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/AuthContext";
import { ShowcaseItem, listenShowcase, createShowcaseItem } from "@/lib/showcase";

export default function ShowcasePage() {
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [techStack, setTechStack] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribe = listenShowcase((items) => {
      setItems(items);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    setError(null);
    setSubmitting(true);
    try {
      await createShowcaseItem({
        title,
        techStack,
        demoUrl,
        repoUrl,
        authorName: user.displayName || user.email?.split("@")[0] || "Member",
        authorId: user.uid,
      });
      setTitle("");
      setTechStack("");
      setDemoUrl("");
      setRepoUrl("");
      setShowForm(false);
      setHint("Karya berhasil ditambahkan — terima kasih sudah berbagi!");
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan karya.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end gap-4 mb-12">
          <div>
            <h1 className="text-5xl font-black uppercase mb-4">Showcase BukuWare</h1>
            <p className="text-lg font-bold bg-[#fff3e1] inline-block px-3 py-1 border-4 border-[#233766] text-[#233766]">
              Galeri karya praktik dan demo teknologi yang diunggah oleh anggota komunitas.
            </p>
          </div>
          {user ? (
            <button
              type="button"
              onClick={() => setShowForm((state) => !state)}
              className="bg-[#ffb703] text-[#233766] px-6 py-3 border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] uppercase font-black"
            >
              {showForm ? "Tutup Form" : "Tambah Karya"}
            </button>
          ) : (
            <Link
              href="/login"
              className="bg-[#233766] text-[#fff3e1] px-6 py-3 border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] uppercase font-black"
            >
              Login untuk Unggah
            </Link>
          )}
        </div>

        {hint && (
          <div className="mb-8 p-4 bg-[#fff3e1] border-4 border-[#233766] text-[#96582e] font-bold">
            {hint}
          </div>
        )}

        {showForm && user && (
          <section className="mb-12 bg-[#fff3e1] border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] p-8">
            <h2 className="text-3xl font-black uppercase mb-6">Form Unggah Karya Baru</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#233766] mb-2">Judul Karya</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white border-4 border-[#233766] p-3"
                  required
                  placeholder="Nama proyek / demo"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#233766] mb-2">Tech Stack</label>
                <input
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  className="w-full bg-white border-4 border-[#233766] p-3"
                  required
                  placeholder="React, Next.js, Firebase, Tailwind..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#233766] mb-2">URL Demo</label>
                <input
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  className="w-full bg-white border-4 border-[#233766] p-3"
                  required
                  placeholder="https://contoh-demo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#233766] mb-2">URL Repo</label>
                <input
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full bg-white border-4 border-[#233766] p-3"
                  required
                  placeholder="https://github.com/username/project"
                />
              </div>
              {error && <div className="text-red-600 font-bold">{error}</div>}
              <div className="flex gap-4 flex-wrap">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#233766] text-[#fff3e1] px-6 py-3 border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] uppercase font-black"
                >
                  {submitting ? "Mengunggah..." : "Unggah Karya"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-[#fff3e1] text-[#233766] px-6 py-3 border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] uppercase font-black"
                >
                  Batal
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="grid grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-3 p-8 bg-white border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] text-center uppercase font-black">
              Memuat galeri...
            </div>
          ) : items.length === 0 ? (
            <div className="col-span-3 p-8 bg-white border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] text-center uppercase font-black">
              Belum ada karya. Ajak temanmu untuk berbagi proyek.
            </div>
          ) : (
            items.map((item) => (
              <Link
                key={item.id}
                href={`/showcase/${item.id}`}
                className="block bg-[#fff3e1] border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] p-6 hover:bg-[#ffb703] transition-colors"
              >
                <h2 className="text-2xl font-black uppercase mb-3">{item.title}</h2>
                <p className="text-sm text-[#233766] font-bold mb-4">{item.techStack}</p>
                <div className="flex flex-col gap-2 text-sm text-[#233766]">
                  <span>Demo: {item.demoUrl}</span>
                  <span>Repo: {item.repoUrl}</span>
                </div>
                <div className="mt-6 text-xs uppercase text-[#96582e] font-black flex justify-between">
                  <span>{item.authorName}</span>
                  <span>{item.createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</span>
                </div>
              </Link>
            ))
          )}
        </section>
      </main>
    </>
  );
}
