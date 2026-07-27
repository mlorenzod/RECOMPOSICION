// api/gemini.js
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // Solo permitimos POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { prompt, model = 'gemini-1.5-flash', generationConfig = {} } = req.body;

    // La clave se toma del entorno (segura, no expuesta)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key no configurada en el servidor' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const generativeModel = genAI.getGenerativeModel({
      model,
      generationConfig: { ...generationConfig, responseMimeType: 'application/json' }
    });

    const result = await generativeModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Intentamos parsear JSON si es posible
    let json = null;
    try {
      json = JSON.parse(text);
    } catch (_) {
      // Si no es JSON, devolvemos el texto plano
    }

    return res.status(200).json({ success: true, data: json || text });
  } catch (error) {
    console.error('Error en /api/gemini:', error);
    return res.status(500).json({ error: error.message });
  }
}