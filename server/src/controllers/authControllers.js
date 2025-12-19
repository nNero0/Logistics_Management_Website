import TaiKhoan from "../models/taikhoan.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authController = {
  async register(req, res) {
    try {
      console.log("Request Body Received:", req.body);
      const { Username, PasswordHash, Email, Sdt } = req.body;

      const hashedPassword = await bcrypt.hash(PasswordHash, 10);
      const newTaiKhoan = await TaiKhoan.create({
        Username,
        PasswordHash: hashedPassword,
        Email,
        Sdt,
      });

      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      res.status(500).json({ message: `{error}` });
      console.log(error);
    }
  },
  async login(req, res) {
    console.log("Is the TaiKhoan model loaded?", TaiKhoan);
    try {
      console.log("Request Body Received:", req.body);
      const { email, password } = req.body;
      const user = await TaiKhoan.findOne({ where: { email } });
      console.log(user);

      if (!user) {
        console.log(1);
        return res.status(404).json({ message: "user not found" });
      }
      const isMatch = await bcrypt.compare(password, user.PasswordHash);
      if (!isMatch) {
        return res.status(400).json({ message: "Login info invalid" });
      }
      const payload = {
        id: user.dataValues.IdTaiKhoan,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(200).json({
        message: "Logged in successfully!",
        token: token,
      });
    } catch (error) {
      console.error("ERROR IN LOGIN:", error);
      res.status(500).json({ message: "Error logging in.", error: error.message });
    }
  },
  async verify(req, res) {
    try {
      res.status(200).json({
        id: req.user.IdTaiKhoan,
        Username: req.user.Username,
        Email: req.user.Email,
        Sdt: req.user.Sdt,
      });
    } catch (error) {
      console.error("ERROR IN VERIFY:", error);
      res.status(500).json({ message: "Error verifying token." });
    }
  },
};
export default authController;
