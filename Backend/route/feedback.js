const express = require("express");
const {
    addFeedback,
    getAllFeedback,
    getFeedbackById,
    deleteFeedback,
} = require("../models/Feedback.js");

const feedbackRouter = express.Router();

// POST feedback
feedbackRouter.post("/", async(req, res, next) => {
    try {
        const feedback = await addFeedback(req.body);
        res.status(201).json({ success: true, data: feedback });
    } catch (err) {
        next(err);
    }
});

// GET feedback
feedbackRouter.get("/", async(req, res, next) => {
    try {
        const feedback = await getAllFeedback();
        res.json({ success: true, data: feedback });
    } catch (err) {
        next(err);
    }
});

// GET feedback by id
feedbackRouter.get("/:id", async(req, res, next) => {
    try {
        const { id } = req.params;
        const feedback = await getFeedbackById(id);

        if (!feedback) {
            const error = new Error("Feedback not found");
            error.status = 404;
            throw error;
        }

        res.json({ success: true, data: feedback });
    } catch (err) {
        next(err);
    }
});

// DELETE feedback
feedbackRouter.delete("/:id", async(req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await deleteFeedback(id);

        if (!deleted) {
            const error = new Error("Feedback not found");
            error.status = 404;
            throw error;
        }

        res.json({ success: true, data: deleted });
    } catch (err) {
        next(err);
    }
});

module.exports = feedbackRouter;