import LoTrinh from "../models/lotrinh.js";

const LoTrinhControllers = {

  async CreateLoTrinh(req, res) {
    try {
      console.log("CREATE Lo trinh RECEIVED:", req.body);
      

      const { TenLoTrinh, IdKhoBaiBatDau, IdKhoBaiKetThuc, KhoangCach } = req.body;


      if (!TenLoTrinh || !IdKhoBaiBatDau || !IdKhoBaiKetThuc || KhoangCach === undefined) {
        return res.status(400).json({ message: "Missing required fields." });
      }


      const newLoTrinh = await LoTrinh.create({
        TenLoTrinh,
        IdKhoBaiBatDau,
        IdKhoBaiKetThuc,
        KhoangCach
      });


      res.status(201).json({ newLoTrinh });
    } catch (error) {
      console.error("Lo Trinh creation error:", error);
      res.status(500).json({ message: "Error creating Lo Trinh.", error: error.message });
    }
  },

};

export default LoTrinhControllers;