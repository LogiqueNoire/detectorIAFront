import axios from "axios";

const URL = process.env.NEXT_PUBLIC_URL_BACK

export async function procesarModelo(endpoint, text, timeout = 60000) {
  try {
    const response = await axios.post(
      `${URL}/predict/${endpoint}`,
      { text },
      {
        timeout,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Error en ${endpoint}:`, error);
    return null;
  }
}


export async function procesarModeloPDF(endpoint, file, timeout = 60000) {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await axios.post(
      `${URL}/predict/${endpoint}`,
      formData,
      {
        timeout,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Error en ${endpoint}:`, error);
    return null;
  }
}