"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/AuthContext";
import { listenTopic, listenReplies, createReply, ForumTopic, ForumReply } from "@/lib/forum";

export default function ForumTopicPage({ params }: { params: { id: string } }) {
  const topicId = params.id;
  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribeTopic = listenTopic(topicId, (item) => {
      setTopic(item);
      setLoading(false);
    });
    const unsubscribeReplies = listenReplies(topicId, (items) => setReplies(items));
    return () => {
      unsubscribeTopic();
      unsubscribeReplies();
    };
  }, [topicId]);

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Silakan login untuk menambahkan balasan.");
      return;
    }
    if (!comment.trim()) return;
    setError(null);
    setSubmitting(true);

    try {
      await createReply(topicId, {
        content: comment.trim(),
        authorName: user.displayName || user.email?.split("@")[0] || "Member BukuWare",
        authorId: user.uid,
      });
      setComment("");
    } catch (err: any) {
      setError(err.message || "Gagal menambahkan balasan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="mb-10 flex items-center justify-between gap-4">
          <div>
            <Link href="/forum" className="text-sm uppercase font-bold tracking-wide text-[#233766] border-4 border-[#233766] px-4 py-2 bg-[#fff3e1] shadow-[8px_8px_0px_0px_#233766]">
              &larr; Kembali ke Board Diskusi
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="p-12 bg-white border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] text-center uppercase font-black">Memuat topik...</div>
        ) : topic ? (
          <div className="space-y-8">
            <section className="bg-[#fff3e1] border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] p-8">
              <div className="mb-4 flex flex-wrap gap-3">
                <span className="bg-[#233766] text-[#fff3e1] px-3 py-1 uppercase text-xs font-black border-4 border-[#233766]">{topic.category}</span>
                <span className="bg-[#ffb703] text-[#233766] px-3 py-1 uppercase text-xs font-black border-4 border-[#233766]">{topic.authorName}</span>
              </div>
              <h2 className="text-4xl font-black uppercase mb-6">{topic.title}</h2>
              <p className="text-lg leading-relaxed text-[#233766] whitespace-pre-line">{topic.description}</p>
              <div className="mt-8 text-sm uppercase text-[#96582e] font-bold border-t-2 border-[#233766] pt-4">Dibuat pada: {topic.createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</div>
            </section>

            <section className="bg-white border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] p-8">
              <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
                <h3 className="text-3xl font-black uppercase">Balasan</h3>
                <span className="text-sm uppercase text-[#96582e] font-bold">{replies.length} komentar</span>
              </div>
              {replies.length === 0 ? (
                <div className="p-8 bg-[#fff3e1] border-4 border-[#233766] text-center uppercase font-bold">Belum ada balasan, jadilah yang pertama memberi tanggapan.</div>
              ) : (
                <div className="space-y-4">
                  {replies.map((reply) => (
                    <div key={reply.id} className="bg-[#fff3e1] border-4 border-[#233766] p-6">
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <span className="font-black uppercase text-[#233766]">{reply.authorName}</span>
                        <span className="text-xs uppercase text-[#96582e] font-bold">{reply.createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</span>
                      </div>
                      <p className="text-sm leading-relaxed text-[#233766]">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-[#fff3e1] border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] p-8">
              <h3 className="text-3xl font-black uppercase mb-4">Tambahkan Balasan</h3>
              <form onSubmit={handlePostReply} className="space-y-4">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full border-4 border-[#233766] bg-white p-4 h-40"
                  placeholder={user ? "Tulis balasan Anda di sini..." : "Login terlebih dahulu untuk ikut berdiskusi..."}
                  disabled={!user}
                  required
                />
                {error && <div className="text-red-600 font-bold">{error}</div>}
                <div className="flex gap-4 flex-wrap">
                  <button
                    type="submit"
                    disabled={!user || submitting}
                    className="bg-[#233766] text-[#fff3e1] px-6 py-3 border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] uppercase font-black"
                  >
                    {submitting ? "Mengirim..." : "Kirim Balasan"}
                  </button>
                  {!user && (
                    <Link href="/login" className="bg-[#ffb703] text-[#233766] px-6 py-3 border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] uppercase font-black">
                      Login dulu
                    </Link>
                  )}
                </div>
              </form>
            </section>
          </div>
        ) : (
          <div className="p-12 bg-white border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] text-center uppercase font-black">
            Topik tidak ditemukan.
          </div>
        )}
      </main>
    </>
  );
}
