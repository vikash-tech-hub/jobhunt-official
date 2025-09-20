import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const { fullname, email, password, role, phoneNumber } = req.body;

    if (!fullname || !email || !password || !role || !phoneNumber) {
      return res.status(400).json({ message: "Something is missing", success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists", success: false });
    }

    let profilePhotoUrl = "";
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      profilePhotoUrl = cloudResponse.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullname,
      email,
      password: hashedPassword,
      role,
      phoneNumber,
      profile: { profilephoto: profilePhotoUrl },
    });

    return res.status(201).json({ message: "User created successfully", success: true });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Something is missing", success: false });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Incorrect email or password", success: false });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Incorrect email or password", success: false });
    }

    if (role !== user.role) {
      return res.status(400).json({ message: "Account does not exist with current role", success: false });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

    const userData = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production", // ✅ only secure in prod
      })
      .json({ message: `Welcome back ${user.fullname}`, user: userData, success: true });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { maxAge: 0, httpOnly: true, sameSite: "strict" })
      .json({ message: "Logged out successfully", success: true });
  } catch (error) {
    console.error("Logout Error:", error);
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;

    const userId = req.id; // ✅ comes from JWT middleware
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skills.split(",");

    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, { resource_type: "raw" });
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeoriginalname = req.file.originalname;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
      success: true,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
