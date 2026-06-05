import express from "express";
import { getWeight } from "./shipping"

const app = express();
app.use(express.json());


app.get("/", (req, res) => {
    res.send("alive");
});

app.post("/ship", async (req, res) => {
    const response  = await getWeight(req.body.message)
    res.send(response);
});


const server = app.listen(3000, '0.0.0.0', () => {
    console.log("server started");
});
