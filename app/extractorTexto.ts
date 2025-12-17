import pdfToText from 'react-pdftotext'

export async function extractTextFromPDF(file: File): Promise<string> {
    try {
        const text = await pdfToText(file);
        //console.log(text)
        //console.log(normalize(text))
        return normalize(text);
    } catch (error) {
        console.error("Failed to extract text from PDF", error);
        throw error;
    }
}

export function normalize(text: string) {
  return text
    .replace(/\.{2,}/g, ' ')
    .replace(/\s+/g, " ")
    .replace(/-\s+/g, "")
    .trim();
}
