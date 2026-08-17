const path = require('path');
require('dotenv').config();

const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/configs/postgres');
const mongoose = require('mongoose');
const { getTeacherToken } = require('./helpers/authHelpers');
const { jwtDecode } = require('jwt-decode');

let authToken = "";
let teacherId = "";
let testSectionId = null;
const mockStudentId = "603d21a9f12d4b0015a1e999"; // Fake MongoDB Student ID

beforeAll(async () => {
    try {
        // Clear enrollment data completely to isolate tests
        await prisma.sectionStudent.deleteMany({})
        await prisma.section.deleteMany({});
        
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI_TEST);
        }

        // Get token and decode to fulfill PostgreSQL userId criteria
        authToken = await getTeacherToken(app); 
        const decoded = jwtDecode(authToken);
        teacherId = decoded.id; 

        // Create a persistent mock section for our tests to use
        const section = await prisma.section.create({
            data: {
                section_name: "Durian",
                userId: teacherId
            }
        });
        testSectionId = section.id;

    } catch (err) {
        console.log("Setup failed:", err.message);
        throw err;
    }
}, 15000);

afterAll(async () => {
    await prisma.$disconnect();
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
    }
});

describe(' Student Enrollment API Endpoints', () => {

    // --- TEST 1: SUCCESSFUL ENROLLMENT ---
    it('should successfully enroll a new student into a vacant section', async () => {
        const res = await request(app)
            .post('/api/enroll') // 👈 Adjust to match your exact route path endpoint
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                sectionId: testSectionId.toString(), // Send as string to mimic real client requests
                studentId: mockStudentId
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'new student enroll!');
        expect(res.body.data).toHaveProperty('studentId', mockStudentId);
    });

    // --- TEST 2: DUPLICATE ENROLLMENT FAILURE ---
    it('should reject enrollment if the student is already in the section', async () => {
        const res = await request(app)
            .post('/api/enroll')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                sectionId: testSectionId.toString(),
                studentId: mockStudentId // Sending the exact same student ID again
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'student is already enrolled');
    });

    // --- TEST 3: NON-EXISTENT SECTION FAILURE ---
    it('should return 404 if trying to enroll into a section that does not exist', async () => {
        const res = await request(app)
            .post('/api/enroll')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                sectionId: "99999", // Fake section id
                studentId: "603d21a9f12d4b0015a1e888"
            });

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message', 'no section exist');
    });

});
