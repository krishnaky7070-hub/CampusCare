const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "CampusCare Backend is running! 🚀"
    });
});

// Feedback API
app.post("/api/feedback", (req, res) => {

    const {
        name,
        hostel,
        category,
        priority,
        title,
        description,
        rating
    } = req.body;

    // Check required fields
    if (!name || !hostel || !category || !title || !description) {
        return res.status(400).json({
            success: false,
            message: "Please fill all required fields."
        });
    }

    // Generate tracking ID
    const trackingId =
        "CC-" + Math.floor(100000 + Math.random() * 900000);

    // Create feedback object
    const newIssue = {
        id: trackingId,
        name: name,
        hostel: hostel,
        category: category,
        priority: priority || "Medium",
        title: title,
        description: description,
        rating: rating || 5,
        status: "Submitted",
        date: new Date().toLocaleDateString("en-IN")
    };

    // Show feedback in terminal
    console.log("New feedback received:");
    console.log(newIssue);

    // Send response to frontend
    res.status(201).json({
        success: true,
        message: "Feedback received successfully!",
        trackingId: trackingId,
        issue: newIssue
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`CampusCare server running at http://localhost:${PORT}`);
});