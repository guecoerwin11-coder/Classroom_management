const User = require('../models/authModels')
const prisma = require('../configs/postgres')

const addSection = async (req, res) => {
    try{

        const userId = req.user.id;

        const { section_name } = req.body;

        const section = await prisma.section.create({
            data: {
                userId: userId,
                section_name: section_name
            }
        })


        res.status(201).json({
            message: 'new section added'
        })

    }catch(err){
         res.status(500).json({message: err.message})
    }
}

const getSections = async (req, res) => {
    try{

        const sections = await prisma.section.findMany({
            include: {
                subjects: true,
                students: true
            }
        })

        res.status(200).json({
            data: sections
        })
    }catch(err){
         res.status(500).json({message: err.message})
    }
}

const getSection = async (req, res) => {
    try{

        const sectionId = req.params.id;

        const section = await prisma.section.findUnique({
            where: {
                id: sectionId
            },
            select: {
                name: true
            },
            include: {
                students: true
            }
        })
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

module.exports = {
    addSection, getSections, getSection
}