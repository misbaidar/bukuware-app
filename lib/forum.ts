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

export const createReply = async (topicId: string, reply: Omit<ForumReply, "id" | "createdAt">) => {
  const replyCollection = collection(db, "forumTopics", topicId, "replies");
  await addDoc(replyCollection, {
    ...reply,
    createdAt: serverTimestamp(),
  });
};
