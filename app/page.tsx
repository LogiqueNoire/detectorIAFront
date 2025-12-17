"use client"
import { useEffect, useRef, useState } from "react";
import { procesarModelo } from "@/app/servicio"
import "@/app/progressBar/progressBar.css"
import { Fish, Snail, Turtle } from "lucide-react";
import { extractTextFromPDF } from "@/app/utils/extractorTexto";
import Fondo from "@/app/fondo";
import ProgressBar from "./progressBar/progressBar";

export default function Home() {
  const [isProcessing, setIsProcessing] = useState<boolean | null>(null)
  const frase = "Procesando archivo..."

  const [filename, setFileName] = useState("")
  const [caracteres, setCaracteres] = useState(0)
  const [result, setResult] = useState<{ predicted_label: number; prob: number } | null>(null);

  const [selectedModel, setSelectedModel] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState(false)

  const [showFish, setShowFish] = useState(false)
  const [showTurtle, setShowTurtle] = useState(false)
  const [showSnail, setShowSnail] = useState(false)

  const handleUpload = async (input: React.ChangeEvent<HTMLInputElement> | File) => {
    const file = input instanceof File ? input : input.target.files?.[0]
    if (!file) return
    setIsProcessing(true)
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
      setIsProcessing(false)
      setError(true)
      return
    }
    setResult(result)
    setFileName(file.name)
    text && setCaracteres(text.length)
    setIsProcessing(false)
  }

  return (
    <div className="flex flex-col gap-7 min-h-screen items-center justify-center bg-linear-to-tr/hsl from-slate-50 from-20% to-slate-100 to-80%  font-sans px-6">
      <Fondo color1="bg-amber-300" color2="bg-lime-400"></Fondo>
      <div className="flex flex-col gap-7 min-h-screen items-center justify-center font-sans px-5 z-10">
        <h1 className="momo-trust-display-regular text-4xl text-yellow-700 text-center">Detector de IA en textos académicos</h1>
        {isProcessing !== true && //progress.length == 0
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
              onDragOver={(e) => { e.preventDefault(); setIsProcessing(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsProcessing(false); }}
              onDrop={(e) => {
                e.preventDefault()
                setIsProcessing(false)
                const file = e.dataTransfer.files?.[0]
                if (file.type === "application/pdf" || file.name.endsWith(".txt")) {
                  handleUpload(file)
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
        {isProcessing && <ProgressBar frase={frase} isProcessing={isProcessing}></ProgressBar>}
        {error &&
          <div className="bg-linear-to-tr from-red-500/50 to-red-600/70 rounded-2xl p-5 momo-trust-display-regular text-white text-lg">
            Error al cargar el archivo
          </div>}
        {result &&
          <div className="bg-linear-to-tr from-white/50 to-white/70 rounded-2xl p-5">
            <table>
              <thead>
                <tr>
                  <th className="pb-3 momo-trust-display-regular text-lg text-lime-900 text-left">Nombre</th>
                  <th className="pb-3"><div className="momo-trust-display-regular text-lg text-right ps-8 w-56 truncate">{filename}</div></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="pb-3 momo-trust-display-regular text-lg text-lime-900">Caracteres</td>
                  <td className="pb-3 momo-trust-display-regular text-lg text-right">{caracteres}</td>
                </tr>
                <tr>
                  <td className="pb-3 momo-trust-display-regular text-lg text-lime-900 text-left">Resultado</td>
                  <td className="pb-3 momo-trust-display-regular text-lg text-right ps-8">{result.predicted_label == 0 ? "Escrito por humano" : "Escrito con IA"}</td>
                </tr>
                <tr>
                  <td className="momo-trust-display-regular text-lg text-lime-900 text-left">Confianza</td>
                  <td className="momo-trust-display-regular text-lg text-right">{(Number(result.prob.toFixed(4)) * 100).toFixed(2)}%</td>
                </tr>
              </tbody>
            </table>

          </div>}
      </div>
    </div>
  );
}
