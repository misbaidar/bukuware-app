import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  QuerySnapshot,
  DocumentData,
  updateDoc,
  deleteDoc,
  increment,
} from "firebase/firestore";
import { db } from "./firebase";

export type ForumTopic = {
  id: string;
  title: string;
  category: string;
  description: string;
  authorName: string;
  authorId: string;
  createdAt: Date;
  lastReplyAuthorName?: string;
  lastReplyAt?: Date; // <-- Properti Baru: Waktu terakhir
  replyCount?: number; // <-- Properti Baru: Jumlah balasan
};

export type ForumReply = {
  id: string;
  content: string;
  authorName: string;
  authorId: string;
  createdAt: Date;
};

const forumTopicsRef = collection(db, "forumTopics");
const forumTopicsQuery = query(forumTopicsRef, orderBy("createdAt", "desc"));

export const listenTopics = (callback: (topics: ForumTopic[]) => void) => {
  return onSnapshot(forumTopicsQuery, (snapshot: QuerySnapshot<DocumentData>) => {
    const topics = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "Topik tanpa judul",
        category: data.category || "Umum",
        description: data.description || "Tidak ada deskripsi.",
        authorName: data.authorName || "Anonim",
        authorId: data.authorId || "",
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        lastReplyAuthorName: data.lastReplyAuthorName,
        lastReplyAt: data.lastReplyAt?.toDate ? data.lastReplyAt.toDate() : undefined,
        replyCount: data.replyCount || 0,
      } as ForumTopic;
    });
    callback(topics);
  });
};

export const createTopic = async (topic: Omit<ForumTopic, "id" | "createdAt">) => {
  await addDoc(forumTopicsRef, {
    ...topic,
    createdAt: serverTimestamp(),
  });
};

export const listenTopic = (topicId: string, callback: (topic: ForumTopic | null) => void) => {
  const topicDoc = doc(db, "forumTopics", topicId);
  return onSnapshot(topicDoc, (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }
    const data = snapshot.data();
    callback({
      id: snapshot.id,
      title: data.title || "Topik tanpa judul",
      category: data.category || "Umum",
      description: data.description || "Tidak ada deskripsi.",
      authorName: data.authorName || "Anonim",
      authorId: data.authorId || "",
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
    });
  });
};

export const getTopic = async (topicId: string) => {
  const topicDoc = doc(db, "forumTopics", topicId);
  const snapshot = await getDoc(topicDoc);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();
  return {
    id: snapshot.id,
    title: data.title || "Topik tanpa judul",
    category: data.category || "Umum",
    description: data.description || "Tidak ada deskripsi.",
    authorName: data.authorName || "Anonim",
    authorId: data.authorId || "",
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
  } as ForumTopic;
};

export const listenReplies = (topicId: string, callback: (replies: ForumReply[]) => void) => {
  const replyCollection = collection(db, "forumTopics", topicId, "replies");
  const replyQuery = query(replyCollection, orderBy("createdAt", "asc"));
  return onSnapshot(replyQuery, (snapshot: QuerySnapshot<DocumentData>) => {
    const replies = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        content: data.content || "",
        authorName: data.authorName || "Anonim",
        authorId: data.authorId || "",
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
      } as ForumReply;
    });
    callback(replies);
  });
};

export const createReply = async (topicId: string, data: Omit<ForumReply, 'id' | 'createdAt'>) => {
  const repliesRef = collection(db, `forumTopics/${topicId}/replies`);
  await addDoc(repliesRef, {
    ...data,
    createdAt: new Date(),
  });

  const topicRef = doc(db, "forumTopics", topicId);
  await updateDoc(topicRef, {
    lastReplyAuthorName: data.authorName,
    lastReplyAt: new Date(), // <-- Simpan waktu saat ini
    replyCount: increment(1), // <-- Otomatis +1 di database
    updatedAt: new Date(),
  });
};

// Fungsi Mengedit Topik Utama
export const updateTopic = async (topicId: string, data: Partial<ForumTopic>) => {
  const docRef = doc(db, "forumTopics", topicId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date(),
  });
};

// Fungsi Menghapus Topik Utama
export const deleteTopic = async (topicId: string) => {
  const docRef = doc(db, "forumTopics", topicId);
  await deleteDoc(docRef);
  // Catatan: Dalam arsitektur NoSQL, menghapus dokumen tidak otomatis menghapus sub-koleksi.
  // Idealnya sub-koleksi "replies" dihapus via Cloud Functions, 
  // atau kita biarkan saja sebagai yatim-piatu (orphan data) sementara ini.
};

// Fungsi Mengedit Balasan (Reply)
export const updateReply = async (topicId: string, replyId: string, content: string) => {
  const docRef = doc(db, `forumTopics/${topicId}/replies`, replyId);
  await updateDoc(docRef, {
    content,
    updatedAt: new Date(),
  });
};

// Fungsi Menghapus Balasan (Reply)
export const deleteReply = async (topicId: string, replyId: string) => {
  const docRef = doc(db, `forumTopics/${topicId}/replies`, replyId);
  await deleteDoc(docRef);
};