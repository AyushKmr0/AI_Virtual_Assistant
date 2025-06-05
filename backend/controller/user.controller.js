import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";
import geminiResponse from "../gemini.js";
import { response } from "express";
import moment from "moment";

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error("Error in getCurrentUser:", error);
        return res.status(500).json({ message: "Get current user error" });
    }
};

// Update Assistant with file upload support (multer)
export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage;

    console.log("updateAssistant called");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    if (req.file) {
      // file upload --> Cloudinary 
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else if (imageUrl) {
      if (imageUrl.startsWith("blob")) {
        return res.status(400).json({ message: "Invalid image URL" });
      }
      assistantImage = imageUrl;
    } else {
      return res.status(400).json({ message: "No image provided" });
    }

    // Database update --> assistantName and assistantImage
    const user = await User.findByIdAndUpdate(
      req.userId,
      { assistantName, assistantImage },
      { new: true }
    ).select("-password");

    return res.status(200).json(user);
  } catch (error) {
    console.error("Update Assistant Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Update Assistant without file upload --> JSON body with imageUrl
export const updateAssistantNoFile = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;

    if (!imageUrl || imageUrl.startsWith("blob")) {
      return res.status(400).json({ message: "Invalid image URL" });
    }

    // Update user with assistantName and imageUrl
    const user = await User.findByIdAndUpdate(
      req.userId,
      { assistantName, assistantImage: imageUrl },
      { new: true }
    ).select("-password");

    return res.status(200).json(user);
  } catch (error) {
    console.error("Update Assistant No File Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const askToAssistant = async (req, res) => {
    try {
        const { command } = req.body;
        const userId = req.userId;

        if (!command || typeof command !== "string" || command.trim() === "") {
            return res
                .status(400)
                .json({ response: "Invalid or empty command." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ response: "User not found." });
        }

        const userName = user.name || "User";
        const assistantName = user.assistantName || "Assistant";

        // Fetch recent history --> last 100 commands
        const recentHistory = user.history;

        const result = await geminiResponse(
            command,
            assistantName,
            userName,
            recentHistory
        );
        const jsonMatch = result.match(/{[\s\S]*}/);

        if (!jsonMatch) {
            return res
                .status(400)
                .json({ response: "Sorry, I can't understand." });
        }

        let gemResult;
        try {
            gemResult = JSON.parse(jsonMatch[0]);
        } catch (err) {
            return res
                .status(400)
                .json({ response: "Sorry, I couldn't process that." });
        }

        const { type, userInput, response } = gemResult;
        const finalInput = userInput?.trim() || command;

        user.history.push(finalInput);
        if (user.history.length > 30) {
            user.history = user.history.slice(-30);
        }
        await user.save();

        switch (type) {
            case "get_date":
                return res.json({
                    type,
                    userInput,
                    response: `Today's date is ${moment().format(
                        "YYYY-MM-DD"
                    )}`,
                });

            case "get_time":
                return res.json({
                    type,
                    userInput,
                    response: `The current time is ${moment().format(
                        "hh:mm A"
                    )}`,
                });

            case "get_day":
                return res.json({
                    type,
                    userInput,
                    response: `Today is ${moment().format("dddd")}`,
                });

            case "get_month":
                return res.json({
                    type,
                    userInput,
                    response: `The current month is ${moment().format("MMMM")}`,
                });

            case "general":
            case "google_search":
            case "youtube_search":
            case "youtube_play":
            case "calculation_result":
            case "calculator_open":
            case "instagram_open":
            case "facebook_open":
            case "weather_show":
            case "youtube_music_open":
            case "music_search":
                return res.json({ type, userInput, response });

            default:
                return res.status(400).json({
                    response: "Sorry, I don't understand that request.",
                });
        }
    } catch (error) {
        console.error("Unexpected error in askToAssistant:", error.message);
        return res.status(500).json({
            response: "Internal server error. Please try again later.",
        });
    }
};

export const getUserHistory = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const history = user.history.reverse();
        res.json({ history });
    } catch (error) {
        console.error("Error getting history:", error.message);
        res.status(500).json({ error: "Something went wrong" });
    }
};
