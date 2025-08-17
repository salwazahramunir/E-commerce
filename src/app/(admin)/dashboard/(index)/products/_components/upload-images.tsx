import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload } from "lucide-react";
import Image from "next/image";
import { getImageURL } from "@/lib/supabase";

interface UploadImagesProps {
  images?: string[];
}

export default function UploadImages({ images = [] }: UploadImagesProps) {
  const ref = useRef<HTMLInputElement>(null); // ref untuk input

  const thumbnailRef = useRef<HTMLImageElement>(null); // ref untuk gambar besar
  const imageFirstRef = useRef<HTMLImageElement>(null); // ref untuk gambar kecil 1
  const imageSecondRef = useRef<HTMLImageElement>(null); // ref untuk gambar kecil 2

  // state untuk simpan URL gambar
  const [thumbnailSrc, setThumbnailSrc] = useState(
    "/images/image-not-found.jpg"
  );
  const [imageFirstSrc, setImageFirstSrc] = useState(
    "/images/image-not-found.jpg"
  );
  const [imageSecondSrc, setImageSecondSrc] = useState(
    "/images/image-not-found.jpg"
  );

  const openFolder = () => {
    if (ref.current) {
      ref.current.click();
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (
      !thumbnailRef.current ||
      !imageFirstRef.current ||
      !imageSecondRef.current
    ) {
      return;
    }

    // jika input ada files dan panjang files nya lebih dari 3 (upload 3 gambar), maka masukan ke dalam reference
    if (e.target.files && e.target.files?.length >= 3) {
      // thumbnailRef.current.src = URL.createObjectURL(e.target.files[0]);
      // imageFirstRef.current.src = URL.createObjectURL(e.target.files[1]);
      // imageSecondRef.current.src = URL.createObjectURL(e.target.files[2]);

      setThumbnailSrc(URL.createObjectURL(e.target.files[0]));
      setImageFirstSrc(URL.createObjectURL(e.target.files[1]));
      setImageSecondSrc(URL.createObjectURL(e.target.files[2]));
    }
  };

  // jika form mode edit, isi gambar dari supabase
  useEffect(() => {
    if (images.length === 3) {
      setThumbnailSrc(getImageURL(images[0], "products"));
      setImageFirstSrc(getImageURL(images[1], "products"));
      setImageSecondSrc(getImageURL(images[2], "products"));
    }
  }, [images]);

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Product Images</CardTitle>
        <CardDescription className="text-slate-400">
          Lipsum dolor sit amet, consectetur adipiscing elit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <Image
            alt="Product image"
            className="aspect-square w-full rounded-md object-cover"
            height="84"
            src={thumbnailSrc}
            width="84"
            ref={thumbnailRef}
          />

          <div className="grid grid-cols-3 gap-2">
            <button>
              <Image
                alt="Product image"
                className="aspect-square w-full rounded-md object-cover"
                height="84"
                src={imageFirstSrc}
                width="84"
                ref={imageFirstRef}
              />
            </button>
            <button>
              <Image
                alt="Product image"
                className="aspect-square w-full rounded-md object-cover"
                height="84"
                src={imageSecondSrc}
                width="84"
                ref={imageSecondRef}
              />
            </button>
            <button
              type="button"
              onClick={openFolder}
              className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed"
            >
              <Upload className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Upload</span>
            </button>
            <input
              ref={ref}
              onChange={onChange}
              type="file"
              name="images"
              className="hidden"
              accept="images/*"
              multiple
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
