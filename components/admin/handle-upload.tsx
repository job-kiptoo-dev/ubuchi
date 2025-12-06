// "use client";

// import { useState } from "react";
// import { uploadToSupabase } from "@/lib/upload";
// import { createClient } from "@/lib/supabase/client";

// export default function ImageUpload() {
//   const [imageURL, setImageURL] = useState("");
//   const [uploading, setUploading] = useState(false);

//   async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
//      const supabase = createClient();
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setUploading(true);

//     try {
//       const url = await uploadToSupabase(file);
//       setImageURL(url);

//       console.log("Uploaded image URL:", url);

//       // Save the URL into Supabase DB:
//       await supabase.from("products").insert({ image_url: url })

//     } catch (err) {
//       console.error(err);
//     }

//     setUploading(false);
//   }

//   return (
//     <div className="space-y-4">
//       <input type="file" onChange={handleUpload} />

//       {uploading && <p>Uploading...</p>}

//       {imageURL && (
//         <img src={imageURL} alt="Uploaded" className="w-40 rounded-lg" />
//       )}
//     </div>
//   );
// }
