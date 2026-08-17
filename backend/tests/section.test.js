const path = require('path');
require('dotenv').config();
const request = require('supertest')
const app = require('../src/app')
const prisma = require('../src/configs/postgres')
const mongoose = require('mongoose');
const { jwtDecode } = require('jwt-decode')

const { getTeacherToken } = require('../tests/helpers/authHelpers') //sample account use

let authToken = "";     //generated token store
let teacherId = ""      //generated id 

//before testing
beforeAll( async () => {
    try{
        //clean up all the account testing in prisma database
        await prisma.section.deleteMany({})

        //connect to the mongo database testing
        const mongoUri = process.env.MONGO_URI_TEST

        
        if(mongoose.connection.readyState === 0){
            await mongoose.connect(mongoUri)
        }

        //get the token from the acount helpers
        authToken = await getTeacherToken(app)

        //decode the authToken 
        const decoded = jwtDecode(authToken)

        //get the decode account id
        teacherId = decoded.id

    }catch(err){
        console.log('Setup failed', err.message)
        throw err;
    }
}, 15000) //timer as for testing

//after the testing should disconnect all
afterAll(async () => {
    await prisma.$disconnect();
    if(mongoose.connection.readyState !== 0){
        await mongoose.connection.close();
    }
})

// --- THE REST OF YOUR TEST CODE LIVES CLEANLY DOWN HERE ---
describe('API section of student', () => {
    //should create a new section
    it('should add a new section', async () => {
        const res = await request(app)
            .post('/api/sections/add')  //routes
            .set('Authorization', `Bearer ${authToken}`) // Injects the generated helper token
            .send({     //data to send
                "section_name": "Apple"
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'new section added');
    });

    //get all the sections 
    it('should get all the sections here', async () => {
        //create a test section 
        await prisma.section.create({
            data: {
                "section_name": "banana",
                "userId": teacherId
            }
        });

        //get the section 
        const res = await request(app)
            .get('/api/sections') //router
            .set('Authorization', `Bearer ${authToken}`);

        if(res.statusCode === 500){
            console.log('real server error', res.body)
        }

        expect(res.statusCode).toBe(200);
    })

    //get one section
    it('should get a one specific section here', async () => {
        //add a testing section
        const createSection = await prisma.section.create({
            data: {
                "section_name": "gumamela",
                "userId": teacherId
            }
        });

        //get the section by id
        const getSectionId = createSection.id;

        //get the section using id
        const res = await request(app)
            .get(`/api/sections/${getSectionId}`)
            .set('Authorization', `Bearer ${authToken}`);

            if(res.statusCode !== 200){
                console.log("Single Retrieval error", res.body)
            }

        expect(res.statusCode).toBe(200);
    })

    //get the section if not existed
    it("should return error if the section is not existed", async () => {
        const fakeId = 99999;   //fake id number

        const res = await request(app)
            .get(`/api/section/${fakeId}`)
            .set('Authorization', `Bearern ${authToken}`)

        expect(res.statusCode).toBe(404)
        
    })
});