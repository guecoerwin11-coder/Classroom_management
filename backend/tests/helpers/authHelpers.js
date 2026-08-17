// tests/helpers/authHelper.js
const request = require('supertest');

async function getTeacherToken(app) {
    const uniqueEmail = `teacher_${Date.now()}@school.com`; // Random email to avoid collisions

    // 1. Register a temporary teacher account
    await request(app)
        .post('/api/auth/register')
        .send({
            "firstName": "Test",
            "lastName": "Teacher",
            "email": uniqueEmail,
            "role": "Teacher",
            "password": "password123"
        });

    // 2. Log in with that teacher account
    const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
            "email": uniqueEmail,
            "password": "password123"
        });

    return loginRes.body.token; // Hand back the JWT string
}

module.exports = { getTeacherToken };
