import { Router } from "express";
const router = Router();
import sendToken from "../utils/jwtToken.js";
import Admin from "../model/admin.js";
import { isAdminAuthenticated } from "../middleware/auth.js";

// Sign Up Admin
router.post("/create-admin", isAdminAuthenticated, async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);

    // Check if the admin already exists
    const adminEmail = await Admin.findOne({ email: email });
    if (adminEmail) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    // Create the admin directly
    const admin = await Admin.create({
      name: name,
      email: email,
      password: password,
    });

    // Send success response with token
    sendToken(admin, 201, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Login Admin
router.post("/login-admin", isAdminAuthenticated, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if the admin exists
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter email and password",
      });
    }

    // Find the admin
    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if the password is correct
    const isPasswordMatch = await admin.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Send success response with token
    sendToken(admin, 200, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Load Admin
router.get("/getadmin", isAdminAuthenticated, async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.user.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }
    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Logout Admin
router.get("/logout-admin", isAdminAuthenticated, async (req, res, next) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({
      success: true,
      message: "Admin Logged out",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
