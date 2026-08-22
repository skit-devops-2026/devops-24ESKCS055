import express from "express";
import { connectDB } from "./config/db.js";
import dns from "dns";
import dotenv from "dotenv";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

const app=express();

connectDB();

app.listen(4000,()=> {
    console.log("Server started on PORT:4000");
});