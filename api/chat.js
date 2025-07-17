export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ result: "Método no permitido" });
  }

  const { message } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Eres una inteligencia artificial especializada en responder preguntas sobre Trabajo Social. Si te preguntan si eres ChatGPT u otra IA, responde que eres una IA virtual destinada solo a responder preguntas sobre Trabajo Social, sin referirte a tu identidad o tecnología interna.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.choices || !data.choices[0]) {
      throw new Error("Error en la respuesta de OpenAI");
    }

    res.status(200).json({ result: data.choices[0].message.content });
  } catch (error) {
    console.error("Error al llamar a OpenAI:", error);

    res.status(500).json({
      result:
        "🤖 La IA está ocupada o fuera de servicio por el momento. Intenta nuevamente más tarde.",
    });
  }
}
