import pool from "./database.js";
import express from "express";
import cors from "cors";
import loginRouter from "./login.js";
import registerRouter from "./register.js";
import articleRouter from "./articles.js";
import userAPIsRouter from "./userAPIs.js";
import 'dotenv/config'


const app = express();

const corsOptions = {
    origin: ["http://localhost:5173"]
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', loginRouter);
app.use('/api', registerRouter);
app.use('/api', articleRouter);
app.use('/api', userAPIsRouter);

app.get("/api", async (req, res) => {
    res.json({fruits: ["apple", "banana"]});
    /*try {
        const results = await pool.query("SELECT * FROM users")
        res.json("results");
    } catch (err) {
        console.log(err);
        res.status(500).json({error: "Database error"});
    }*/
});

app.get("/api2", async (req, res) => {
    //res.json("Hello from API 2");
    try {
        const results = await pool.query("SELECT * FROM users")
        res.json(results);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: "Database error"});
    }
});

app.listen(8080, () => {
    console.log("Server started on port 8080");
});
