import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import auth from "./src/routes/auth";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true,
}));

app.use("/api/v1",auth);

export default app;