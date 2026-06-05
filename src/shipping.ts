import  dotenv from "dotenv"
import OpenAI from "openai"

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY
});
 export async function getWeight(userMessage: string): Promise<string| null>
{
    
    const prompt = `You are a logistics decision systemConvert user request into weights for scoring shipping options.Return ONLY JSON like:
    {
        "price": number,
            "speed": number,
                "reliability": number
    }  User request:${ userMessage }`;
   
    //  const models = await openai.models.list();

    //  console.log(models.data.map(m => m.id));

     const response = await openai.chat.completions.create({
         model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0
    });

     console.log(response.choices[0].message.content);
     return response.choices[0].message.content ;
 }

export function rankRates(rates: Array<object>, preference: Array<object>) {
    const prices = rates.map(r => r.price);
    const times = rates.map(r => r.days);

    return rates
        .map(r => ({
            ...r,
            score:
                preference.price * (1 / r.price) +
                preference.speed * (1 / r.days),
        }))
        .sort((a, b) => b.score - a.score);
}