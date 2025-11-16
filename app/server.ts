import express from "express";
import dotenv from "dotenv";
import routes from "./routes/lessonRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(express.json());

app.use("/api/lesson", routes);

app.get("/", async (req, res) => {
    res.send("Hello, World!");
});

app.listen(port, () => {
    console.log("Listening on port", port);
});