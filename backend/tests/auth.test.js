require('dotenv').config()
const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');


//connect tempory
//beforeAll this to set up all like the test database
beforeAll(async () => {
    const mongoUri = process.env.MONGO_URI_TEST
    await mongoose.connect(mongoUri)
})


//this After drop test collections and close the connection
afterAll( async () => {
    if(mongoose.connection.db){
        await mongoose.connection.db.dropDatabase()    //for primsa
    }
    await mongoose.connection.close()   //for mongo
})

//describe the main testing of each router
describe("Auth API Endpoints", () => {
    it('should successfully register', async () => {    //the expected output
        const res = await request(app)      //create a post authentication
            .post('/api/auth/register')
            .send({
                "firstName": "Erwin",
                "lastName": "Muega",
                "email":"win@gmail.com",
                "role":"Teacher",
                "password":"winwin"
            });

            //output 
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('token')
    })

    //testing if the email is already registered
    it('should error if the email is already registered', async () => {
        //register tetsing account
        await request(app)
        .post('/api/auth/register')
        .send({
                "firstName": "Rona",
                "lastName": "Muega",
                "email":"rona@gmail.com",
                "role":"Teacher",
                "password":"ronamae"
        })

        //try register again and since it was already saved
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                "firstName": "Rona",
                "lastName": "Muega",
                "email":"rona@gmail.com",
                "role":"Teacher",
                "password":"ronamae"
            });

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message','Email is already Exist')
    })

    //check if the email is not register
    it('should the email is to register first', async () =>{
        //try login-In and the email si not ergister 
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                "email":"apey@gmail.com",
                "password":"apey123"
            })

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message','email is not register')
    })

    //test if a successful login
    it('should login success the API', async () => {
        //register first sample account
        await request(app)
            .post('/api/auth/register')
            .send({
                "firstName": "Rona Mae",
                "lastName": "Muega",
                "email":"mae@gmail.com",
                "role":"Teacher",
                "password":"ronamae"
            })
        
            //login here again
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                "email":"mae@gmail.com",
                "password":"ronamae"
            });
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message','login succes!')
        expect(res.body).toHaveProperty('token')
    })
})
