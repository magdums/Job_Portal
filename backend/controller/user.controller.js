import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

//register logic
export const register = async (req, res) => {
    try {
        const { fullname, email, password, phoneNumber, role } = req.body;
        if (!fullname || !email || !password || !phoneNumber || !role) {
            return res.status(400).json({
                message: "something is missing",
                success: false
            })
        }
        const file = req.file;
        const fileuri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileuri.content);
        
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "user already exist",
                success: false
            })
        }

        const hashpassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            password: hashpassword,
            phoneNumber,
            role,
            profile:{
                profilePhoto :cloudResponse.secure_url,
            }
        })
        return res.status(201).json({
            message: "Account has been created",
            success: true
        })
    } catch (error) {
        console.log(error);

    }
}


//login logic
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "something is wrong",
                success: false
            })
        }

        //check user exist or not in User database
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "incorrect email or password",
                success: false
            })
        };

        //check password
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            return res.status(400).json({
                message: "incorrect email or password",
                success: false
            })
        };

        //check role
        if (role != user.role) {
            return res.status(400).json({
                message: "account doesn't exist with current role",
                success: false
            })
        };

        
        //jwt token generation for authority and authorization
        const tokenData = { userID: user._id } //payload
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' }); //signature
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile

        }
        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: "strict" }).json({
            message: `welcome back ${user.fullname}`,
            user,
            success: true
        })
    }
    catch (error) {
        console.log(error);

    }
}


//logout logic
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "logged out successully",
            success: true
        })
    } catch (error) {
        console.log(error);

    }
}

//update profile logic
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;
        

        //cloudinary 
        const fileuri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileuri.content);
        let skillsArray;
        if (skills) {
            skillsArray = Array.isArray(skills) ? skills : skills.split(",").map(skill => skill.trim());
        }
    
        const userId = req.id; //id from middleware
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            })
        }

        ///updating data
        if(fullname) user.fullname = fullname
        if(email) user.email = email
        if(phoneNumber)  user.phoneNumber = phoneNumber
        if(bio) user.profile.bio = bio
        if (skillsArray.length > 0) user.profile.skills = skillsArray;
        //resume update
        if(cloudResponse){
            user.profile.resume = cloudResponse.secure_url // save the cloudinary url
            user.profile.resumeOriginalName = file.originalname // Save the original file name
        }
        await user.save()

        user = {
            _id: user._id,
            name: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile

        }
        return res.status(200).json({
            message:"Profile updated successfully",
            user,
            success:true
        })

    } catch (error) {
        console.log(error);
    }
}