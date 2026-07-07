const express = require("express");
const router = express.Router();

const groupController = require("../controllers/groupController");
const { verifyToken } = require("../middleware/authMiddleware");

// ================= ROUTES =================

// Get groups by event
router.get("/events/:eventId/groups", groupController.getGroupsByEvent);

// Create group
router.post("/events/:eventId/groups", verifyToken, groupController.createGroup);

// ✅ NEW (IMPORTANT)
router.get("/my-groups", verifyToken, groupController.getMyGroups);

// Update group
router.put("/groups/:id", verifyToken, groupController.updateGroup);

// Delete group
router.delete("/groups/:id", verifyToken, groupController.deleteGroup);

// ✅ JOIN GROUP
router.post("/groups/:groupId/join", verifyToken, groupController.joinGroup);

module.exports = router;