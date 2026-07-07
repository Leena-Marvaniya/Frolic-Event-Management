const express = require("express");
const router = express.Router();

const instituteController = require("../controllers/instituteController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.get("/", verifyToken, instituteController.getAllInstitutes);

router.get("/:id", verifyToken, instituteController.getInstituteById);

router.get("/:id/departments", verifyToken, instituteController.getDepartmentsByInstitute);

router.post("/", verifyToken, isAdmin, instituteController.createInstitute);

router.put("/:id", verifyToken, isAdmin, instituteController.updateInstitute);

router.delete("/:id", verifyToken, isAdmin, instituteController.deleteInstitute);

module.exports = router;
