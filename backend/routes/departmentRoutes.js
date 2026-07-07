const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/departmentController");

// ✅ IMPORT FIX
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Public routes
router.get("/", departmentController.getAllDepartments);
router.get("/:id", departmentController.getDepartmentById);

// Protected routes (Admin only)
router.post("/", verifyToken, isAdmin, departmentController.createDepartment);

router.put("/:id", verifyToken, isAdmin, departmentController.updateDepartment);

router.delete("/:id", verifyToken, isAdmin, departmentController.deleteDepartment);

module.exports = router;