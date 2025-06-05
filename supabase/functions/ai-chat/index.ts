import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import OpenAI from "npm:openai";

serve(async (req) => {
  try {
    const { message } = await req.json();

    // Fetch the OpenAI API key from Supabase secrets
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const openai = new OpenAI({ apiKey: openaiApiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano", // Using the default model
      messages: [{ role: "user", content: message }],
    });

    const aiResponse = completion.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing AI request:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});