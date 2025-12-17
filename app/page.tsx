"use client"
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { procesarModelo } from "@/app/servicio"
import "./progressBar.css"
import { Bird, Fish, Snail, Turtle } from "lucide-react";
import { extractTextFromPDF } from "./extractorTexto";

export default function Home() {
  const [isDragging, setIsDragging] = useState<boolean | null>(null)
  const [progress, setProgress] = useState("")
  const [isLooping, setIsLooping] = useState(false);
  const [isLooping2, setIsLooping2] = useState(false);
  const [isLooping3, setIsLooping3] = useState(false);
  const [percent, setPercent] = useState(0)
  const [filename, setFileName] = useState("")
  const [result, setResult] = useState<{ predicted_label: number; prob: number } | null>(null);
  const [selectedModel, setSelectedModel] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState(false)
  const frase = "Procesando archivo..."

  const [showFish, setShowFish] = useState(false)
  const [showTurtle, setShowTurtle] = useState(false)
  const [showSnail, setShowSnail] = useState(false)

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
      }, 50);

      interval2 = setInterval(() => {
        setPercent(prev => {
          if (prev < 100) {
            return prev + 1;
          } else {
            clearInterval(interval2);
            return prev;
          }
        });
      }, 20);
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
    setError(false)
    let text
    if (file.type === "application/pdf") {
      text = await extractTextFromPDF(file)
    }
    if (file.type === "text/plain") {
      text = await file.text()
    }
    console.info("pasó")
    let result
    if (selectedModel == 0) {
      result = await procesarModelo("svm", text)
    }
    if (selectedModel == 1) {
      result = await procesarModelo("roberta", text, 120000)
    }
    if (selectedModel == 2) {
      result = await procesarModelo("mlp", text)
    }
    if (result == null) {
      setIsDragging(false)
      setError(true)
      return
    }
    setResult(result)
    setFileName(file.name)
    setIsDragging(false)
  }

  return (
    <div className="flex flex-col gap-7 min-h-screen items-center justify-center bg-linear-to-tr/hsl from-slate-50 from-20% to-slate-100 to-80%  font-sans px-6">
      <div id="lienzo_fijo" className="w-480 h-220 fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-none">

        <div id="derecha_atras" className="w-65 h-30 bg-amber-300 absolute z-0 rotate-75 top-60 left-265"></div>
        <div id="gordo_arriba" className="w-45 h-62 bg-lime-400 absolute z-0 rotate-15 top-38 left-233"></div>
        <div id="echado_arriba" className="w-58 h-30 bg-amber-300 absolute z-1 rotate-355 top-10 left-210"></div>
        <div id="cuadrado" className="w-45 h-62 bg-lime-400 absolute z-1 rotate-45 top-8 left-155"></div>
        <div id="cuadrado" className="w-35 h-35 bg-amber-300 absolute z-1 rotate-45 top-45 left-155"></div>
        <div id="cuadrado" className="w-45 h-62 bg-lime-400 absolute z-1 rotate-8 top-72 left-148"></div>
        <div id="flaco_central" className="w-13 h-60 bg-amber-300 absolute z-1 rotate-342 top-90 left-230"></div>
        <div id="largo_der" className="w-60 h-15 bg-amber-300 absolute z-2 rotate-25 top-125 left-262"></div>
        <div id="cuadrado" className="w-25 h-42 bg-lime-400 absolute z-3 rotate-0 top-100 left-285"></div>
        <div id="echado-ab" className="w-40 h-30 bg-lime-400 absolute z-3 rotate-15 top-160 left-185"></div>
        <div id="pequeño" className="w-15 h-35 bg-amber-300 absolute z-3 rotate-12 top-125 left-185"></div>
        <div id="echado_izq" className="w-25 h-50 bg-lime-400 absolute z-3 rotate-60 top-80 left-190"></div>
        <div id="gordo_abajo" className="w-45 h-60 bg-lime-400 absolute z-4 rotate-25 top-125 left-235"></div>
        <div id="echado_abajo" className="w-65 h-30 bg-amber-300 absolute z-4 rotate-355 top-175 left-175"></div>

      </div>


      <div className="flex flex-col gap-7 min-h-screen items-center justify-center font-sans px-5 z-10">
        <h1 className="momo-trust-display-regular text-4xl text-yellow-700 text-center">Detector de IA en textos académicos</h1>
        {progress.length == 0 &&
          <div className="border-yellow-700 border-3 p-7 rounded-2xl">
            <div className="flex flex-col pb-8">
              <p className="momo-trust-display-regular text-black text-xl text-center mb-5">Elige el modelo de IA</p>
              <div className="flex justify-center gap-3 xs:gap-5">
                <div className="relative">
                  <button className={`momo-trust-display-regular text-center text-orange-600 text-base border-3 border-orange-600 p-2 rounded-lg ${selectedModel == 0 ? "bg-orange-600/10" : ""} hover:bg-white/40`}
                    onClick={() => setSelectedModel(0)} onMouseEnter={() => { setShowFish(true); setTimeout(() => setShowFish(false), 2000) }}>
                    <div className="flex flex-col p-1 xxs:p-1.5 xs:p-2 gap-2 items-center">
                      <Fish className="w-10 h-10"></Fish>
                      Fish
                    </div>
                  </button>
                  {showFish && <div className="absolute top-22 -left-1.5 bg-linear-to-tr from-white/50 to-white/70 z-40 rounded-2xl p-2 momo-trust-display-regular text-center text-sm opacity-fluid">El más rápido</div>}
                </div>
                <div className="relative">
                  <button className={`momo-trust-display-regular text-center text-cyan-600 text-base border-3 border-cyan-600 p-2 rounded-lg ${selectedModel == 1 ? "bg-cyan-300/20" : ""} hover:bg-white/30`}
                    onClick={() => setSelectedModel(1)} onMouseEnter={() => { setShowTurtle(true); setTimeout(() => setShowTurtle(false), 2000) }}>
                    <div className="flex flex-col p-1 xxs:p-1.5 xs:p-2 gap-1 items-center">
                      <Turtle className="w-11 h-11"></Turtle>
                      Turtle
                    </div>
                  </button>
                  {showTurtle && <div className="absolute -top-5 left-3 w-18 bg-linear-to-tr from-white/50 to-white/70 z-40 rounded-2xl p-2 momo-trust-display-regular text-center text-sm opacity-fluid">El más preciso</div>}
                </div>
                {/*<button className={`momo-trust-display-regular text-center text-cyan-600 text-base border-3 border-cyan-600 p-2 rounded-lg ${selectedModel == 1 ? "bg-cyan-300/25" : ""} hover:bg-white/30`}
                  onClick={() => setSelectedModel(1)} onMouseEnter={() => setShowFish(true)} onMouseLeave={() => setShowFish(false)}>
                  <div className="flex flex-col p-2 gap-2">
                    <Bird className="w-10 h-10"></Bird>
                    Bird
                  </div>
                </button>*/}
                <div className="relative">
                  <button className={`momo-trust-display-regular text-center text-violet-800 text-base border-3 border-violet-800 p-2 rounded-lg ${selectedModel == 2 ? "bg-violet-300/50" : ""} hover:bg-white/40`}
                    onClick={() => setSelectedModel(2)} onMouseEnter={() => { setShowSnail(true); setTimeout(() => setShowSnail(false), 2000) }}>
                    <div className="flex flex-col p-1 xxs:p-1.5 xs:p-2 gap-2 items-center">
                      <Snail className="w-10 h-10"></Snail>
                      Snail
                    </div>
                  </button>
                  {showSnail && <div className="absolute -top-5 -left-2.5 bg-linear-to-tr from-white/50 to-white/70 z-40 rounded-2xl p-2 momo-trust-display-regular text-center text-sm opacity-fluid">El más equilibrado</div>}
                </div>
              </div>
            </div>
            <div className="border-lime-600 border-4 border-dotted p-6 rounded-xl hover:bg-lime-600/10"
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
              <p className="momo-trust-display-regular text-lime-600 text-xl text-center mb-5">Sube o arrasta un archivo .txt .pdf</p>
              <div className="flex justify-center">
                <button className="momo-trust-display-regular text-center text-black text-base border-3 border-black p-2 rounded-lg hover:bg-black/10"
                  onClick={() => fileInputRef.current?.click()}>Subir archivo</button>
              </div>
              <input type="file" accept=".txt,.pdf" className="hidden" ref={fileInputRef} onChange={handleUpload}></input>

            </div>

          </div>}
        {progress != undefined && progress.length > 0 && progress.length <= frase.length &&
          <div className="progress-wrapper">
            <div className="progress-text momo-trust-display-regular">{progress}</div>
            <div className={`water-fill`} style={{ width: `${percent}%`, height: '100%' }}>
              <div className={`wave wave1 ${isLooping ? 'loop' : ''}`}></div>
              <div className={`wave wave2 ${isLooping2 ? 'loop' : ''}`}></div>
              <div className={`wave wave3 ${isLooping3 ? 'loop' : ''}`}></div>
              <div className="bubbles"></div>
            </div>
          </div>}
        {error &&
          <div className="bg-linear-to-tr from-red-500/50 to-red-600/70 rounded-2xl p-5 momo-trust-display-regular text-white text-lg">
            Error al cargar el archivo
          </div>}
        {result &&
          <div className="bg-linear-to-tr from-white/50 to-white/70 rounded-2xl p-5">
            <table>
              <thead>
                <tr>
                  <th className="pb-3">
                    <div className="momo-trust-display-regular text-lg text-lime-900 text-left">Nombre</div>
                  </th>
                  <th className="pb-3">
                    <div className="momo-trust-display-regular text-lg text-right ps-8 w-56 truncate">{filename}</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="pb-3">
                    <div className="momo-trust-display-regular text-lg text-lime-900 text-left">Resultado</div>
                  </td>
                  <td className="pb-3">
                    <div className="momo-trust-display-regular text-lg text-right ps-8">{result.predicted_label == 0 ? "Escrito por humano" : "Escrito con IA"}</div>
                  </td>
                </tr>
                <tr>
                  <td className="">
                    <div className="momo-trust-display-regular text-lg text-lime-900">Confianza</div>
                  </td>
                  <td className="">
                    <div className="momo-trust-display-regular text-lg text-right">{(Number(result.prob.toFixed(4)) * 100).toFixed(2)}%</div>
                  </td>
                </tr>
              </tbody>
            </table>

          </div>}
      </div>
    </div>
  );
}
