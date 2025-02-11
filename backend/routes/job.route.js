import express from "express";
import isAuthenticated from "../middleware/isAutenticated.js";
import { getAllJobs, postJob, getAdminJobs, getJObById } from "../controller/job.controller.js";


const router = express.Router();

router.route("/post").post(isAuthenticated,postJob);
router.route("/get").get(isAuthenticated,getAllJobs);
router.route("/getadminjobs").get(isAuthenticated,getAdminJobs);
router.route("/get/:id").get(isAuthenticated, getJObById);


export default router;