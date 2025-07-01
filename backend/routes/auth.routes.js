import express from "express";
import passport from "passport";
import { login, logout, signUp, handleSocialLogin } from "../controller/auth.controller.js";

const authRouter = express.Router();

// BASIC AUTH
authRouter.post("/signup", signUp);
authRouter.post("/signin", login);
authRouter.post("/logout", logout);

// GOOGLE OAUTH
authRouter.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "https://aivirtualassistant.onrender.com//signin",
        session: true,
    }),
    handleSocialLogin
);

// GITHUB OAUTH
authRouter.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] })
);

authRouter.get(
    "/github/callback",
    passport.authenticate("github", {
        failureRedirect: "https://aivirtualassistant.onrender.com//signin",
        session: true,
    }),
    handleSocialLogin
);

export default authRouter;
