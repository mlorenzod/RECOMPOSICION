// api/gemini.js
export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Recibimos el modelo, las partes (parts) y la configuración
    const { model = 'gemini-3.5-flash-lite', parts, generationConfig } = req.body;

    // Importamos el SDK solo en el backend (seguro)
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const generativeModel = genAI.getGenerativeModel({ model, generationConfig });

    // Llamamos a Gemini con las partes que vienen del frontend
    const result = await generativeModel.generateContent({ contents: [{ role: 'user', parts }] });
    const text = result.response.text();

    // Devolvemos el texto generado
    res.status(200).json({ text });
  } catch (error) {
    console.error('Error en /api/gemini:', error);
    res.status(500).json({ error: error.message });
  }
}