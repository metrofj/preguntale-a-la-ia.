export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ result: "Método no permitido" });
  }

  const { message } = req.body;

  const apiKeys = [
    process.env.OPENAI_API_KEY_1,
    process.env.OPENAI_API_KEY_2,
    process.env.OPENAI_API_KEY_3, // Puedes agregar más si deseas
  ];

  try {
    let respuestaExitosa = null;

    for (const key of apiKeys) {
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
                  "Eres una inteligencia artificial especializada en responder preguntas sobre Trabajo Social. No debes mencionar que eres ChatGPT ni a qué empresa perteneces. Si te preguntan quién eres, responde que eres una IA creada para apoyar temas de Trabajo Social.",
              },
              {
                role: "user",
                content: message,
              },
            ],
          }),
        });

        const data = await response.json();

        if (response.ok && data.choices && data.choices[0]) {
          respuestaExitosa = data.choices[0].message.content;
          break;
        }
      } catch (err) {
        // Si una clave falla, pasa a la siguiente
        continue;
      }
    }

    if (!respuestaExitosa) {
      throw new Error("Todas las claves fallaron");
    }

    res.status(200).json({ result: respuestaExitosa });
  } catch (error) {
    console.error("Error al llamar a OpenAI:", error);

    res.status(500).json({
      result:
        "🤖 La IA está ocupada o fuera de servicio por el momento. Intenta nuevamente más tarde.",
    });
  }
}
