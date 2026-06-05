import  dotenv from "dotenv"
import { time } from "node:console";
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

function normalize(value: number, minValue: number, mixValue: number) {
    return (value - minValue) / (mixValue - minValue);
}


type rank = {
    price: number,
    time: number
}

export function rankCouriers(couriers: Array<rank>, preferences: rank) {

    const prices = couriers.map(c => c.price);
    const times = couriers.map(c => c.time);


    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return couriers.map(courier => {

        const bestPrice = 1 - normalize(courier.price, minPrice, maxPrice);
        const bestTime = 1 - normalize(courier.time, minPrice, maxPrice);

        const score = bestPrice * preferences.price + bestTime * preferences.time;

        return { ...courier, score }
    }).sort((a, b) => b.score - a.score)
}