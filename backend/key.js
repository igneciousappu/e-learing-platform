const jwt = require('jsonwebtoken');

const sendAllCoursesUserController = async (req, res) => {
    try {
      const { userId } = req.body;
      const enrolledCourses = await enrolledCourseSchema.find({ userId }).populate("courseId");
  
      if (enrolledCourses.length === 0) {
        return res.status(404).send({ success: false, message: "No enrolled courses found" });
      }
  
      return res.status(200).send({ success: true, data: enrolledCourses });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: "An error occurred" });
    }
  };
  