const userSchema = require("../schemas/userModel");
const courseSchema = require("../schemas/courseModel");
const enrolledCourseSchema = require("../schemas/enrolledCourseModel");
const coursePaymentSchema = require("../schemas/coursePaymentModel");

// Get all users controller
const getAllUsersController = async (req, res) => {
  try {
    const allUsers = await userSchema.find();
    if (!allUsers || allUsers.length === 0) {
      return res.status(404).send({ success: false, message: "No users found" });
    }
    res.status(200).send({ success: true, data: allUsers });
  } catch (error) {
    console.error("Error in fetching users:", error);
    return res.status(500).send({ success: false, message: error.message });
  }
};

// Get all courses controller
const getAllCoursesController = async (req, res) => {
  try {
    const allCourses = await courseSchema.find();
    if (!allCourses || allCourses.length === 0) {
      return res.status(404).send({ success: false, message: "No courses found" });
    }
    res.status(200).send({ success: true, data: allCourses });
  } catch (error) {
    console.error("Error in fetching courses:", error);
    return res.status(500).send({ success: false, message: error.message });
  }
};

// Delete course controller
const deleteCourseController = async (req, res) => {
  const { courseid } = req.params;
  try {
    const course = await courseSchema.findByIdAndDelete(courseid);
    if (course) {
      res.status(200).send({ success: true, message: "Course deleted successfully" });
    } else {
      res.status(404).send({ success: false, message: "Course not found" });
    }
  } catch (error) {
    console.error("Error in deleting course:", error);
    res.status(500).send({ success: false, message: "Failed to delete course" });
  }
};

// Delete user controller
const deleteUserController = async (req, res) => {
  const { userid } = req.params;
  try {
    const user = await userSchema.findByIdAndDelete(userid);
    if (user) {
      res.status(200).send({ success: true, message: "User deleted successfully" });
    } else {
      res.status(404).send({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error in deleting user:", error);
    res.status(500).send({ success: false, message: "Failed to delete user" });
  }
};

module.exports = {
  getAllUsersController,
  getAllCoursesController,
  deleteCourseController,
  deleteUserController,
};
