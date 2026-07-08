import { Mistral } from "@mistralai/mistralai";

export const executeMistralPrompt = async (systemPrompt, userPrompt) => {
  const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

  const result = await mistral.chat.complete({
    model: "mistral-large-latest",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    responseFormat: { type: "text" },
  });

  return result.choices[0].message.content;
};
