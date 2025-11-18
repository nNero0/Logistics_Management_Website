import express from "express";
import authRoutes from "./routes/authRoutes.js";
import PhuongTienRoutes from "./routes/PhuongTienRoutes.js";

import TaiXeRoutes from "./routes/TaiXeRoutes.js";
import KhoBaiRoutes from "./routes/KhoBaiRoutes.js";
import HangHoaRoutes from "./routes/HangHoaRoutes.js";
import KhachHangRoutes from "./routes/KhachHangRoutes.js";
import LoTrinhRoutes from "./routes/LoTrinhRoutes.js";
import DonVanRoutes from "./routes/DonVanRoutes.js";
import DieuPhoiRoutes from "./routes/DieuPhoiRoutes.js";
import ThongKeRoutes from "./routes/ThongKeRoutes.js";
import InvoiceRoutes from "./routes/InvoiceRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/phuongtien", PhuongTienRoutes);
app.use("/api/taixe", TaiXeRoutes);
app.use("/api/khobai", KhoBaiRoutes);
app.use("/api/hanghoa", HangHoaRoutes);
app.use("/api/khachhang", KhachHangRoutes);
app.use("/api/lotrinh", LoTrinhRoutes);
app.use("/api/donvan", DonVanRoutes);
app.use("/api/hanghoa", HangHoaRoutes);
app.use("/api/dieuphoi", DieuPhoiRoutes);
app.use("/api/thongke", ThongKeRoutes);
app.use("/api/invoice", InvoiceRoutes);
// app.use(notFound);
// app.use(errorHandler);

export default app;
