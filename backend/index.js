import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import passport from "passport";
import session from "express-session";
import "./config/passport.js"; 

const app = express();
const port = process.env.PORT || 5000;

app.set("trust proxy", 1);

app.use(
    cors({
        origin: "https://aivirtualassistant.onrender.com",
        "https://aivirtualassistant-backend.onrender.com"
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

app.use(
    session({
        secret: process.env.SESSION_SECRET || "mysecret",
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

async function startServer() {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    } catch (error) {
        console.error("Failed to connect to DB", error);
    }
}

startServer();
