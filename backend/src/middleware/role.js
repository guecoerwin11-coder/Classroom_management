const User = require('../models/authModels')

const isTeacher = async (req, res, next) => {
    try{
        const user = await User.findById(req.user.id)
        
        if(!user || user.role !== "Teacher"){
            return res.status(403).json({message: 'Teacher Access Only'})
        }

        next()

    }catch(err){
        res.status(500).json({message: err.message})
    }
}

modele.exports = isTeacher;