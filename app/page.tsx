"use client"
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { procesarSVM, procesarRoBERTa, procesarSimpleNet } from "@/app/servicio"
import "./progressBar.css"
import { Bird, Fish, Snail } from "lucide-react";

export default function Home() {
  const [isDragging, setIsDragging] = useState<boolean | null>(null)
  const [progress, setProgress] = useState("")
  const [isLooping, setIsLooping] = useState(false);
  const [isLooping2, setIsLooping2] = useState(false);
  const [isLooping3, setIsLooping3] = useState(false);
  const [percent, setPercent] = useState(0)
  const [result, setResult] = useState<{ predicted_label: number; prob: number } | null>(null);
  const [selectedModel, setSelectedModel] = useState<number>(0);
  const models = ["snil", "fish", "bird"]

  const fileInputRef = useRef<HTMLInputElement>(null);

  const frase = "Procesando documento..."

  useEffect(() => {
    let interval1: string | number | NodeJS.Timeout | undefined;
    let interval2: string | number | NodeJS.Timeout | undefined;

    if (isDragging) {
      interval1 = setInterval(() => {
        setProgress(prev => {
          if (prev.length < frase.length) {
            return frase.slice(0, prev.length + 1);
          } else {
            clearInterval(interval1);
            return prev;
          }
        });
      }, 200);

      interval2 = setInterval(() => {
        setPercent(prev => {
          if (prev < 100) {
            return prev + 1;
          } else {
            clearInterval(interval2);
            return prev;
          }
        });
      }, 100);
    } else {
      setProgress("");
      setPercent(0);
    }

    return () => {
      if (interval1) clearInterval(interval1);
      if (interval2) clearInterval(interval2);
    };
  }, [isDragging]);

  useEffect(() => {
    if (progress.length === frase.length) {
      const timeout = setTimeout(() => {
        setIsLooping(true);
      }, 4000);
      const timeout2 = setTimeout(() => {
        setIsLooping2(true);
      }, 350);
      const timeout3 = setTimeout(() => {
        setIsLooping3(true);
      }, 2500);

      return () => {
        clearTimeout(timeout)
        clearTimeout(timeout2)
        clearTimeout(timeout3)
      };
    } else {
      setIsLooping(false);
      setIsLooping2(false);
      setIsLooping3(false);
    }
  }, [progress]);

  const handleUpload = async (input: React.ChangeEvent<HTMLInputElement> | File) => {
    const file = input instanceof File ? input : input.target.files?.[0]
    if (!file) return
    setIsDragging(true)
    let result
    if (selectedModel == 0) {
      result = await procesarSVM(file)
    }
    if (selectedModel == 1) {
      result = await procesarRoBERTa(file)
    }
    if (selectedModel == 2) {
      result = await procesarSimpleNet(file)
    }
    if (result == null) { return }
    setResult(result)
    setIsDragging(false)
  }

  return (
    <div className="flex flex-col gap-7 min-h-screen items-center justify-center bg-linear-to-tr/hsl from-sky-950 from-20% to-cyan-950 to-80%  font-sans px-5">
      <h1 className="momo-trust-display-regular text-4xl text-amber-400 text-center">Detector de IA en textos académicos</h1>
      {progress.length == 0 &&
        <div className="border-amber-400 border-2 p-7 rounded-2xl">
          <div className="border-cyan-400 border-4 border-dotted p-7 rounded-xl hover:bg-cyan-400/5"
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
              <button className="momo-trust-display-regular text-center text-white text-base border-2 border-white p-2 rounded-lg hover:bg-white/10"
                onClick={() => fileInputRef.current?.click()}>Subir archivo</button>
            </div>
            <input type="file" accept=".txt,.pdf" className="hidden" ref={fileInputRef} onChange={handleUpload}></input>

          </div>
          <div className="flex flex-col p-5">
            <p className="momo-trust-display-regular text-white text-xl text-center mb-5">Elige el modo de detección</p>
            <div className="flex justify-center gap-5">
              <button className={`momo-trust-display-regular text-center text-white text-base border-2 border-white p-2 rounded-lg ${selectedModel == 0 ? "bg-white/15" : ""} hover:bg-white/5`}
                onClick={() => setSelectedModel(0)}>
                <div className="flex flex-col p-2 gap-2">
                  <Snail className="w-10 h-10"></Snail>
                  Snail
                </div>
              </button>
              {/*<button className={`momo-trust-display-regular text-center text-white text-base border-2 border-white p-2 rounded-lg ${selectedModel == 1 ? "bg-white/15" : ""} hover:bg-white/5`}
                onClick={() => setSelectedModel(1)}>
                <div className="flex flex-col p-2 gap-2">
                  <Fish className="w-10 h-10"></Fish>
                  Snail
                </div>
              </button>
              <button className={`momo-trust-display-regular text-center text-white text-base border-2 border-white p-2 rounded-lg ${selectedModel == 2 ? "bg-white/15" : ""} hover:bg-white/5`}
                onClick={() => setSelectedModel(2)}>
                <div className="flex flex-col p-2 gap-2">
                  <Bird className="w-10 h-10"></Bird>
                  Bird
                </div>
              </button>*/}
            </div>
          </div>
        </div>}
      {progress != undefined && progress.length > 0 && progress.length <= frase.length &&
        <div className="progress-wrapper">
          <div className="progress-text">{progress}</div>
          <div className={`water-fill`} style={{ width: `${percent}%`, height: '100%' }}>
            <div className={`wave wave1 ${isLooping ? 'loop' : ''}`}></div>
            <div className={`wave wave2 ${isLooping2 ? 'loop' : ''}`}></div>
            <div className={`wave wave3 ${isLooping3 ? 'loop' : ''}`}></div>
            <div className="bubbles"></div>
          </div>
        </div>}
      {result &&
        <div className="bg-linear-to-tr from-white/50 to-white/70 rounded-2xl p-5">
          <table>
            <thead>
              <th className="pb-3">
                <div className="momo-trust-display-regular text-lg text-sky-950 text-left">Resultado</div>
              </th>
              <th className="pb-3">
                <div className="momo-trust-display-regular text-lg text-right ps-8">{result.predicted_label == 0 ? "Escrito por humano" : "Escrito con IA"}</div>
              </th>
            </thead>
            <tbody>
              <tr>
                <td className="">
                  <div className="momo-trust-display-regular text-lg text-sky-950">Confianza</div>
                </td>
                <td className="">
                  <div className="momo-trust-display-regular text-lg text-right">{(Number(result.prob.toFixed(4)) * 100).toFixed(2)}%</div>
                </td>
              </tr>
            </tbody>
          </table>

        </div>}
    </div>
  );
}
