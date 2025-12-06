export async function uploadToSupabase(file: File) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(
        "https://nxiwkagsqlrisrnhzela.supabase.co/functions/v1/storage-upload",
    {
      method: "POST",
      body: form,
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");

  return data.publicURL;
}
