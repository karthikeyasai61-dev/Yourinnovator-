import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * @param file The file to upload
 * @param folder The folder in Firebase Storage (e.g., 'courses', 'profiles')
 * @returns Promise<string> The download URL
 */
export async function uploadFile(file: File, folder: string): Promise<string> {
  if (!file) throw new Error("No file provided");

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const storageRef = ref(storage, `${folder}/${fileName}`);

  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);

  return downloadURL;
}
