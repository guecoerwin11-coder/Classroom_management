const mongoose = require('mongoose')

const mongooseDatabase = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            tls: true,
            tlsAllowInvalidCertificates: true,
            serverSelectionTimeoutMS: 1000
        })

        console.log('database connection success!')
    }catch(err){
        console.log('mongo database error', err.message)
    }
}

module.exports = mongooseDatabase