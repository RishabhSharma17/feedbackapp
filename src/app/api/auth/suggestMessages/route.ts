import { GoogleGenerativeAI } from "@google/generative-ai";

const genAi = new GoogleGenerativeAI(process.env.GOOGLE_AI as string);

export const runtime = 'edge';

export async function GET(req:Request){
  try {
    const prompt =
  "Generate three open-ended and engaging questions formatted as a single string, with each question separated by '||'. Ensure the questions are suitable for an anonymous social messaging platform like Qooh.me, avoiding personal or sensitive topics. Instead, focus on Indian themes that encourage curiosity, creativity, and friendly interactions. For example, consider questions about hobbies, dreams, or intriguing hypothetical scenarios. Ensure every set of questions is unique, playful, and thought-provoking. Example output: 'What’s the most unusual thing you’ve ever eaten?||If you could live in any fictional universe, which one would it be?||What’s one small thing you’ve done recently to make someone’s day better?'. Always provide a fresh and surprising perspective with each response.";
  
    const dynamicContext = "Focus on themes like travel, books, or fun challenges.";
    const fullPrompt = `${prompt} ${dynamicContext}`;

    const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(fullPrompt);
    console.log(result);

    return Response.json({
      success: true,
      data: result.response.candidates
    },{
      status:200
    });
  } catch (error) {
    console.error(error);
    return Response.json({
      success:false,
      message:"Error generating content",
    },{status:500});
  }
}