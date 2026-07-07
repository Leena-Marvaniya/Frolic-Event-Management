const express = require("express");
const router = express.Router();

const participantController = require("../controllers/participantController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/groups/:groupId/participants", verifyToken, participantController.getParticipantsByGroup);

router.post("/groups/:groupId/participants", verifyToken, participantController.createParticipant);

router.put("/participants/:id", verifyToken, participantController.updateParticipant);

router.delete("/participants/:id", verifyToken, participantController.deleteParticipant);

module.exports = router;