import express from "express";
import isAuthenticated from "../middleware/isAutenticated.js";
import { getCompany, getCompanyById, registerComapany, updateCompany } from "../controller/company.controller.js";
import { singleUpload } from "../middleware/multer.js";
const router = express.Router();

router.route("/register").post(isAuthenticated,registerComapany);
router.route("/get").get(isAuthenticated,getCompany);
router.route("/get/:id").get(isAuthenticated,getCompanyById);
router.route("/update/:id").put(isAuthenticated,singleUpload, updateCompany);


export default router;