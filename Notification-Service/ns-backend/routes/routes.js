const express = require('express')
const router = express.Router()
const { getStudents, sendEmail, sendsms, login} = require('../controllers/lecturer.controller.js')

router.get('/api/students', getStudents)

router.post('/api/sendEmail', sendEmail)

router.post('/api/sendsms', sendsms)

// router.get('/api/courses', getCourses)

router.get('/api/login', login)

module.exports = router
