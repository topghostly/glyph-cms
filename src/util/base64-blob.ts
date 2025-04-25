export function base64ToBlob(base64: string): Blob | string {
  if (base64.startsWith(`https`)) {
    return base64; // ✅ now type-safe
  }

  const [metadata, data] = base64.split(",");
  const mimeMatch = metadata.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";

  try {
    const byteString = atob(data);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mime });
  } catch (err) {
    console.error("Failed to decode base64:", err);
    throw new Error("Invalid base64 string");
  }
}
