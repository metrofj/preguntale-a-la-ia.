export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ result: "Método no permitido" });
  }

  const { message } = req.body;

  // Lista de claves API (puedes añadir más si usas más variables)
  const keys = [
    process.env.OPENAI_API_KEY_1,
    process.env.OPENAI_API_KEY_2,
    process.env.OPENAI_API_KEY_3,
    // Puedes seguir agregando más claves aquí...
  ].filter(Boolean); // Quita claves no definidas

  let respuestaExitosa = null;

  for (const key of keys) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "Eres una inteligencia artificial especializada en responder preguntas sobre Trabajo Social. Si te preguntan qué eres, responde que eres una IA diseñada solo para ayudar con temas de Trabajo Social. No menciones que eres ChatGPT, ni detalles técnicos, ni hables de otros temas.",
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      });

      const data = await response.json();

      console.log("Respuesta completa de OpenAI:", data); // ✅ DEBUG

      if (response.ok && data.choices && data.choices[0]) {
        respuestaExitosa = data.choices[0].message.content;
        break; // ✅ Éxito, salimos del bucle
      } else {
        console.error("❌ Error con esta clave:", key);
        console.error("Respuesta f
