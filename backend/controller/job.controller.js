import { Job } from "../models/job.model.js";

//post by admin
export const postJob = async (req, res) => {
    try {
        const { title, requirements, description, salary, location, jobType,experience, position, companyId } = req.body;
        const userID = req.id;
        if (!title || !requirements || !description || !salary || !location || !jobType || !experience || !position || !companyId) {
            res.status(400).json({
                message: "Something is missing",
                success: "false"
            })
        }
        const job = await Job.create({
            title,
            requirements: requirements.split(","),
            description,
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userID

        })
        return res.status(201).json({
            message: "new job created successfully",
            job,
            success: true
        })
    } catch (error) {
        console.log(error);

    }

}

//for students
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company",
            select: 'name',
        }).sort({ createdAt: -1 }); //populate is used to obtain name of company rather than its id
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

//for students
export const getJObById = async (req, res) => {
    try {
        const jobID = req.params.id;
        const job = await Job.findById(jobID).populate({
            path:"applications"
        });;
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        }
        return res.status(200).json({
            job,
            success: true
        })
    } catch (error) {
        console.log(error);

    }
}

// for admin
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}