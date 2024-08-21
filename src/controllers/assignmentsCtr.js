const {PrismaClient} = require('@prisma/client');


const prisma = new PrismaClient

async function allAssignments(req, res, next) {
     try{
            const assignments = await prisma.assignment.findMany();
            console.log("Found %d assignments",assignments.length);

            res.json({
                status: 200,
                message: "Successfully retrieved assignments list",
                total: assignments.length,
                assignments: assignments  
           
            })
     }
     catch(e){
         console.error(e)
         res.status(500).json({ message: 'Failed to fetch assignments' })
     }
}

async function getAssignmentsById(req,res,next){
    try {
        const assgmnt = await prisma.assignment.findUnique({
            where: { id: parseInt(req.params.id) }
        })
        if (!assgmnt) {
            return res.status(404).json({ message: 'Assignment not found' })
        }
        res.json({
            status: 200,
            message: "Assignment retrieved successfully",
            assignment: assgmnt
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to fetch assignments' })
    }
}

async function newAssignment(req, res, next) {
    const { title, description, deadline, instructions, files, pages, typeOfPaper, discipline, qualityLevel, format, sources, clientId } = req.body;

    try {
        const assignment = await prisma.assignment.create({
            data: {
                title,
                description,
                deadline,
                instructions,
                files,
                pages,
                typeOfPaper,
                discipline,
                qualityLevel,
                format,
                sources,
                clientId,
            },
        });

        res.status(201).json({
            message: "Assignment created successfully",
            assignment,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


async function updateAssignment(req, res, next) {
    const {id} = req.params;
    const { title, description, deadline, instructions, files, pages, typeOfPaper, discipline, qualityLevel, format, sources, clientId } = req.body;

    try {
        const assignment = await prisma.assignment.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                deadline,
                instructions,
                files,
                pages,
                typeOfPaper,
                discipline,
                qualityLevel,
                format,
                sources,
                clientId,
            },
        });

        res.json({
            status: 200,
            message: "Assignment updated successfully",
            assignment,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function deleteAssignment(req, res, next) {
        const {id} = req.params;

    try {

        const assgmnt = await prisma.assignment.findUnique({
            where: {id: parseInt(id,10)},
        })

        if(!assgmnt) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        await prisma.assignment.delete({
            where: { id: parseInt(id, 10) },
        })

        res.status(204).json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to delete assignments' })
    }
}



module.exports = {
    allAssignments,
    getAssignmentsById,
    deleteAssignment,
    newAssignment,
    updateAssignment

}