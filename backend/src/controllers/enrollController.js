const prisma = require('../configs/postgres')

const enrollStudent = async (req, res)=> {
    try{
        
        //input the  section id and student id who want to enroll
        const {sectionId, studentId} = req.body;

        const section = await prisma.section.findUnique({
            where: {
                id: parseInt(sectionId)
            }
        })

        //if the student is not exist
        if(!section){
            return res.status(404).json({
                message: 'no section exist'
            })
        }

        //count the student currently enroll
        const countStudent = await prisma.sectionStudent.count({
            where: {
                sectionId: parseInt(sectionId)
            }
        })

        //check if the section is full of 30
        if(countStudent >= 30){
            return res.status(400).json({
                success: false,
                message: 'Enrollment failed. This section is full'
            })
        }

        //check if the student is already enroll the subject
        const isEnroll = await prisma.sectionStudent.findUnique({
            where: {
                sectionId_studentId: {
                    sectionId: parseInt(sectionId),
                    studentId: studentId
                }
            }
        });

        //if true the student is already enroll return error
        if(isEnroll){
            return res.status(400).json({
                message: 'student is already enrolled'
            })
        }

        const newEnroll = await prisma.sectionStudent.create({
            data: {
                sectionId: parseInt(sectionId),
                studentId: studentId //id from mongo database
            }
        });


        res.status(201).json({
            message: 'new student enroll!',
            data: newEnroll
        })

    }catch(err){
         res.status(500).json({message: err.message})
    }
}

module.exports = enrollStudent;