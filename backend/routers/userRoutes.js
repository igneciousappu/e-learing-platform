const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  registerController,
  loginController,
  postCourseController,
  getAllCoursesUserController,
  deleteCourseController,
  getAllCoursesController,
  enrolledCourseController,
  sendCourseContentController,
  completeSectionController,
  sendAllCoursesUserController,
} = require("../controllers/userControllers");

const router = express.Router();

// Multer setup for file uploads if required for postCourseController
const upload = multer({ dest: "uploads/" });

// Define routes
router.post("/register", registerController);
router.post("/login", loginController);

// Use multer middleware for course posting if it involves file uploads
router.post("/courses", authMiddleware, upload.single("file"), postCourseController);

router.get("/courses", authMiddleware, getAllCoursesController);
router.get("/user/courses", authMiddleware, getAllCoursesUserController);
router.delete("/courses/:id", authMiddleware, deleteCourseController);
router.post("/courses/enroll", authMiddleware, enrolledCourseController);
router.post("/courses/content", authMiddleware, sendCourseContentController);
router.post("/courses/complete-section", authMiddleware, completeSectionController);
router.get("/user/all-courses", authMiddleware, sendAllCoursesUserController);

module.exports = router;
