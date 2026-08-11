const prisma = require('../configs/postgres')

const createSubject = async (req, res) => {
    try{

        const userId = req.user.id
        const {subjectName} = req.body;

        const subject = await prisma.subject.create({
            data: {
                userId: userId,
                subject_name: subjectName
            }
        })

        res.status(201).json({
            message: 'new subject added!'
        })
    }catch(err){
        res.status(500).json({message: err.message})
    }
}

const getSubject = async (req, res)=> {
    try{
        const subjectId = req.params.id

        const subject = await prisma.subject.findUnique({
            where: {
                id: parseInt(subjectId)
            }
        })

        if(!subject){
            return res.status(404).json({
                message: 'no subject exist'
            })
        }

        res.status(200).json({
            data: subject
        })
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}


module.exports = {
    createSubject, getSubject
}