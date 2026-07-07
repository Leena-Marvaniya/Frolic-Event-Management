const express = require("express");
const router = express.Router();
const winnerController = require("../controllers/eventWiseWinnerController");


router.get("/events/:eventId/winners", winnerController.getWinnersByEvent);
router.post("/events/:eventId/winners", winnerController.createWinner);


router.put("/winners/:id", winnerController.updateWinner);
router.delete("/winners/:id", winnerController.deleteWinner);

module.exports = router;

