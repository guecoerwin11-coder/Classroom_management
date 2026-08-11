const User = require('../models/authModels')
const prisma = require('../configs/postgres')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const token = require('./tokens/tokens')

const register = async (req, res) => {
    try{

        const {firstName, lastName, email, role, password} = req.body;

        const isExist = await User.findOne({ email });

        if(isExist){
            return res.status(401).json({message: 'Email is already Exist'})
        }

        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password, salt)

        const user = await User.create({
            firstName, lastName, email, 
            role, password: hashPass
        })

        const jwtToken = token(user);

        res.status(201).json({
            message: 'user created!',
            token: jwtToken
        })
    }catch(err){
        res.status(500).json({message: err.message})
    }
}

const login = async (req, res) => {
    try{

        const {email, password} = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({
                message: 'email is not register'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(401).json({
                message: 'wrong password!, invalid credentials'
            })       
        }

        const jwtToken = token(user);

        res.status(200).json({
            message: 'login succes!', 
            token: jwtToken
        })
    }catch(err){
        res.status(500).json({message: err.message})
    }
}

module.exports = {
    register, login
}