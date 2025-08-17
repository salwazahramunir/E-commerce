import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY ?? "";

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseKey);

export const getImageURL = (
  name: string,
  path: "brands" | "products" = "brands"
) => {
  const { data } = supabase.storage
    .from("bwa-ecommerce")
    .getPublicUrl(`public/${path}/${name}`);

  return data.publicUrl;
};

export const uploadFile = async (
  file: File,
  path: "brands" | "products" = "brands"
) => {
  const fileType = file.type.split("/")[1];
  const fileName = `${path}-${Date.now()}.${fileType}`;

  await supabase.storage
    .from("bwa-ecommerce")
    .upload(`public/${path}/${fileName}`, file, {
      cacheControl: "3600",
      upsert: false,
    });

  return fileName;
};

export const deleteFile = async (fileName: string, path: string) => {
  await supabase.storage
    .from("bwa-ecommerce")
    .remove([`public/${path}/${fileName}`]);
};
