import axios from "axios";

const URL = process.env.NEXT_PUBLIC_URL_BACK

export async function procesarSVM(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      `${URL}/predict/svm`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al enviar archivo:", error);
  }
}

export async function procesarRoBERTa(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      `${URL}/predict/roberta`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al enviar archivo:", error);
  }
}

export async function procesarMLP(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      `${URL}/predict/mlp`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al enviar archivo:", error);
  }
}