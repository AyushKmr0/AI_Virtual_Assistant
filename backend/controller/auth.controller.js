import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existEmail = await User.findOne({ email });
        if (existEmail) {
            return res.status(400).json({ message: "Email already exists!" });
        }

        if (password.length < 6) {
            return res
                .status(400)
                .json({ message: "Password must be at least 6 character!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = await genToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "None",
            secure: true,
        });

        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({ message: `Sign up error ${error}` });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Email does not exist!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password!" });
        }

        const token = await genToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "None",
            secure: true,
        });

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: `Login error ${error}` });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: `Logged out successfully` });
    } catch (error) {
        return res.status(500).json({ message: `Logout error ${error}` });
    }
};

export const handleSocialLogin = async (req, res) => {
    try {
        const user = req.user;
        const token = await import("../config/token.js").then((mod) =>
            mod.default(user._id)
        );

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "None",
            secure: true,
        });

        res.redirect("https://aivirtualassistant.onrender.com/oauth-success");
    } catch (error) {
        console.log("OAuth error:", error.message);
        res.redirect("https://aivirtualassistant.onrender.com/signin");
    }
};
