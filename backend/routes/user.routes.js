import express from "express";
import {
    askToAssistant,
    getCurrentUser,
    getUserHistory,
    updateAssistant,
    updateAssistantNoFile,
} from "../controller/user.controller.js";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);
userRouter.post("/ask-to-assistant", isAuth, askToAssistant);
userRouter.get("/history", isAuth, getUserHistory);
userRouter.post(
    "/updateAssistantNoFile",
    isAuth,
    updateAssistantNoFile
);

userRouter.post(
    "/updateAssistant",
    isAuth,
    upload.single("assistantImage"),
    updateAssistant
);

export default userRouter;
