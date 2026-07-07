const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

const { verifyToken, isAdmin, isAdminOrCoordinator } = require("../middleware/authMiddleware");


router.get("/events", eventController.getAllEvents);
router.get("/events/:id", eventController.getEventById);



router.post("/events", verifyToken, isAdminOrCoordinator, eventController.createEvent);
router.put("/events/:id", verifyToken, isAdminOrCoordinator, eventController.updateEvent);
router.delete("/events/:id", verifyToken, isAdmin, eventController.deleteEvent);

module.exports = router;
