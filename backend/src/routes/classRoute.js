const express = require('express')
const classRouter = express.Router()
const protect = require('../middleware/protect')
const isTeacher = require('../middleware/role')
const enrollStudent = require('../controllers/enrollController')
const {
    addSection, getSections, getSection
} = require('../controllers/sectionController')
const {
    createSubject, getSubject, getAllSubjects
} = require('../controllers/subjectController')


//subject
classRouter.post('/subjects/add', protect, isTeacher, createSubject)
classRouter.get('/subjects/:id',protect, getSubject)
classRouter.get('/subjects', protect, getAllSubjects)

//section
classRouter.post('/sections/add',protect, isTeacher, addSection)
classRouter.get('/sections',protect, getSections)
classRouter.get('/sections/:id',protect, getSection)

//enroll Student
classRouter.post('/enroll',protect, isTeacher, enrollStudent)

module.exports = classRouter