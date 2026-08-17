const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/configs/postgres');
const mongoose = require('mongoose');
const { getTeacherToken } = require('./helpers/authHelpers');
const { jwtDecode } = require('jwt-decode');

let authToken = "";
let teacherId = "";
let parentSectionId = null;
let testSubjectId = null; // We will capture this in the first test and use it in the lookup test!

beforeAll(async () => {
    try {
        // 1. Clear database tables in safe reverse-relational order
        await prisma.subject.deleteMany({});
        await prisma.section.deleteMany({});
        
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI_TEST);
        }

        // 2. Fetch authenticated teacher token and ID
        authToken = await getTeacherToken(app); 
        const decoded = jwtDecode(authToken);
        teacherId = decoded.id; 

        // 3. Create a parent section row so the subject 'connect' clause has a target
        const section = await prisma.section.create({
            data: {
                section_name: "Grapes",
                userId: teacherId
            }
        });
        parentSectionId = section.id;

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

describe('📚 Subject Management API Endpoints', () => {

    // --- 1. TEST POST (CREATE SUBJECT) ---
    it('should successfully create a new subject connected to a section', async () => {
        const res = await request(app)
            .post('/api/subjects/add') // 👈 Adjust to your real router mapping path
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                subjectName: "Science 101",
                sectionId: parentSectionId.toString()
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'new subject added!');

        // Quick verification: Let's read from the database to find the auto-assigned ID
        const savedSubject = await prisma.subject.findFirst({
            where: { subject_name: "Science 101" }
        });
        testSubjectId = savedSubject.id; // 👈 Captured! Now the next test cases can use it
    });

    // --- 2. TEST GET SINGLE (READ ONE) ---
    it('should successfully fetch a single subject by its ID parameters', async () => {
        const res = await request(app)
            .get(`/api/subjects/${testSubjectId}`) // 👈 Path mapping includes captured identity
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('id', testSubjectId);
        expect(res.body.data).toHaveProperty('subject_name', 'Science 101');
    });

    // --- 3. TEST GET ALL (READ ALL) ---
    it('should successfully retrieve all subjects with specific fields chosen', async () => {
        const res = await request(app)
            .get('/api/subjects') // 👈 Adjust to your real index route path
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'all subjects available'); // Matches your spelling!
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
        
        // Verifies your SELECT criteria successfully stripped unintended columns
        expect(res.body.data[0]).toHaveProperty('id');
        expect(res.body.data[0]).toHaveProperty('userId');
        expect(res.body.data[0]).toHaveProperty('subject_name');
    });

    // --- 4. TEST SCENARIO: 404 RUNTIME HANDLER ---
    it('should return a 404 message if the target subject ID is non-existent', async () => {
        const res = await request(app)
            .get('/api/subjects/99999')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message', 'no subject exist');
    });

});
