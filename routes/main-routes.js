const express = require('express');

const router = express.Router();

const studentController = require('../controllers/student-controller');
const teacherController = require('../controllers/teacher-controller');

router.get('/main', studentController.getMain);


//router.get('/main-teacher', teacherController.getMain());

module.exports = router;