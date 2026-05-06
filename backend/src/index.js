import pool from "./database.js";

//const express = require ("express");
import express from "express";
const app = express();

//const cors = require("cors"); 
import cors from "cors";
const corsOptions = {
    origin: ["http://localhost:5173"]
};

app.use(cors(corsOptions));


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
