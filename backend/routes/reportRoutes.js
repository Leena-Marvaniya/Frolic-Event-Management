const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");


router.get("/event/:id", reportController.getEventSummary);

router.get("/institute/:id", reportController.getInstituteSummary);

module.exports = router;

