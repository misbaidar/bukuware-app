import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";

export type ShowcaseItem = {
  id: string;
  title: string;
  techStack: string;
  demoUrl: string;
  repoUrl: string;
  authorName: string;
  authorId: string;
  description: string;
  thumbnailUrl: string;
  createdAt: Date;
};

const showcaseCollection = collection(db, "showcase");
const showcaseQuery = query(showcaseCollection, orderBy("createdAt", "desc"));

export const listenShowcase = (callback: (items: ShowcaseItem[]) => void) => {
  return onSnapshot(showcaseQuery, (snapshot: QuerySnapshot<DocumentData>) => {
    const items = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "Karya tanpa judul",
        techStack: data.techStack || "Tidak disebutkan",
        demoUrl: data.demoUrl || "#",
        repoUrl: data.repoUrl || "#",
        authorName: data.authorName || "Anonim",
        authorId: data.authorId || "",
        description: data.description || "",
        thumbnailUrl: data.thumbnailUrl || "",
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
      } as ShowcaseItem;
    });
    callback(items);
  });
};

export const createShowcaseItem = async (item: Omit<ShowcaseItem, "id" | "createdAt">) => {
  await addDoc(showcaseCollection, {
    ...item,
    createdAt: serverTimestamp(),
  });
};

export const getShowcaseItem = async (id: string) => {
  const docRef = doc(db, "showcase", id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  return {
    id: snapshot.id,
    title: data.title || "Karya tanpa judul",
    techStack: data.techStack || "Tidak disebutkan",
    demoUrl: data.demoUrl || "#",
    repoUrl: data.repoUrl || "#",
    authorName: data.authorName || "Anonim",
    authorId: data.authorId || "",
    description: data.description || "",
    thumbnailUrl: data.thumbnailUrl || "",
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
  } as ShowcaseItem;
};

export const updateShowcaseItem = async (id: string, data: Partial<Omit<ShowcaseItem, "id" | "createdAt" | "authorId">>) => {
  const docRef = doc(db, "showcase", id);
  await updateDoc(docRef, data);
};

export const deleteShowcaseItem = async (id: string) => {
  const docRef = doc(db, "showcase", id);
  await deleteDoc(docRef);
};
