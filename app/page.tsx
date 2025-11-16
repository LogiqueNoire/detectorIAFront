"use client"
import Image from "next/image";
import { useRef, useState } from "react";
import { enviarArchivo } from "@/app/servicio"

export default function Home() {

  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState<boolean | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (input: React.ChangeEvent<HTMLInputElement> | File) => {
    const file = input instanceof File ? input : input.target.files?.[0]
    if (!file) return
    console.log("Hola antes")
    const result = await enviarArchivo(file)
    console.log("Resultado de enviarArchivo:", result)
  }

  return (
    <div className="flex flex-col gap-5 min-h-screen items-center justify-center bg-linear-to-tr/hsl from-sky-950 from-20% to-cyan-950 to-80%  font-sans px-5">
      <h1 className="momo-trust-display-regular text-4xl text-amber-400 text-center">Detector de IA en textos académicos</h1>
      <div className="border-cyan-400 border-4 border-dotted p-7 rounded-xl"
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          const file = e.dataTransfer.files?.[0]
          if (file.type === "application/pdf" || file.name.endsWith(".txt")) {
            handleUpload(file) // <-- ahora funciona sin convertir el evento
          }
        }}>
        <p className="momo-trust-display-regular text-cyan-400 text-xl text-center mb-5">Sube ingresa o arrasta un archivo txt o pdf</p>
        <div className="flex justify-center">
          <button className="momo-trust-display-regular text-center text-white text-base border-2 border-white p-2 rounded-lg"
            onClick={() => fileInputRef.current?.click()}>Subir archivo</button>
        </div>
        <input type="file" accept=".txt,.pdf" className="hidden" ref={fileInputRef} onChange={handleUpload}></input>
      </div>
    </div>
  );
}
