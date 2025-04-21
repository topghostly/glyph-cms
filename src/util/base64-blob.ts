export function base64ToBlob(base64: string) {
  const [metadata, data] = base64.split(",");
  const mimeMatch = metadata.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const byteString = atob(data);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mime });
}

// function base64ToBlob(base64: string): Blob {
//     const [meta, data] = base64.split(",");
//     const mime = meta.match(/:(.*?);/)?.[1] || "image/jpeg";
//     const byteString = atob(data);
//     const ab = new ArrayBuffer(byteString.length);
//     const ia = new Uint8Array(ab);

//     for (let i = 0; i < byteString.length; i++) {
//       ia[i] = byteString.charCodeAt(i);
//     }

//     return new Blob([ab], { type: mime });
//   }
