const request = require('supertest')
const app = require('../src/app')
const prisma = require('../src/configs/postgres')

beforeAll( async () => {
    await prisma.section.deleteMany({});
})

afterAll( async () => {
    await prisma.$disconnect();
})

describe('API section of student', () => {
    it('should add a new section', async () => {
        const res = await request(app)
            .post('/api/sections/add')
            .send({
                "section_name": "Apple"
            });

        expect(res.statusCode).toBe(201)
        expect(res.body).toHaveProperty('message', 'new section added')
    })
})