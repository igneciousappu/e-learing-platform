const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = require("../schemas/userModel");
const courseSchema = require("../schemas/courseModel");
const enrolledCourseSchema = require("../schemas/enrolledCourseModel");
const coursePaymentSchema = require("../schemas/coursePaymentModel");

// Register Controller
const registerController = async (req, res) => {
  try {
    const existsUser = await userSchema.findOne({ email: req.body.email });
    if (existsUser) {
      return res.status(400).send({ message: "User already exists", success: false });
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;

    const newUser = new userSchema(req.body);
    await newUser.save();

    return res.status(201).send({ message: "Register Success", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: error.message });
  }
};

// Login Controller
const loginController = async (req, res) => {
  try {
    const user = await userSchema.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Invalid email or password", success: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: "1d" });
    user.password = undefined;  // Remove password from response
    return res.status(200).send({ message: "Login successful", success: true, token, userData: user });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: error.message });
  }
};

// Get All Courses
const getAllCoursesController = async (req, res) => {
  try {
    const allCourses = await courseSchema.find();
    if (allCourses.length === 0) {
      return res.status(404).send({ message: "No Courses Found", success: false });
    }
    return res.status(200).send({ success: true, data: allCourses });
  } catch (error) {
    console.error("Error in fetching courses:", error);
    return res.status(500).send({ success: false, message: "Failed to fetch courses" });
  }
};

// Post Course Controller
const postCourseController = async (req, res) => {
  try {
    const { userId, C_educator, C_title, C_categories, C_price, C_description, S_title, S_description } = req.body;
    const S_content = req.files.map(file => file.filename);  // Assuming you want to store filenames
    const sections = S_title.map((title, i) => ({
      S_title: title,
      S_content: { filename: S_content[i], path: `/uploads/${S_content[i]}` },
      S_description: S_description[i]
    }));

    const price = C_price === 0 ? "free" : C_price;

    const course = new courseSchema({
      userId, C_educator, C_title, C_categories, C_price: price, C_description, sections
    });

    await course.save();
    return res.status(201).send({ success: true, message: "Course created successfully" });
  } catch (error) {
    console.error("Error creating course:", error);
    return res.status(500).send({ success: false, message: "Failed to create course" });
  }
};

// Get All Courses for User (Teacher)
const getAllCoursesUserController = async (req, res) => {
  try {
    const allCourses = await courseSchema.find({ userId: req.body.userId });
    if (!allCourses || allCourses.length === 0) {
      return res.status(404).send({ success: false, message: "No Courses Found" });
    }
    return res.status(200).send({ success: true, message: "All Courses Fetched Successfully", data: allCourses });
  } catch (error) {
    console.error("Error in fetching courses:", error);
    return res.status(500).send({ success: false, message: "Failed to fetch courses" });
  }
};

// Delete Course Controller
const deleteCourseController = async (req, res) => {
  try {
    const { courseid } = req.params;
    const course = await courseSchema.findByIdAndDelete(courseid);
    if (!course) {
      return res.status(404).send({ success: false, message: "Course not found" });
    }
    return res.status(200).send({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    return res.status(500).send({ success: false, message: "Failed to delete course" });
  }
};

// Enroll in Course
const enrolledCourseController = async (req, res) => {
  try {
    const { courseid } = req.params;
    const { userId } = req.body;
    const course = await courseSchema.findById(courseid);

    if (!course) {
      return res.status(404).send({ success: false, message: "Course Not Found!" });
    }

    const courseLength = course.sections.length;
    const existingEnrollment = await enrolledCourseSchema.findOne({
      courseId: courseid, userId, course_Length: courseLength
    });

    if (existingEnrollment) {
      return res.status(400).send({ success: false, message: "You are already enrolled in this Course!" });
    }

    const newEnrollment = new enrolledCourseSchema({
      courseId: courseid, userId, course_Length: courseLength
    });

    const coursePayment = new coursePaymentSchema({
      userId, courseId: courseid, ...req.body
    });

    await coursePayment.save();
    await newEnrollment.save();

    course.enrolled += 1;
    await course.save();

    return res.status(200).send({ success: true, message: "Enrolled Successfully", course: { id: course._id, Title: course.C_title } });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    return res.status(500).send({ success: false, message: "Failed to enroll in the course" });
  }
};

// Send Course Content to Student
const sendCourseContentController = async (req, res) => {
  try {
    const { courseid } = req.params;
    const course = await courseSchema.findById(courseid);

    if (!course) {
      return res.status(404).send({ success: false, message: "No such course found" });
    }

    const userEnrollment = await enrolledCourseSchema.findOne({
      userId: req.body.userId, courseId: courseid
    });

    if (!userEnrollment) {
      return res.status(404).send({ success: false, message: "User not enrolled in the course" });
    }

    return res.status(200).send({
      success: true,
      courseContent: course.sections,
      completeModule: userEnrollment.progress,
      certificateData: userEnrollment
    });
  } catch (error) {
    console.error("Error sending course content:", error);
    return res.status(500).send({ success: false, message: "Failed to send course content" });
  }
};

// Complete Section (Module)
const completeSectionController = async (req, res) => {
  try {
    const { courseId, sectionId } = req.body;
    const enrolledCourseContent = await enrolledCourseSchema.findOne({
      courseId, userId: req.body.userId
    });

    if (!enrolledCourseContent) {
      return res.status(400).send({ message: "User is not enrolled in the course" });
    }

    const updatedProgress = enrolledCourseContent.progress || [];
    updatedProgress.push({ sectionId });

    await enrolledCourseSchema.findOneAndUpdate(
      { _id: enrolledCourseContent._id },
      { progress: updatedProgress },
      { new: true }
    );

    return res.status(200).send({ message: "Section completed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

// Get All Courses for Particular User
const sendAllCoursesUserController = async (req, res) => {
  try {
    const { userId } = req.body;
    const enrolledCourses = await enrolledCourseSchema.find({ userId });

    if (enrolledCourses.length === 0) {
      return res.status(404).send({ success: false, message: "No enrolled courses found" });
    }

    const coursesDetails = await Promise.all(
      enrolledCourses.map(async (enrolledCourse) => {
        return await courseSchema.findById(enrolledCourse.courseId);
      })
    );

    return res.status(200).send({ success: true, data: coursesDetails });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: "An error occurred" });
  }
};

module.exports = {
  registerController,
  loginController,
  getAllCoursesController,
  postCourseController,
  getAllCoursesUserController,
  deleteCourseController,
  enrolledCourseController,
  sendCourseContentController,
  completeSectionController,
  sendAllCoursesUserController
};
