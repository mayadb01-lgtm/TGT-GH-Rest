import jwt from "jsonwebtoken";
import User from "../model/user.js";
import Admin from "../model/admin.js";
import process from "process";

export const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Please login to continue",
    });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decoded.id);

  next();
};

export const isAdminAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Please login to continue",
    });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await Admin.findById(decoded.id);

  next();
};

export const isAdmin = async (req, res, next) => {
  if (req.user?.role !== "Admin") {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to access this route",
    });
  }

  next();
};

export default {
  isAuthenticated,
  isAdminAuthenticated,
  isAdmin,
};
