import express from "express";
import { getWeight, rankCouriers } from "./shipping"

const app = express();
app.use(express.json());


const couriers = [
    {
        price: 24,
        time: 2
    },
    {
        price: 23,
        time: 2
    },
    {
        price: 18,
        time: 1
    },
]
const userPreference = {
    "time": 0.3,
    "price": 0.7
}

app.get("/", (req, res) => {
    const rank = rankCouriers(couriers, userPreference)
    res.send(rank);
});

app.post("/ship", async (req, res) => {
    const response  = await getWeight(req.body.message)
    res.send(response);
});


const server = app.listen(3000, () => {
    console.log("server started");
});
